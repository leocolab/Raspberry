import os
from dotenv import load_dotenv
load_dotenv()

import openai, anthropic, google.generativeai as genai

client = openai.OpenAI()       # pulls OPENAI_API_KEY from env

def chat_openai(prompt: str) -> str:
    rsp = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
    )
    return rsp.choices[0].message.content.strip()

def chat_gemini(prompt: str) -> str:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    chat = model.start_chat()
    return chat.send_message(prompt).text.strip()

def chat_claude(prompt: str) -> str:
    claude = anthropic.Anthropic()  # pulls key from env
    rsp = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return rsp.content[0].text.strip()






