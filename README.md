# Tech FAQ Chatbot

A simple FAQ chatbot using NLP techniques (without machine learning) that combines:
- **Levenshtein Distance** for string similarity
- **TF-IDF (Term Frequency-Inverse Document Frequency)** for semantic matching
- **Cosine Similarity** for vector comparison

## Features

- Pure Python implementation using only standard library
- No machine learning dependencies required
- Combines multiple NLP techniques for better accuracy
- Interactive command-line interface
- Programmatic API for integration

## Installation

No external dependencies required! The chatbot uses only Python's standard library:
- `csv` - for reading CSV files
- `re` - for text preprocessing
- `math` - for mathematical operations
- `collections` - for Counter

## Usage

### Interactive Mode

Run the chatbot interactively:

```bash
cd server
python chatbot.py
```

Then type your questions. Type `quit` or `exit` to stop.

Example:
```
You: What is polymorphism?
Bot: Polymorphism allows objects of different classes to be treated as objects of a common superclass, enabling method overriding.
```

## How It Works

1. **Data Loading**: Loads questions and answers from CSV file
2. **Preprocessing**: Converts text to lowercase, removes special characters
3. **TF-IDF Vectorization**: Creates TF-IDF vectors for all questions
4. **Query Processing**: When a user asks a question:
   - Creates TF-IDF vector for the query
   - Calculates Cosine Similarity with all question vectors
   - Calculates Levenshtein Distance similarity
   - Combines scores to find the best match
5. **Response**: Returns the answer with the highest similarity score

## Data Format

The CSV file should have the following columns:
- `Question` - The FAQ question
- `Answer` - The corresponding answer
- `Category` - (Optional) Category of the question
- `Difficulty` - (Optional) Difficulty level
