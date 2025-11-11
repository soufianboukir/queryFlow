import csv
import os
import re
from typing import List, Tuple, Dict

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import difflib


def processingText(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]"," ", text)
    return re.sub(r"\s+"," ", text).strip()

class CombinedChatbot:
    def __init__(self, csv_path):
        self.questions = []
        self.answers = []
        self.categories = []
        self.difficulties = []
        
        with open(csv_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                q = row.get("Question","").strip()
                a = row.get("Answer","").strip()
                self.categories.append(row.get('Category', '').strip())
                self.difficulties.append(row.get('Difficulty', '').strip())
                if q and a:
                    self.questions.append(processingText(q))
                    self.answers.append(a)
        
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = self.vectorizer.fit_transform(self.questions)

    def tfidf_similarity(self, query):
        query_vec = self.vectorizer.transform([processingText(query)])
        sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        return sims
    
    def levenshtein_similarity(self, s1, s2):
        return difflib.SequenceMatcher(None, s1, s2).ratio()
    
    def find_best_answer(self, query) -> Tuple[str, float, Dict[str, str]]:
        query_clean = processingText(query)

        tfidf_scores = self.tfidf_similarity(query)
        best_idx = int(tfidf_scores.argmax())
        best_tfidf = tfidf_scores[best_idx]

        # Calculate Levenshtein similarity for refinement
        lev_scores = [self.levenshtein_similarity(query_clean, q) for q in self.questions]
        best_lev = lev_scores[best_idx]

        # Combined score (weighted)
        combined_score = 0.7 * best_tfidf + 0.3 * best_lev

        info = {
            'question': self.questions[best_idx],
            'category': self.categories[best_idx],
            'difficulty': self.difficulties[best_idx]
        }

        return self.answers[best_idx], combined_score, best_idx