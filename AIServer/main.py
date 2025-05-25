import os
from urllib.parse import urlparse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
from numpy import array  # ייבוא ספציפי של array
import openai
import requests
from io import BytesIO
from pinecone import Pinecone, ServerlessSpec  # ייבוא של Pinecone ו-Spec
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer  # ייבוא של SentenceTransformer
from pydantic import BaseModel  # ייבוא של BaseModel


load_dotenv()

# Set ssl_verify to True for secure requests
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"), ssl_verify=False)
spec = ServerlessSpec(cloud="aws", region="us-east-1")
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
index = pc.Index("musicfiles")
pinecone_index_name = "musicfiles"
embedding_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')
time.sleep(1)
pinecone = Pinecone(
    api_key=os.getenv("PINECONE_API_KEY"),
    ssl_verify=False
)
spec = ServerlessSpec(
    cloud="aws",
    region="us-east-1"
)
openai_api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = openai_api_key

def check_status(transcription_id, api_key):
    url = f"https://hebrew-ai.com/api/transcribe?id={transcription_id}"
    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    while True:
        response = requests.get(url, headers=headers, verify=False)
        if response.status_code == 200:
            data = response.json()
            if data["status"] == "COMPLETED":
                return data["text"]  # Return the transcribed text
            elif data["status"] == "FAILED":
                return None  # Return None if failed
        else:
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
        "file": (filename, BytesIO(response.content), 'audio/mp3')
    }
    data = {
        "language": "he"
    }

    response = requests.post(url, headers=headers, files=files, data=data, verify=False)  # Ensure SSL verification
    if response.status_code == 200:
        data = response.json()
        transcription_id = data.get("transcriptionId")
        text = check_status(transcription_id, api_key)
        return text
    else:
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
    return response.choices[0].message.content.strip()

def split_text(text, max_chunk_size=500):
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) <= max_chunk_size:
            current_chunk += para + "\n\n"
        else:
            chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"

    if current_chunk:
        chunks.append(current_chunk.strip())    
    return chunks

def get_embedding(text):
    text_chunks = split_text(text)
    embeddings = embedding_model.encode(text_chunks)   
    return embeddings

def store_song(user_id, song_id, embeddings, metadata):
    vectors = [] 
    if pinecone_index_name not in pinecone.list_indexes().names():
        pinecone.create_index(
            name=pinecone_index_name,
            dimension=len(embeddings[0]),
            metric="cosine",
            spec=spec
        )
    
    for embedding in embeddings:  # Change this line to iterate directly over embeddings
        vectors.append({
            "id": f"{user_id}:{song_id}",
            "values": embedding.tolist() if hasattr(embedding, 'tolist') else embedding,  # Check if tolist exists
            "metadata": metadata
        })

    index.upsert(vectors)

def search_similar_songs(user_id, query_text, top_k=5):
    query_embedding = get_embedding(query_text)
    if isinstance(query_embedding, np.ndarray):
        query_embedding = query_embedding.tolist() 
    results = index.query(
        vector=query_embedding[0],  # Use the first embedding if it's a batch
        top_k=top_k,
        include_metadata=True,
        filter={"user_id": user_id,"score": {"$gte": 0.5}}  # Adjust the filter as needed
    )
    for match in results.get("matches", []):
        if isinstance(match, dict) and "values" in match:
            match.pop("values", None)  # Safely remove the 'values' field
    matches = [
        match["metadata"]["song_id"]
        for match in results.get("matches", [])       
    ]
    return matches
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AudioRequest(BaseModel):
    user_id: str
    song_id: str
    Audio: str
@app.post("/process-audio/")
async def process_audio(request: AudioRequest):
    try:
        user_id = request.user_id
        song_id = request.song_id
        audio_url = request.Audio

        data = transcribe_audio(audio_url)
        if not data:  # Check if transcription failed
            return {"error": "Transcription failed."}
        lyrics = extract_lyrics(data)
        analysis = analyze_song_content(lyrics)
        full_text = lyrics + "\n" + analysis
        embedding = get_embedding(full_text)
        metadata = {"user_id": user_id, "song_id": song_id}
        store_song(user_id, song_id, embedding, metadata)
        return {"message": "שיר נשמר בהצלחה"}
    except Exception as e:
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
        return {"error": "שגיאה במחיקת השיר", "details": str(e)}
@app.get("/")
def read_root():
    return {"message": "שרת פעיל!"}