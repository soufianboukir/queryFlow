'''
@Author: Mouad El Ouichouani
'''
import csv
import math 
import re 
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def processingText(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]"," ", text)
    return re.sub(r"\s+"," ", text).strip()

class TFIDFChatbot:
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
        
        # self.idf = self.compute_idf()
        self.vectorizer = TfidfVectorizer()

        # self.vectors = [self.compute_tfidf(q) for q in self.questions]
        self.faq_vectors = self.vectorizer.fit_transform(self.questions)

    # calcule manuel dual la rareté IDF hka katkhdem
    def compute_idf(self):
        N = len(self.questions)
        frequence = defaultdict(int)
        for q in self.questions:
            for w in set(q.split()):
                frequence[w] += 1
        return {w: math.log((1+N) / (1+f)) + 1 for w, f in frequence.items()}
    
    # calcule manuel dual TFIDF hka katkhdem
    def compute_tfidf(self, text):
        words = text.split()
        tf = Counter(words)
        total = len(words)
        return {w: (tf[w] / total) * self.idf.get(w, 0) for w in tf}
    
    # calcule manual dyal cosine similarité
    def cosine(self, v1, v2):
        common = set(v1) & set(v2)
        dot = sum(v1[w] * v2[w] for w in common)
        norm1 = math.sqrt(sum(v*v for v in v1.values()))
        norm2 = math.sqrt(sum(v*v for v in v2.values()))
        return dot / (norm1 * norm2) if norm1 and norm2 else 0.0

    # meilleure réponce selon mth manual
    def find_best_unswerV1(self, query):
        query = processingText(query)
        q_vec = self.compute_tfidf(query)
        best_score = -1
        best_idx = 0
        for i, v in enumerate(self.vectors):
            score = self.cosine(q_vec, v)
            if score > best_score:
                best_score, best_idx = score, i
        return self.answers[best_idx], best_score, best_idx
    
    def find_best_unswerV2(self, query, threshold=0.3):
        query = processingText(query)
        q_vec = self.vectorizer.transform([query])
        similarity = cosine_similarity(q_vec, self.faq_vectors)
        best_score = similarity.max()
        best_index = similarity.argmax()
        if best_score >= threshold:
            return self.answers[best_index], best_score, best_index
        else:
            return "Error"
