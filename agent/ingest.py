import os
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

# Load environment variables (OPENAI_API_KEY)
load_dotenv()

def ingest_data():
    # 1. Load the knowledge base
    knowledge_path = os.path.join(os.path.dirname(__file__), "knowledge.txt")
    loader = TextLoader(knowledge_path)
    documents = loader.load()

    # 2. Split into chunks
    text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    docs = text_splitter.split_documents(documents)

    # 3. Create embeddings and store in Chroma
    embeddings = OpenAIEmbeddings()
    persist_directory = os.path.join(os.path.dirname(__file__), "chroma_db")
    
    # Initialize Chroma and add documents
    print(f"Ingesting {len(docs)} chunks into {persist_directory}...")
    vectorstore = Chroma.from_documents(
        documents=docs,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    
    print("Ingestion complete!")

if __name__ == "__main__":
    if not os.getenv("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY not found in environment.")
    else:
        ingest_data()
