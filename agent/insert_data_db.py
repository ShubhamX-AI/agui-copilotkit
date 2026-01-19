import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

def insert_data(documents):
    """
    Inserts a list of documents into the ChromaDB vector store.
    """
    if not documents:
        print("💎 No new content to ingest.")
        return

    print(f"💎 Ingesting {len(documents)} chunks into ChromaDB...")
    
    # Initialize Vector Store
    embeddings = OpenAIEmbeddings()
    persist_directory = os.path.join(os.path.dirname(__file__), "chroma_db")
    
    vectorstore = Chroma(
        persist_directory=persist_directory, 
        embedding_function=embeddings
    )
    
    vectorstore.add_documents(documents)
    print("💎 Ingestion Finished!")
