from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import google.generativeai as genai
import PyPDF2
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import json

# Load environment variables
load_dotenv()

# Firebase setup
relative_json_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
current_directory = os.path.dirname(os.path.abspath(__file__))
json_path = os.path.join(current_directory, relative_json_path)
cred = credentials.Certificate(json_path)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Gemini AI setup
genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

# FastAPI app setup
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Sentence Transformer and FAISS setup
sentence_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
embedding_size = sentence_model.get_sentence_embedding_dimension()
index = faiss.IndexFlatL2(embedding_size)
documents = []

# Model classes
class LoginInfo(BaseModel):
    username: str
    password: str

class PersonInfo(BaseModel):
    fullName: str
    age: int
    dateOfBirth: str
    occupation: str
    country: str
    sourceOfIncome: str
    isCreditCardHolder: bool
    creditScore: int
    monthlyIncome: float
    monthlyExpenses: float
    financialGoals: str

class TopicRequest(BaseModel):
    userId: str
    topic: str

class RecommendationRequest(BaseModel):
    age: int
    credit_score: int
    country: str
    occupation: str
    monthly_income: float
    monthly_expenses: float

class LessonRequest(BaseModel):
    topic: str
    age: int

class SubtopicsRequest(BaseModel):
    topic: str
    age: int

class QuizRequest(BaseModel):
    topic: str
    difficulty: int
    num_questions: int

class GameRequest(BaseModel):
    level: int
    num_questions: int

class ChatRequest(BaseModel):
    question: str
    k: int = 5

