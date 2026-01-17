from pydantic import BaseModel
from typing import List, Dict, Any, Optional, Literal

class ContentBlock(BaseModel):
    type: str # 'markdown' | 'flashcards' | 'key_value' | 'image' | 'form'
    # Add optional fields to handle all types of content blocks
    content: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    url: Optional[str] = None
    alt: Optional[str] = None
    fields: Optional[List[Dict[str, Any]]] = None
    submitLabel: Optional[str] = None
    action: Optional[str] = None
    text: Optional[str] = None
    items: Optional[List[Dict[str, Any]]] = None

class UIResponse(BaseModel):
    title: str
    content: List[ContentBlock]
    id: Optional[str] = None
    design: Optional[Dict[str, Any]] = None
    layout: Optional[str] = "vertical"
    dimensions: Optional[Dict[str, Any]] = None

class AgentOutputSchema(BaseModel):
    thought: str
    response_mode: Literal["chat", "ui"]
    chat_message: str
    ui_data: Optional[UIResponse] = None