
import pandas as pd
from sentence_transformers import SentenceTransformer, util

dframe = pd.read_csv("/home/sofyan/Documents/tech-faq-chatbot/data/raw/software_questions.csv")


model = SentenceTransformer('all-MiniLM-L6-v2')

question_embeddings = model.encode(dframe["Question"].tolist(), convert_to_tensor=True)

user_embedding = model.encode([user_question], convert_to_tensor=True)

cos_scores = util.cos_sim(user_embedding, question_embeddings)

best_index = cos_scores.argmax()
best_question = dframe.iloc[best_index]["Question"]
best_answer = dframe.iloc[best_index]["Answer"]
best_similarity = cos_scores[0][best_index].item()

print("Most similar question:", best_question)
print("Best answer:", best_answer)
print("Similarity score:", best_similarity)
