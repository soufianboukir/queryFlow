from server.config.db import get_db

db = get_db()

def add_history(user_id , question , answer):
    if not all([user_id, question, answer]):
        raise ValueError("Missing fields")

    db.history.insert_one({
        "userId": user_id,
        "question": question,
        "answer": answer
    })
