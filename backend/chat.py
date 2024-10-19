import requests
import json

# Define the URL of the FastAPI endpoint
url = "http://127.0.0.1:8000/chat"

# Define the payload (data) for the request
payload = {
    "question": "What are some investment strategies?",
    "k": 5
}

# Send the POST request
response = requests.post(url, json=payload)

# Check the response status code
if response.status_code == 200:
    # Parse the JSON response
    answer = response.json()
    print("Question:", answer["question"])
    print("Answer:", answer["answer"])
else:
    print(f"Error {response.status_code}: {response.text}")
