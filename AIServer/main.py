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

# Set ssl_verify to True for secure requests
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"), ssl_verify=False)
spec = ServerlessSpec(cloud="aws", region="us-east-1")
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
index = pc.Index("musicfiles")
time.sleep(1)

openai_api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = openai_api_key

def check_status(transcription_id, api_key):
    print("Checking status for transcription ID:", transcription_id)
    url = f"https://hebrew-ai.com/api/transcribe?id={transcription_id}"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    while True:
        response = requests.get(url, headers=headers, verify=True)  # Ensure SSL verification
        if response.status_code == 200:
            data = response.json()
            print("Status:", data["status"])
            if data["status"] == "COMPLETED":
                print("Transcribed text:", data["text"])
                return data["text"]  # Return the transcribed text
            elif data["status"] == "FAILED":
                print("Transcription failed.")
                return None  # Return None if failed
        else:
            print("Error:", response.status_code, response.text)
            return None
        time.sleep(5)

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

    response = requests.post(url, headers=headers, files=files, data=data, verify=True)  # Ensure SSL verification

    if response.status_code == 200:
        data = response.json()
        print("Transcription started successfully.", data)
        transcription_id = data.get("transcriptionId")
        print("Transcription ID:", transcription_id)
        text = check_status(transcription_id, api_key)
        return text
    else:
        print("Error:", response.status_code, response.text)
        return None

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
    print("Analysis response:", response)
    return response.choices[0].message.content.strip()

openai_embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)

def get_embedding(text):
    embeddings =openai_embeddings.embed_documents([text])[0]
    return embeddings

def store_song(user_id, song_id, embedding, metadata):
    index.upsert(vectors=[{
        "id": f"{user_id}:{song_id}",
        "values": embedding,
        "metadata": metadata
    }])
    print("Song stored successfully!", metadata)

def search_similar_songs(user_id, query_text, top_k=5):
    query_embedding = get_embedding(query_text)
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True,
        filter={"user_id": user_id}
    )
    return results["matches"]

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
        if not data:  # Check if transcription failed
            return {"error": "Transcription failed."}
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
@app.delete("/delete-song/")
def delete_song(user_id: str, song_id: str):
    try:
        index.delete(ids=[f"{user_id}:{song_id}"])
        return {"message": "השיר נמחק בהצלחה"}
    except Exception as e:
        print(f"Error deleting song: {e}")
        return {"error": "שגיאה במחיקת השיר", "details": str(e)}
@app.get("/")
def read_root():
    return {"message": "שרת פעיל!"}