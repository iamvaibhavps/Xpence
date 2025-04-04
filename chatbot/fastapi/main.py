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
    You are an AI-powered financial assistant. Your job is to provide personalized answers based on the provided context. Use best budgeting methods, suggest ways to save money, and make sure you consider the user type (students, professionals, senior citizens, families). If the answer is not in the context, just say, "Answer is not available in the context."

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
