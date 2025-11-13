import pandas as pd
from sentence_transformers import SentenceTransformer, util
import os

def MiniLM(question):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    data_path = os.path.join(BASE_DIR, "..", "data", "raw", "software_questions.csv")
    data_path = os.path.normpath(data_path)

    dframe = pd.read_csv(data_path, encoding="latin-1")

    model = SentenceTransformer('all-MiniLM-L6-v2')
    question_embeddings = model.encode(dframe["Question"].tolist(), convert_to_tensor=True)

    user_embedding = model.encode([question], convert_to_tensor=True)

    cos_scores = util.cos_sim(user_embedding, question_embeddings)
    best_index = int(cos_scores.argmax())
    best_similarity = cos_scores[0][best_index].item()
    best_answer = dframe.iloc[best_index]["Answer"]

    if(best_similarity < 0.5):
        return {
            "question": question,
            "response": "Sorry, I don't have informations about that",
            "similarity": best_similarity,
        }
    return {
        "question": question,
        "response": best_answer,
        "similarity": best_similarity,
    }

