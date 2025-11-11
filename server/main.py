'''
@Author: Mouad El Ouichouani
'''
from tfidf_chatbot import TFIDFChatbot
from combined_chatbot import CombinedChatbot
import os

# TFIDF
# def main():
#     csv_path = os.path.join(
#         os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
#         'data', 'raw', 'Software Questions.csv'
#     )

#     print("="*60)
#     print("TF-IDF CHATBOT")
#     print("="*60)
#     print(f"Data Loaded From:{csv_path}")
#     try:
#         chatbot = TFIDFChatbot(csv_path)
#         print("="*60)
#         print("READY! Using TF-IDF + Cosine Similarity")
#         print("\nType 'quit' or 'exit' to stop.\n")
#         while True:
#             us_query = input("You: ").strip()
#             if us_query.lower() in ['quit', 'exit', 'q']:
#                 print("\n Goodbye!")
#                 break
#             if not us_query:
#                 continue
#             answer, score, index = chatbot.find_best_unswerV2(us_query)

#             print(f"\nBot: {answer}")
#             print(f"\nSimilarity score: {score:.5f}")
#             print(f"\nCategory: {chatbot.categories[index]}")
#             print(f"\nDifficulty: {chatbot.difficulties[index]}")
#             print(f"Matched Question: {chatbot.questions[index]}")
#     except FileNotFoundError:
#         print(f"Could not find csv file at {csv_path}")
#     except Exception as e:
#         print(f"Error: {e}")
#         import traceback
#         traceback.print_exc()

# if __name__ == "__main__":
#     main()


# Combined
def main():
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'data', 'raw', 'Software Questions.csv'
    )

    print("="*60)
    print("Combined CHATBOT")
    print("="*60)
    print(f"Data Loaded From:{csv_path}")
    try:
        chatbot = CombinedChatbot(csv_path)
        print("="*60)
        print("READY! Using TF-IDF + Cosine Similarity + Levenshtein")
        print("\nType 'quit' or 'exit' to stop.\n")
        while True:
            us_query = input("You: ").strip()
            if us_query.lower() in ['quit', 'exit', 'q']:
                print("\n Goodbye!")
                break
            if not us_query:
                continue
            answer, score, index = chatbot.find_best_answer(us_query)

            print(f"\nBot: {answer}")
            print(f"\nSimilarity score: {score:.5f}")
            print(f"\nCategory: {chatbot.categories[index]}")
            print(f"\nDifficulty: {chatbot.difficulties[index]}")
            print(f"Matched Question: {chatbot.questions[index]}")
    except FileNotFoundError:
        print(f"Could not find csv file at {csv_path}")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()