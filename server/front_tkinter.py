import tkinter as tk
import os
from tkinter import scrolledtext
from datetime import datetime
from MiniLM import MiniLMChatbot

class ChatbotGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("showChat")
        self.root.geometry("500x600")
        self.root.configure(bg="#f0f0f0")

        title_label = tk.Label(
            root,
            text="Tech Chatbot",
            font=("Arial", 12, "bold"),
            bg="#4a90e2",
            fg="white",
            pady=10
        )
        title_label.pack(fill=tk.X)

        self.chat_area = scrolledtext.ScrolledText(
            root,
            wrap=tk.WORD,
            width=70,
            height=30,
            font=('Arial', 10),
            bg="white",
            state=tk.DISABLED
        )

        self.chat_area.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

        self.chat_area.tag_config("user", foreground="#2c3e50", font=("Arial", 10, "bold"))
        self.chat_area.tag_config("bot", foreground="#27ae60", font=("Arial", 10, "bold"))
        self.chat_area.tag_config("time", foreground="#95a5a6", font=("Arial", 10))

        input_frame = tk.Frame(root, bg="#f0f0f0")
        input_frame.pack(fill=tk.X, padx=10, pady=(0, 10))
        
        self.input_field = tk.Entry(
            input_frame,
            font=("Arial", 12),
            bg="white"
        )
        self.input_field.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))
        self.input_field.bind("<Return>", lambda e: self.send_msg())

        send_btn = tk.Button(
            input_frame,
            text="Envoyer",
            font=("Arial", 12, "bold"),
            bg="#4a90e2",
            fg="white",
            command=self.send_msg(),
            cursor="hand2",
            relief=tk.FLAT,
            padx=20
        )
        send_btn.pack(side=tk.RIGHT)

        self.display_msg("Bot", "Bonjour! je suis votre tech assistant. Comment puis-je vous aider?")

        self.input_field.focus()

    def get_chatbot_responce(self, user_input):
        csv_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        'data', 'raw', 'Software Questions.csv'
        )
        bot = MiniLMChatbot(csv_path)
        return bot.ask(user_input)
    
    def display_msg(self, sender, msg):
        self.chat_area.config(state=tk.NORMAL)
        timestamp = datetime.now().strftime("%H:%M")
        self.chat_area.insert(tk.END, f"[{timestamp}]", "time")
        if sender == "Vous":
            self.chat_area.insert(tk.END, f"{sender}: ", "user")
        else:
            self.chat_area.insert(tk.END, f"{sender}: ", "bot")
        self.chat_area.insert(tk.END, f"{msg}\n\n")

        self.chat_area.see(tk.END)
        self.chat_area.config(state=tk.DISABLED)
    
    def send_msg(self):
        user_msg = self.input_field.get().strip()
        if not user_msg:
            return
        self.display_msg("Vous", user_msg)
        self.input_field.delete(0, tk.END)
        bot_responce = self.get_chatbot_responce(user_msg)
        self.display_msg("Bot", bot_responce)

def main():
    root = tk.Tk()
    app = ChatbotGUI(root)
    root.mainloop()

if __name__ == "__main__":
    main()