# Tech FAQ Chatbot API

This is a simple REST API for a Tech FAQ Chatbot powered by a pre-trained sentence-transformer model.  
It accepts a question as input and returns the most similar answer from the dataset.

---

## Base URL

```URL
127.0.0.1:5000
```

---

## Endpoints

### 1. Ask a Question

Retrieve an answer for a given tech-related question.

- **URL**: `/ask`
- **Method**: `GET`
- **Query Parameters**:
  - `question` (string, required, less than 100) – The question you want to ask the chatbot.

- **Response**: JSON object

**Example Request**

```
GET /ask?question=polymorphism
```


**Example Response**

```json
{
  "question": "polymorphism",
  "response": "Polymorphism allows objects of different classes to be treated as objects of a common superclass, enabling method overriding.",
  "similarity": 0.87
}
```

**Response When No Match Found**
- If the model's similarity score is too low (<0.5), the API responds with:

```json
{
  "question": "some unknown question",
  "response": "Sorry, I don't have information about that.",
  "similarity": 0.32
}
```

### 2.Usage

**Start the flask server**
```bash
cd server
python start.py
```

**Open your browser or use a tool like curl or Postman:
```bash
http://127.0.0.1:5000/ask?question=polymorphism
```


*by -soufian*