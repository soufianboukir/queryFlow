import Levenshtein

def levenshtein_similarity(s1, s2):
    return Levenshtein.ratio(s1, s2)

class LevenshteinChatbot:
    def __init__(self, questions):
        self.questions = questions

    def ask(self, query_clean):
        lev_scores = [levenshtein_similarity(query_clean, q) for q in self.questions]
        best_idx = lev_scores.index(max(lev_scores))
        return self.questions[best_idx], lev_scores[best_idx]
