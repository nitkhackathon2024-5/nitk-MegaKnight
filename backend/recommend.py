import requests

BASE_URL = "http://localhost:8000"

endpoint = f"{BASE_URL}/recommend"
payload = {
    "age": 30,
    "income": 75000,
    "savings_goal": "Buy a house",
    "credit_score": 720,
    "looking_for_credit_card": True
}
response = requests.post(endpoint, json=payload)
print("Financial Recommendation Response:")
print(response.json())
print("\n")