# Wells Fargo services data
wells_fargo_services = [
    {
        "name": "Wells Fargo Way2Save Savings Account",
        "description": (
            "The Wells Fargo Way2Save Savings Account is designed to help individuals save "
            "automatically through features like the Save As You Go program, which transfers $1 "
            "from a linked checking account with each debit card use. It offers several fee waiver "
            "options, such as maintaining a minimum daily balance of $300 or automatic transfers. "
            "However, the account has a very low interest rate (0.01% APY), and monthly fees may apply "
            "if waiver conditions are not met. This account is suitable for younger individuals, as "
            "those under 24 can benefit from a fee waiver. Despite its low returns compared to other "
            "savings options, it provides a convenient way to build savings through automation."
        )
    },
    {
        "name": "Wells Fargo Platinum Savings Account",
        "description": (
            "The Wells Fargo Platinum Savings Account offers higher interest rates for larger balances, "
            "making it an attractive option for individuals looking to earn more on substantial savings. "
            "The account has tiered interest rates, ranging from 0.05% APY for balances under $100,000 to "
            "2.51% APY for balances over $1,000,000. It features unlimited withdrawals and check-writing "
            "capabilities, with FDIC insurance and automatic savings tools such as My Savings Plan®. "
            "While the account offers higher returns for large balances, it also comes with a $12 monthly "
            "service fee unless a minimum daily balance of $3,500 is maintained. It's ideal for those with "
            "significant savings who want flexible access and higher APY rates."
        )
    },
    {
        "name": "Wells Fargo Certificates of Deposit (CDs)",
        "description": (
            "Wells Fargo Certificates of Deposit (CDs) offer a range of term options, including both "
            "standard and special fixed-rate CDs, with interest rates as high as 4.25% for special terms. "
            "These CDs require a minimum deposit of $2,500 for standard terms and $5,000 for special terms. "
            "They compound interest daily and allow flexible interest payment options, such as monthly or "
            "at maturity. There are penalties for early withdrawal, which vary depending on the length of "
            "the term. While CDs offer a safe way to earn interest, they require higher minimum deposits "
            "compared to online banks. This product is ideal for individuals seeking secure, fixed-rate returns "
            "with a range of short-term options, but the rates may be lower than those offered by competitors."
        )
    },
    {
        "name": "Wells Fargo Kids Savings Account",
        "description": (
            "The Wells Fargo Kids Savings Account is designed to help children under the age of 18 start saving "
            "with the guidance of a parent or guardian. The account can be opened jointly, and minors aged 13 to 17 "
            "can open the account individually. The account offers educational resources to help kids learn about "
            "financial skills and allows parents to set savings goals with their children. While there is a low opening "
            "deposit of $25 and no monthly fees for account holders under the age of 24, the account has a very low "
            "interest rate of 0.01% APY. This account is best suited for families who want to involve children in the "
            "savings process and focus on financial education, though it offers lower returns than competing savings products."
        )
    },
    {
        "name": "Wells Fargo Cashback Credit Cards",
        "description": (
            "Wells Fargo offers a variety of cashback credit cards with competitive features. The Wells Fargo Active Cash® Card "
            "provides an unlimited 2% cashback on purchases, a $200 sign-up bonus after spending $500, and 15 months of 0% APR, "
            "with no annual fee. Other cards, like the Wells Fargo Cash Wise Visa® Card, offer 1.5% cashback and a bonus 1% on digital wallet purchases. "
            "Cards in this range provide flexible redemption options, including statement credits and direct deposits, while additional benefits like cell phone protection and Visa Signature perks add value. "
            "Despite these advantages, cashback rates may be lower than some competitors, and post-introductory APRs can be high."
        )
    },
    {
        "name": "Wells Fargo Rewards Credit Cards",
        "description": (
            "Wells Fargo Rewards Credit Cards offer rewards on a variety of spending categories. The Wells Fargo Active Cash® Card provides 2% cashback, "
            "while the Wells Fargo Autograph℠ Card gives 3x points on categories such as dining, travel, and gas. The Autograph Journey℠ Card focuses on travel, offering up to 5x points on hotel stays and 4x on airfare. "
            "Rewards can be redeemed for statement credits, gift cards, or travel. Some cards offer unique features like travel protections and concierge services. "
            "While there is no annual fee for many of these cards, some may have lower rewards rates in specific categories compared to competitors."
        )
    },
    {
        "name": "Wells Fargo 0% Intro APR Credit Cards",
        "description": (
            "This category includes credit cards that feature long introductory 0% APR periods, ideal for individuals looking to make large purchases or consolidate debt without incurring interest. The Wells Fargo Reflect® Card offers an impressive 21-month intro APR period, allowing users to manage their finances effectively during this timeframe. Additional benefits include no annual fee, cell phone protection, roadside assistance, and personalized deals through My Wells Fargo Deals. The Wells Fargo Active Cash® Card and Cash Wise Visa® Card also provide attractive cash back rewards, including a 2% cash back rate on eligible purchases and sign-up bonuses, all while maintaining a zero annual fee. These cards come with various redemption options such as statement credits, direct deposits, and gift cards, providing flexibility in how rewards can be utilized."
        )
    },
    {
        "name": "Wells Fargo Travel Credit Cards",
        "description": (
            "Targeted at frequent travelers, this category features credit cards that offer substantial rewards on travel-related expenses. The Wells Fargo Autograph Journey℠ Visa® Card stands out with a sign-up bonus of 60,000 points and a rewarding structure that earns 5 points on hotel stays, 4 points on airlines, and 3 points on other travel and dining purchases. It also provides essential travel benefits, including trip cancellation and interruption insurance, lost baggage reimbursement, and no foreign transaction fees, making it an excellent choice for international travel. The Wells Fargo Autograph℠ Card also offers competitive rewards rates on dining, travel, and gas, along with additional perks like cell phone protection and travel accident insurance. These cards have flexible redemption options, allowing users to convert points into travel rewards, gift cards, statement credits, or transfer points to select partners, ensuring that users get the most value from their spending."
        )
    },
    {
        "name": "Wells Fargo Balance Transfer Credit Cards",
        "description": (
            "This category focuses on credit cards designed to help individuals manage and consolidate debt through balance transfers. The Wells Fargo Reflect® Card offers a compelling introductory offer of 0% APR for 21 months, allowing users to transfer existing balances without accruing interest during this period. After the introductory phase, the variable APR ranges from 17.74% to 29.49%, and a balance transfer fee of 3% applies. Additional benefits include cell phone protection against theft or damage (up to $600), roadside dispatch services, and access to various online account management tools, making it a comprehensive choice for those needing financial flexibility.\n\n"
            "The Wells Fargo Active Cash® Card also features an introductory offer of 0% APR for 15 months on balance transfers, making it suitable for users looking to pay down debt. In addition to its balance transfer capabilities, it provides a sign-up bonus of $200 after meeting spending requirements, along with a rewarding structure that offers 2% cash back on eligible purchases. The annual fee is waived, and the card includes various security features and cell phone protection.\n\n"
            "Both cards come with flexible redemption options, allowing users to convert rewards into statement credits, direct deposits, or gift cards. It's important to note that balance transfers may take up to 14 days to process, and payments on the original card should continue until the transfer is confirmed to avoid late fees. Overall, these cards offer valuable features for those looking to manage their finances more effectively."
        )
    },
    {
        "name": "Wells Fargo Business Credit Cards",
        "description": (
            "Wells Fargo offers a range of business credit cards designed to meet the diverse needs of small and medium-sized enterprises. The Wells Fargo Signify Business Cash Card allows businesses to earn 2% cash back on eligible purchases, with a 0% introductory APR for the first 12 months and no annual fee. New cardholders can earn a bonus by meeting specific spending requirements, and rewards can be redeemed through statement credits, gift cards, or travel through Wells Fargo’s travel partners. Additionally, cardholders can combine cash rewards with an eligible Wells Fargo consumer card for enhanced redemption options and enjoy airport lounge access through Priority Pass membership (per-visit fees may apply).\n\n"
            "The Wells Fargo Business Elite Signature Card features a customizable rewards program, enabling businesses to select categories that best fit their spending habits. While it has no annual fee for the first year, a fee applies thereafter. The card typically includes a substantial welcome bonus contingent upon meeting spending requirements. Additional benefits include comprehensive expense tracking tools via Wells Fargo Business Online, customizable spending limits for employee cards, and premium travel benefits, including travel accident insurance and auto rental collision damage waiver.\n\n"
            "For businesses looking for a straightforward option, the Wells Fargo Business Platinum Credit Card offers 1.5% cash back, a 0% introductory APR for the first 9 months, and no annual fee. Post-introductory, the variable APR ranges from 16.74% to 25.74%. Rewards can be redeemed as statement credits or direct deposits into a Wells Fargo account.\n\n"
            "These cards provide flexible rewards structures, online expense management tools, and various redemption options, making them valuable for businesses seeking to optimize their finances. However, some may find limited high rewards categories compared to competitors, and variable APR after introductory periods could be high if balances are not paid in full."
        )
    },
    {
        "name": "Wells Fargo Home Loan Products",
        "description": (
            "Wells Fargo provides a diverse range of home loan products tailored to meet various borrower needs. Their Conventional Loans feature options like fixed-rate mortgages with terms of 15, 20, or 30 years, as well as adjustable-rate mortgages (ARMs) with initial fixed periods of 5, 7, or 10 years. With a minimum down payment of just 3%, these loans also offer refinancing options such as rate-and-term refinances and cash-out refinances.\n\n"
            "The FHA Loans, requiring a down payment of 3.5%, are designed for low-to-moderate-income borrowers and come with streamline refinancing options that simplify the process with minimal paperwork. For veterans and qualifying family members, VA Loans offer a no down payment option, do not require private mortgage insurance (PMI), and provide Interest Rate Reduction Refinance Loans (IRRRLs) for existing VA loan holders.\n\n"
            "Wells Fargo also offers USDA Loans for buyers in eligible rural areas, requiring no down payment and targeting low-to-moderate-income earners. Jumbo Loans are available for higher amounts that exceed conforming loan limits, and these can be structured as either fixed-rate or adjustable-rate mortgages.\n\n"
            "Special programs include down payment assistance through the NeighborhoodLIFT Program, which provides forgivable, zero-interest loans, and closing cost assistance up to $5,000 in certain areas. First-time homebuyers can access resources such as prequalification services and educational materials to navigate the homebuying process more effectively.\n\n"
            "The application process involves getting prequalified online, completing an application, and submitting essential documents such as proof of income and credit history. Overall, Wells Fargo’s home loan products offer a variety of options to accommodate different financial situations, though potential borrowers should be aware of credit score requirements that are not publicly disclosed and the limited availability of some services in certain states."
        )
    },
    {
        "name": "Wells Fargo Personal Loans",
        "description": (
            "Wells Fargo offers personal loans designed to provide borrowers with financial flexibility and quick access to funds. These loans range from $3,000 to $100,000, with repayment terms varying from 12 to 84 months. The interest rates range from an APR of 7.49% to 24.99%, with potential discounts for existing customers who have a qualifying checking account and set up automatic payments.\n\n"
            "One of the key features of Wells Fargo personal loans is that there are no origination fees and no prepayment penalties, making them an affordable option for many borrowers. The application process begins with a prequalification step that allows prospective borrowers to check their eligibility without impacting their credit score. Following this, applicants can complete the application online or in person, with most receiving a credit decision on the same day. Approved loans can be funded as quickly as the same day or within one to three business days.\n\n"
            "However, eligibility requirements state that applicants must be existing Wells Fargo customers with an open account for at least 12 months. Good credit is generally necessary, but specific credit score requirements are not publicly disclosed. While the flexible loan amounts and terms cater to a variety of financial needs, the limitation to current customers may restrict access for new borrowers. Overall, Wells Fargo personal loans provide a straightforward and efficient borrowing option for existing customers."
        )
    }
]

