import os
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from urllib.parse import urljoin, urlparse
from langchain_core.documents import Document
from langchain_text_splitters import MarkdownTextSplitter
from insert_data_db import insert_data
from dotenv import load_dotenv
import time

load_dotenv()

class JewelScraper:
    def __init__(self, start_url, max_depth=3, max_pages=50):
        self.start_url = start_url
        self.max_depth = max_depth
        self.max_pages = max_pages
        self.history_file = os.path.join(os.path.dirname(__file__), "scraped_urls.txt")
        self.visited = self._load_history()
        self.documents = []
        


    def _load_history(self):
        """Loads previously scraped URLs from disk."""
        if not os.path.exists(self.history_file):
            return set()
        with open(self.history_file, "r") as f:
            return set(line.strip() for line in f if line.strip())

    def _save_url(self, url):
        """Appends a new URL to the history file."""
        with open(self.history_file, "a") as f:
            f.write(url + "\n")

    def is_valid_url(self, url):
        parsed = urlparse(url)
        # Must have netloc, scheme, and be within the same domain/path hierarchy as start_url
        return bool(parsed.netloc) and bool(parsed.scheme) and url.startswith(self.start_url)

    def scrape(self):
        print(f"💎 Starting Jewel Scrape on {self.start_url}")
        print(f"💎 Loaded {len(self.visited)} previously scraped URLs.")
        
        # Use a queue for BFS to handle recursion nicely without stack overflow risks
        # Queue stores tuples: (url, current_depth)
        queue = [(self.start_url, 0)]
        
        pages_scraped_this_session = 0
        
        while queue and pages_scraped_this_session < self.max_pages:
            current_url, depth = queue.pop(0)
            
            if current_url in self.visited:
                continue
            
            if depth > self.max_depth:
                continue

            print(f"   Searching ({depth}): {current_url}")
            
            try:
                # 1. Fetch Page
                response = requests.get(current_url, timeout=10)
                if response.status_code != 200:
                    print(f"   Skipping {current_url} (Status {response.status_code})")
                    continue
                
                # Mark as visited IMMEDIATELY to prevent cycles in queue
                self.visited.add(current_url)
                self._save_url(current_url)
                pages_scraped_this_session += 1
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # 2. Extract Metadata & Images
                title = soup.title.string if soup.title else current_url
                images = []
                for img in soup.find_all('img'):
                    src = img.get('src')
                    if src:
                        absolute_src = urljoin(current_url, src)
                        images.append(absolute_src)
                
                # 3. Clean and Convert
                for element in soup(['script', 'style', 'nav', 'footer', 'header']):
                    element.decompose()
                
                main_content = soup.find('main') or soup.body
                if not main_content:
                    continue
                    
                markdown_text = md(str(main_content), heading_style="ATX")
                
                # 4. Chunk & Store
                chunks = self._create_chunks(markdown_text, title, current_url, images)
                self.documents.extend(chunks) # Store in memory buffer

                # 5. Find links for recursion
                # Only add to queue if we haven't reached depth limit
                if depth < self.max_depth:
                    for link in soup.find_all('a'):
                        href = link.get('href')
                        if href:
                            next_url = urljoin(current_url, href)
                            # Strip fragment identifiers
                            next_url = next_url.split('#')[0]
                            
                            if self.is_valid_url(next_url) and next_url not in self.visited:
                                queue.append((next_url, depth + 1))
                                
                time.sleep(0.5) # Be polite

            except Exception as e:
                print(f"   Error scraping {current_url}: {e}")

        print(f"💎 Scrape session complete. Processed {pages_scraped_this_session} new pages.")
        
        insert_data(self.documents)

    def _create_chunks(self, text, title, url, images):
        """
        Splits text into chunks using MarkdownTextSplitter to preserve heading structure.
        """
        splitter = MarkdownTextSplitter(chunk_size=1000, chunk_overlap=100)
        content_chunks = splitter.split_text(text)
        
        docs = []
        for i, chunk in enumerate(content_chunks):
            if not chunk.strip(): continue
            
            metadata = {
                "source": url,
                "title": title,
                "chunk_index": i,
                "image_urls": ",".join(images[:10])
            }
            
            docs.append(Document(page_content=chunk, metadata=metadata))
            
        return docs

if __name__ == "__main__":
    import sys
    url_arg = sys.argv[1] if len(sys.argv) > 1 else None
    
    if url_arg:
        scraper = JewelScraper(url_arg)
        scraper.scrape()
    else:
        print("Usage: python scraper.py <url>")
