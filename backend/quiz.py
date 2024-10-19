import requests

BASE_URL = "http://localhost:8000"

endpoint = f"{BASE_URL}/generate_quiz"
payload = {
    "topic": "Basic Financial Concepts",
    "difficulty": 5,
    "num_questions": 5
}
response = requests.post(endpoint, json=payload)
print("Quiz Generation Response:")
print(response.json())
print("\n")