# Financial Literacy App for Young People
# Team : MegaKnight

DEMO VIDEO : [Demo Video](https://drive.google.com/file/d/1ms_DgtB2zRfUJwlAGVe_6TolVQfjJEp5/view?usp=sharing)

## Team Members
- Member 1: Vatsal
- Member 2: Vishruth
- Member 3: Suyash

## Project Overview
This app empowers young people  with engaging lessons on personal finance. Following Wells Fargo's approach to banking, the app offers bite-sized lessons, quizzes, and personalized financial advice using AI-generated content. It gamifies learning with leaderboards and daily challenges, making financial literacy both fun and educational.

## Key Features
- **Sign-in/Sign-up System**: User-friendly authentication, including Google/Facebook login.
- **Home Dashboard**: Displays lessons, quizzes, financial tips, and leaderboard standings.
- **Theme Toggle**: Light and dark mode for a personalized experience.
- **Personalized Profile**: Shows lessons, progress, financial tips, and includes family planning and dynamic market condition analysis.
- **Dynamic Lessons & Quizzes**:
  - Uses a Retrieval-Augmented Generation (RAG) system to tailor lessons based on user inputs.
  - Quizzes follow lessons with a minimum passing score to progress.
- **Game Mechanics**:
  - Daily financial decision-making games with increasing difficulty.
  - Leaderboards track daily, weekly, and all-time scores.
- **Bonus Features**:
  - Dynamic Market Conditions: Fluctuations in interest rates and market downturns add real-world complexities to planning.
  - Family & Career Planning: Simulates life events and their financial impacts.
  - Real-Time Financial Advice: AI-generated advice based on user behavior and habits.

## Tech Stack
### Frontend
- React (Hosted on http://localhost:3000)
- TailwindCSS for responsive styling

### Backend
- FastAPI (Hosted on http://localhost:8000)
- Firestore for data storage
- Gemini-1.5-Flash API for quiz generation
- Huggingface all-MiniLM-L6-v2 for embedding and similarity search

## Project Architecture
### Frontend:
- Handles user interface (sign-in, profile, quizzes, etc.) using React.
- Tailored styling via TailwindCSS for responsive design.

### Backend:
- Uses FastAPI for API routing and backend services.
- Firestore stores user data, scores, lessons, and leaderboard info.
- Gemini-1.5-Flash API for generating personalized quizzes.
- RAG System to generate lessons by querying an embedded set of financial books.

### AI Integration:
- RAG System: Queries embeddings from Huggingface all-MiniLM-L6-v2 for generating personalized content.
- Gemini-1.5-Flash API: Generates quizzes and lesson content dynamically.
- Leaderboard Updates: Real-time tracking using Firestore.

## Getting Started

### Prerequisites
- Node.js (14.x or higher)
- Python 3.x
- Git
- Firestore Emulator (Optional, for local testing)

### Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/financial-literacy-app.git
   cd financial-literacy-app
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   python -m venv venv
   venv\Scripts\activate #for windows
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**
   Create .env files in both the frontend and backend directories:

   Frontend .env file:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   GEMINI_API_KEY = your_api_key_gemini
   ```

   Backend .env file:
   ```
   DATABASE_URL=your_firestore_database_url
   ```

5. **Run Firestore Emulator (Optional):**
   ```bash
   firebase emulators:start
   ```

6. **Run Backend Locally**
   ```bash
   uvicorn main:app --reload
   ```
   This will start the backend at http://localhost:8000.

7. **Run Frontend Locally**
   ```bash
   npm start
   ```
   The frontend will run at http://localhost:3000.


## Deployment

### Frontend Deployment
1. Build the React app:
   ```bash
   npm run build
   ```
2. Deploy to platforms like Vercel, Netlify, or GitHub Pages.

### Backend Deployment
1. Host the backend using Heroku, Google Cloud, or AWS.
2. Ensure Firestore is properly connected in production.


