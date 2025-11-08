import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import os


class FaqAI:
    def __init__(self, faq_path):
        self.faq = pd.read_csv(faq_path, encoding="latin1", on_bad_lines="skip")
        self.faq.columns = [c.strip().lower().replace(" ", "_") for c in self.faq.columns]

        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.X = self.vectorizer.fit_transform(self.faq['question'])

        self.fallbacks = [
            "I'm not sure about that. Try asking something related to software engineering.",
            "I can only help with tech interview questions for now.",
            "Hmm... I don’t have that answer yet."
        ]

    def get_answer(self, user_query, threshold=0.5):
        query_vec = self.vectorizer.transform([user_query])
        similarities = cosine_similarity(query_vec, self.X)
        best_idx = similarities.argmax()
        best_score = similarities[0, best_idx]

        if best_score < threshold:
            os.makedirs("app/data", exist_ok=True)
            with open("app/data/unanswered.txt", "a", encoding="utf-8") as f:
                f.write(f"{user_query}\t{best_score:.4f}\n")
            return {"answer": random.choice(self.fallbacks), "confidence": float(best_score)}

        match = self.faq.iloc[best_idx]
        return {
            "answer": match['answer'],
            "category": match.get('category', 'N/A'),
            "difficulty": match.get('difficulty', 'N/A'),
            "confidence": float(best_score)
        }
