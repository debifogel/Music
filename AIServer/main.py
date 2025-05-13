import os
from urllib.parse import urlparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import OpenAIEmbeddings
import time
import openai
import requests
from io import BytesIO
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
load_dotenv()
# אתחול pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"), ssl_verify=False)
spec = ServerlessSpec(cloud="aws", region="us-east-1")
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
index = pc.Index("musicfiles")
time.sleep(1)

# אתחול OpenAI
openai_api_key=os.getenv("OPENAI_API_KEY")
openai.api_key = openai_api_key
#get from ivrit ai
def check_status(transcription_id, api_key):
    print("Checking status for transcription ID:", transcription_id)
    url = f"https://hebrew-ai.com/api/transcribe?id={transcription_id}"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    while True:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("Status:", data["status"])
            if data["status"] == "COMPLETED":
                print("Transcribed text:", data["text"])
                break
            elif data["status"] == "FAILED":
                print("Transcription failed.")
                break
        else:
            print("Error:", response.status_code, response.text)
            break
        time.sleep(5)  # המתן 5 שניות לפני בדיקה חוזרת
# תמלול קובץ שמע
def transcribe_audio(file_path):
    url = "https://hebrew-ai.com/api/transcribe"
    api_key = os.getenv("IVRITAI_API_KEY")
    headers = {"Authorization": f"Bearer {api_key}"}

    response = requests.get(file_path)
    response.raise_for_status()
    filename = os.path.basename(urlparse(file_path).path)

    files = {
        "file": (filename, BytesIO(response.content), 'audio/mpeg')
    }
    data = {
        "language": "he"
    }

    response = requests.post(url, headers=headers, files=files, data=data)
    
    if response.status_code == 200:
        data = response.json()
        print("Transcription started successfully.",data)
        transcription_id = data.get("transcriptionId")
        print("Transcription ID:", transcription_id) 
        text=check_status(transcription_id, api_key)
        return text
    else:
        print("Error:", response.status_code, response.text)
        return None

# הסרת דיבור חיצוני מתוך טקסט
def extract_lyrics(raw_text):
    prompt = f"""
    הנה טקסט מתוך הקלטה של שיר. השאר רק את מילות השיר, הסר דיבורים חיצוניים:
    ---
    {raw_text}
    ---
    """
    response = openai.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# ניתוח רגשות ומחשבות
def analyze_song_content(lyrics):
    prompt = f"""
    נתח את השיר הבא והצג את הרגשות, המחשבות והרצונות שהוא מבטא:
    ---
    {lyrics}
    """
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()

# יצירת embedding
openai_embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

def get_embedding(text):
    embeddings = openai_embeddings.embed_documents([text])[0]
    return embeddings

# שמירה ב־Pinecone
def store_song(user_id, song_id, embedding, metadata):
    index.upsert(vectors=[{
        "id": f"{user_id}:{song_id}",
        "values": embedding,
        "metadata": metadata
    }])
    print ("Song stored successfully!", metadata)
# חיפוש שירים דומים
def search_similar_songs(user_id, query_text, top_k=5):
    query_embedding = get_embedding(query_text)
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        filter={"user_id": user_id}
    )
    return results["matches"]

# FastAPI
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/process-audio/")
async def process_audio(user_id: str, song_id: str, Audio: str):
    try:
        data = transcribe_audio(Audio)
        lyrics = extract_lyrics(data)
        analysis = analyze_song_content(lyrics)
        full_text = lyrics + "\n" + analysis
        embedding = get_embedding(full_text)
        metadata = {"user_id": user_id, "song_id": song_id, "lyrics": lyrics, "analysis": analysis}
        store_song(user_id, song_id, embedding, metadata)
        return {"message": "שיר נשמר בהצלחה", "lyrics": lyrics, "analysis": analysis}
    except Exception as e:
        print(f"Error processing audio: {e}")
        return {"error": "שגיאה בעיבוד השיר", "details": str(e)}

@app.get("/search-similar/")
def search_similar(user_id: str, query: str):
    matches = search_similar_songs(user_id, query)
    return matches

@app.get("/")
def read_root():
    return {"message": "שרת פעיל!"}
