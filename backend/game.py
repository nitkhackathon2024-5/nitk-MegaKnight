import requests

BASE_URL = "http://localhost:8000"

endpoint = f"{BASE_URL}/generate_game"
payload = {
    "level": 5,
    "num_questions": 5
}
response = requests.post(endpoint, json=payload)
print("Game Generation Response:")
print(response.json())
print("\n")
