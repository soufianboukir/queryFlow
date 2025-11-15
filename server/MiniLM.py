from sentence_transformers import SentenceTransformer, util
import csv
import os

from tokenizers import Encoding

class MiniLMChatbot:
    def __init__(self, csv_path):
        self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        self.questions = []
        self.answers = []
        with open(csv_path, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                q = row.get('Question', '').strip()
                a = row.get('Answer', '').strip()
                if q and a:
                    self.questions.append(q)
                    self.answers.append(a)
        self.embeddings = self.model.encode(self.questions, convert_to_tensor=True)

    def ask(self, query):
        query_emb = self.model.encode(query, convert_to_tensor=True)
        cosine_scores = util.cos_sim(query_emb, self.embeddings)

        best_idx = cosine_scores.argmax()
        best_score = cosine_scores[0][best_idx].item()

        return self.answers[best_idx]
    
if __name__ == "__main__":
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'data', 'raw', 'Software Questions.csv'
    )
    bot = MiniLMChatbot(csv_path)
    print("Chatbot MiniLM ready! Type 'quit' to exit.\n")

    while True:
        user = input("You: ").strip()
        if user.lower() in {"quit", "exit"}:
            break
        answer = bot.ask(user)
        print(f"\nAnswer: {answer}")
        # print(f"Similarity: {score:.3f}\n")