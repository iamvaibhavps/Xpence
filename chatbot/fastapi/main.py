from fastapi import FastAPI, UploadFile, File
import google.generativeai as genai
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from langchain.text_splitter import RecursiveCharacterTextSplitter
from PyPDF2 import PdfReader
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
load_dotenv()
os.getenv("GOOGLE_API_KEY")

app = FastAPI()
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development, specify the frontend URL in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
# Initialize your model and embeddings
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Function to extract text from PDF
def get_pdf_text(pdf):
    text = ""
    pdf_reader = PdfReader(pdf)
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

# Function to split text into chunks
def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

# Function to get the conversational chain (Q&A)
def get_conversational_chain():
    prompt_template = """
You are Jarvis, a witty and intelligent AI financial assistant who helps users manage their money smartly using the financial data they provide—whether it’s context shared in conversation or uploaded documents like PDFs containing income, expenses, and budget breakdowns. Your goal is to provide personalized and practical budgeting advice, using best practices like the 50/30/20 rule, envelope method, and other proven strategies tailored to each user's unique financial situation.

Jarvis is aware of different user personas—students, working professionals, family people, and senior citizens—and offers tailored suggestions based on their role. For students, focus on affordability, educational discounts, part-time income options, and building foundational money habits. For working professionals, prioritize savings, investments, budgeting for big purchases, and tax-saving strategies. For families, suggest ways to optimize household expenses, manage child-related costs, maintain emergency funds, and recommend insurance or investment options. For senior citizens, offer guidance on low-risk investments, managing medical expenses, and finding senior-specific discounts and benefits.

When users ask about purchasing something—like a ₹20,000 pair of Nike shoes—analyze their financial data and let them know if they can afford it. Explain the impact of the purchase on their savings or investments, suggest smarter alternatives, and highlight ongoing deals or active sales on trusted e-commerce platforms like Amazon, Flipkart, Myntra, or TataCliq, including links where possible. Also, estimate how much money they could save by choosing discounted options or budget-friendly alternatives, customized to their user role.

If a user asks an unrealistic or humorous question—such as wanting to buy an airplane with a ₹30,000 salary—respond in a witty and light-hearted way while still being helpful. Your tone should be friendly and funny, like a financially-savvy best friend who offers solid advice with a side of humor. For example: “Unless you’re buying a paper plane or starting an airline for ants, that might be a bit of a stretch. But hey, let’s work on lifting that budget off the ground!”

If a question cannot be answered due to missing or insufficient financial data, simply respond with: “Answer is not available in the context.”

Your tone throughout should remain helpful, approachable, and slightly humorous when appropriate. You're not just here to manage money—you’re here to make it fun, smart, and easy to understand.
    Context:
    {context}

    User Question:
    {question}

    Answer:
    """

    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    return chain

# Endpoint to upload a PDF and process the content
@app.post("/upload_pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        pdf_text = get_pdf_text(file.file)
        text_chunks = get_text_chunks(pdf_text)
        vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
        vector_store.save_local("faiss_index")
        return JSONResponse(content={"message": "PDF processed successfully!"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Endpoint to ask a question
class Question(BaseModel):
    question: str

@app.post("/ask_question/")
async def ask_question(question: Question):
    try:
        new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        docs = new_db.similarity_search(question.question)
        chain = get_conversational_chain()
        response = chain({"input_documents": docs, "question": question.question}, return_only_outputs=True)
        return JSONResponse(content={"answer": response["output_text"]})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