# Helper functions
def load_documents():
    global documents
    for file in os.listdir("Data"):
        if file.lower().endswith('.pdf'):
            with open(os.path.join("Data", file), "rb") as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                for page in pdf_reader.pages:
                    documents.append(page.extract_text())

def initialize_index():
    load_documents()
    document_embeddings = sentence_model.encode(documents)
    index.add(document_embeddings)

def retrieve_relevant_content(query: str, k: int = 10) -> List[str]:
    query_embedding = sentence_model.encode([query])
    _, indices = index.search(query_embedding, k)
    return [documents[i] for i in indices[0]]

def call_gemini_api(prompt: str) -> str:
    response = model.generate_content(prompt)
    return response.text

# Initialize index on startup
initialize_index()

# API routes
@app.get("/")
async def get_home():
    return {"message": "Welcome to the Educational and Financial Advice Service!"}

@app.post("/api/login")
async def login(login_info: LoginInfo):
    try:
        new_doc_ref = db.collection('users').document()
        new_doc_ref.set({
            "username": login_info.username,
            "password": login_info.password,  # Note: Storing passwords in plaintext is not secure. Use hashing in production.
            "additional_info": False
        })
        return {
            "message": f"User {login_info.username} logged in successfully.",
            "documentId": new_doc_ref.id,
            "url": f"http://localhost:3000/complete-profile-info/{new_doc_ref.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/complete-profile-info/{user_id}")
