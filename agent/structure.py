from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ContentBlock(BaseModel):
    type: str
    # Add optional fields to handle all types of content blocks
    content: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    url: Optional[str] = None
    alt: Optional[str] = None
    fields: Optional[List[Dict[str, Any]]] = None
    submitLabel: Optional[str] = None
    action: Optional[str] = None
    text: Optional[str] = None

class AgentOutputSchema(BaseModel):
    title: str
    content: List[ContentBlock]
    id: Optional[str] = None
    design: Optional[Dict[str, Any]] = None
    layout: Optional[str] = "vertical"