import os
from urllib.parse import urlparse
from fastapi import FastAPI 
import whisper
import openai
from langchain_community.embeddings import OpenAIEmbeddings
from pinecone import Pinecone
from pinecone import ServerlessSpec
import time
import requests 
from io import BytesIO

# אתחול pinecone

pc = Pinecone(api_key="pcsk_PiBhL_HqbSJ8iZm38SV6nPZQEobLvKXV5DLetfU1HQkT7TqFkptPMaqvdhReUh4AUfbLj",              
              ssl_verify=False)
spec = ServerlessSpec(
    cloud="aws", region="us-east-1"
)
existing_indexes = [
    index_info["name"] for index_info in pc.list_indexes()
]
index = pc.Index("musicfiles")
time.sleep(1)

# אתחול Whisper (תמלול)
model_whisper = whisper.load_model("base")
# אתחול OpenAI
openai_api_key="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"
# תמלול קובץ שמע
def transcribe_audio(file_path):
    url = "https://hebrew-ai.com/api/transcribe" 
    api_key = "YOUR_API_KEY"     
    headers = { 
        "Authorization": f"Bearer {api_key}" 
    } 
    response = requests.get(file_path)
    response.raise_for_status()
    filename = os.path.basename(urlparse(file_path).path)  # -> 'awesome_song.mp3'

    files = {
         "file": (filename, BytesIO(response.content))
    }
    response = requests.post(url, headers=headers, files=files) 
     
    if response.status_code == 200: 
        data = response.json() 
        # Wait for the transcription to complete
        while True:
            response = requests.get(url, headers=headers) 
            if response.status_code == 200: 
                data = response.json() 
                if data["status"] == "completed": 
                    return data["text"] 
                elif data["status"] == "failed":
                    return "Transcription failed"
    else: 
        print("Error:", response.status_code, response.text)
        return None

# שליחה למודל NLP להסרת מילים שאינן חלק מהשיר (למשל דיבור חיצוני)
def extract_lyrics(raw_text):
    prompt = f"""
    הנה טקסט מתוך הקלטה של שיר. השאר רק את מילות השיר, הסר דיבורים חיצוניים:
    ---
    {raw_text}
    ---
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"].strip()

# ניתוח רגשות, מחשבות ורצונות
def analyze_song_content(lyrics):
    prompt = f"""
    נתח את השיר הבא והצג את הרגשות, המחשבות והרצונות שהוא מבטא:
    ---
    {lyrics}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    return response["choices"][0]["message"]["content"].strip()

# יצירת embedding
openai_embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
def get_embedding(text):
    embeddings = openai_embeddings.embed_documents(text)
    return embeddings

# שמירת שיר ב־Pinecone
def store_song(user_id, song_id, embedding, metadata):
    index.upsert(vectors=[{
        "id": f"{user_id}:{song_id}",
        "values": embedding,
        "metadata": metadata
    }])

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

app = FastAPI()

@app.post("/process-audio/")
async def process_audio(user_id: str, song_id: str, Audio: str):
    try:
        # Send a GET request to download the file
        data=transcribe_audio(Audio)  # Assuming this function transcribes the audio and returns the text
        
        lyrics = extract_lyrics(data)  # Assuming extract_lyrics extracts song lyrics from the transcribed text
        analysis = analyze_song_content(lyrics)  # Assuming analyze_song_content analyzes the lyrics for insights

        # Combine the lyrics and analysis
        full_text = lyrics + "\n" + analysis
        
        # Get an embedding of the full text
        embedding = get_embedding(full_text)

        # Prepare metadata to store
        metadata = {"user_id": user_id, "song_id": song_id, "lyrics": lyrics, "analysis": analysis}

        # Store the song and its embedding
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