async def complete_profile_info(user_id: str, person_info: PersonInfo):
    try:
        doc_ref = db.collection('users').document(user_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
        update_data = person_info.model_dump()
        update_data['additional_info'] = True
        doc_ref.update(update_data)
        return {
            "message": f"Profile for user {user_id} updated successfully.",
            "documentId": user_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/store-topic")
async def store_topic(request: TopicRequest):
    try:
        doc_ref = db.collection('users').document(request.userId)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        doc_ref.update({"topic": request.topic})
        return {"message": "Topic stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-age/{user_id}")
async def get_age(user_id: str):
    try:
        doc_ref = db.collection('users').document(user_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        age = doc.to_dict().get("age")
        return {"age": age}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_subtopics")
async def generate_subtopics(request: SubtopicsRequest):
    query = f"Information about {request.topic} suitable for {request.age} year olds"
    relevant_contents = retrieve_relevant_content(query)
    relevant_content = "\n\n".join(relevant_contents)
    prompt = f"""
    You are an expert educator. Generate a list of 10 subtopics for a comprehensive lesson on '{request.topic}' for a person who is {request.age} years old.
    Use the following relevant information to inform your subtopic selection:

    {relevant_content}

    Provide the subtopics as a numbered list, ensuring they cover the topic thoroughly and are age-appropriate.
    """
    subtopics_response = call_gemini_api(prompt)
    subtopics = [line.strip() for line in subtopics_response.split('\n') if line.strip() and not line.strip().startswith('Topic:')]
    return {"subtopics": subtopics}

@app.post("/generate_lesson")
async def generate_lesson(request: LessonRequest):
    subtopics_request = SubtopicsRequest(topic=request.topic, age=request.age)
    subtopics_response = await generate_subtopics(subtopics_request)
    subtopics = subtopics_response["subtopics"]

    full_lesson = []
    for subtopic in subtopics:
        query = f"Information about {subtopic} related to {request.topic} suitable for {request.age} year olds"
        relevant_contents = retrieve_relevant_content(query)
        relevant_content = "\n\n".join(relevant_contents)
        prompt = f"""
        You are an expert educator. Create a detailed lesson on the subtopic '{subtopic}' as part of the main topic '{request.topic}' for a person who is {request.age} years old.
        Use the following relevant information to enhance your lesson:

        {relevant_content}

        Make the lesson age-appropriate, engaging, and easy to understand. Include explanations of any specific terms used.
        Structure this part of the lesson with an introduction, main content, and a brief conclusion.
        """
        subtopic_content = call_gemini_api(prompt)
        full_lesson.append(f"## {subtopic}\n\n{subtopic_content}")
    
    complete_lesson = "\n\n".join(full_lesson)
    return {"subtopics": subtopics, "complete_lesson": complete_lesson}

@app.post("/recommend")
async def recommend_service(request: RecommendationRequest):
    service_details = "\n".join([f"- **{service['name']}**: {service['description']}" for service in wells_fargo_services])
    prompt = (
        f"You are an expert financial advisor. Given the following information, "
        f"provide a personalized recommendation based on available services:\n\n"
        f"Age: {request.age}\n"
        f"Credit Score: {request.credit_score}\n"
        f"Country: {request.country}\n"
        f"Occupation: {request.occupation}\n"
        f"Monthly Income: {request.monthly_income}\n"
        f"Monthly Expenses: {request.monthly_expenses}\n\n"
        f"Here are the available services:\n"
        f"{service_details}\n\n"
        f"Provide a personalized recommendation on the most suitable service(s) from the above list."
    )
    response = call_gemini_api(prompt)
    return {"recommendation": response}

@app.post("/generate_quiz")
async def generate_quiz_route(request: QuizRequest):
    query = f"Information about {request.topic} for creating a quiz"
    relevant_contents = retrieve_relevant_content(query)
    relevant_content = "\n\n".join(relevant_contents)
    prompt = f"""
    You are an expert educator. Create a quiz on the topic of '{request.topic}' with the following specifications:
    - Difficulty level: {request.difficulty}/9
    - Number of questions: {request.num_questions}

    Use the following relevant information to create accurate and engaging questions:

    {relevant_content}

    Each question should have 4 answer options and indicate the correct answer.
    Make sure the questions are appropriate for the specified difficulty level.
    """
    quiz = call_gemini_api(prompt)
    return {"quiz": quiz}

@app.post("/generate_game")
async def generate_game(request: GameRequest):
    prompt = f"""
    You are an expert educator in finance. Create a quiz with the following specifications:
    - Number of questions: {request.num_questions}
    - Difficulty level: {request.level}
    Total no of levels is from 0 to 9
    
    The questions should cover various finance concepts randomly, such as:
    - Financial markets
    - Investment strategies
    - Risk management
    - Corporate finance
    - Personal finance

    Each question should have 4 answer options and indicate the correct answer.
    Ensure that the questions are different for each generation.
    """
    quiz = call_gemini_api(prompt)
    return {"quiz": quiz}

@app.post("/chat")
async def chat(request: ChatRequest):
    relevant_contents = retrieve_relevant_content(request.question, k=request.k)
    prompt = f"""
    You are a knowledgeable assistant. Based on the following information, answer the question:

    Question: {request.question}

    Relevant content:
    {'\n\n'.join(relevant_contents)}

    Provide a clear and concise answer, referencing the relevant content where applicable.
    """
    answer = call_gemini_api(prompt)
    return {"question": request.question, "answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)