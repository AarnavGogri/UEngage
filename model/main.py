import os
# Force transformers to use PyTorch instead of TensorFlow/Keras
os.environ["USE_TF"] = "0"

import re
import pandas as pd
import uuid
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import enchant  # pyenchant

app = FastAPI(title="UW Clubs Search API")

# Initialize the English dictionary from pyenchant
english_dict = enchant.Dict("en_US")

# Get the absolute path of the CSV file (ensure club_details.csv is in the same folder)
csv_path = os.path.join(os.path.dirname(__file__), "club_details.csv")

# Load CSV
try:
    clubs_df = pd.read_csv(csv_path)
except Exception as e:
    raise Exception(f"Error loading CSV: {e}")

# Replace NaN values with empty strings
clubs_df.fillna("", inplace=True)

# Rename columns to match expected format
clubs_df.rename(columns={"Club": "name", "About": "description", "URL": "link"}, inplace=True)

# Generate unique IDs if missing
if "id" not in clubs_df.columns:
    clubs_df["id"] = [str(uuid.uuid4()) for _ in range(len(clubs_df))]

# Create combined text for embeddings using .str.strip() on each Series
clubs_df["combined_text"] = (
    clubs_df["name"].fillna("").astype(str).str.strip() + ". " +
    clubs_df["description"].fillna("").astype(str).str.strip()
)

# Remove rows with empty club names
clubs_df = clubs_df[clubs_df["name"].str.strip() != ""]

# Initialize the SentenceTransformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Compute embeddings for each club and normalize them
club_embeddings_np = model.encode(clubs_df["combined_text"].tolist())
club_embeddings_np = club_embeddings_np / np.linalg.norm(club_embeddings_np, axis=1, keepdims=True)
club_embeddings = club_embeddings_np.tolist()  # Convert to list

# Request and response models
class SearchRequest(BaseModel):
    query: str

class Club(BaseModel):
    id: str
    name: str
    description: str
    link: str
    category: Optional[str] = ""
    similarity: float  # as a percentage

@app.post("/search", response_model=List[Club])
async def search_clubs(request: SearchRequest):
    query_text = request.query.strip()

    # Validate: must be a single word (no spaces), at least 3 characters,
    # and must be a valid English word according to pyenchant.
    if " " in query_text:
        raise HTTPException(status_code=400, detail="Query must be a single word.")
    if len(query_text) < 3:
        raise HTTPException(status_code=400, detail="Query is too short. Please use at least 3 characters.")
    if not english_dict.check(query_text):
        raise HTTPException(status_code=400, detail="Query is not a valid English word.")

    # Compute and normalize query embedding
    query_embedding_np = model.encode([query_text])
    query_embedding_np = query_embedding_np / np.linalg.norm(query_embedding_np, axis=1, keepdims=True)
    
    # Compute cosine similarity between the query and all club embeddings
    similarities = cosine_similarity(query_embedding_np, club_embeddings)[0]
    
    # Assign similarity scores to the DataFrame
    clubs_df["similarity"] = similarities
    
    # Filter out low-similarity results (threshold 0.1) and sort descending, then take top 10
    filtered_df = clubs_df[clubs_df["similarity"] > 0.1]
    top_clubs = filtered_df.sort_values(by="similarity", ascending=False).head(10)
    
    if top_clubs.empty:
        raise HTTPException(status_code=404, detail="No relevant clubs found. Try a more specific query.")
    
    results = [
        Club(
            id=str(row["id"]),
            name=row["name"],
            description=row["description"],
            link=row["link"],
            category=row.get("category", ""),
            similarity=float(row["similarity"]) * 100  # Convert to percentage
        )
        for _, row in top_clubs.iterrows()
    ]
    
    return results

# Run with:
# uvicorn main:app --reload --port 5002
