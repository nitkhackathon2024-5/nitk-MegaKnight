import requests

BASE_URL = "http://localhost:8000"

def test_generate_subtopics():
    endpoint = f"{BASE_URL}/generate_subtopics"
    payload = {
        "topic": "how to make money",
        "age": 16
    }
    response = requests.post(endpoint, json=payload)
    print("Generated Subtopics:")
    print(response.json())
    print("\n")
    return response.json()['subtopics']

def test_generate_comprehensive_lesson():
    endpoint = f"{BASE_URL}/generate_lesson"
    payload = {
        "topic": "how to make money",
        "age": 16
    }
    response = requests.post(endpoint, json=payload)
    print("Comprehensive Lesson Generation Response:")
    print("Subtopics:", response.json()['subtopics'])
    print("\nLesson Preview (first 500 characters):")
    print(response.json()['complete_lesson'])
    print("\n")

if __name__ == "__main__":
    test_generate_subtopics()
    test_generate_comprehensive_lesson()
