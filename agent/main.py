"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.

ARCHITECTURE: Capability Matching
- Data Tools: Pure functions that fetch and return structured data
- UI Tool: Universal render_ui that displays any content via the frontend
- Action Tools: State mutations with no UI side effects
"""

from typing import List, Literal, Dict, Any

from langchain.tools import tool
from langchain.agents import create_agent
from copilotkit import CopilotKitMiddleware, CopilotKitState
from system_prompt import AGENT_PROMPT
from structure import AgentOutputSchema

# ============================================================
# 1. DATA TOOLS (The "Brain" - Fetch Facts)
# ============================================================

@tool
def get_company_data(info_types: List[Literal["services", "location"]]):
    """
    Fetches raw data about the company.
    Returns structured data (List of Dicts) to be used by the UI.
    
    Args:
        info_types: List of information types to fetch ("services", "location")
    
    Returns:
        List of dictionaries with company information
    """
    data = []
    
    if "services" in info_types:
        data.append({
            "id": "services",
            "title": "Our Services",
            "description": "We specialize in AI Consulting, Custom Software Development, and Cloud Architecture, helping businesses transform through modern technology."
        })
    
    if "location" in info_types:
        data.append({
            "id": "location",
            "title": "Our Offices",
            "description": "Headquartered in San Francisco, CA, with strategic global hubs in London and Bangalore to serve our international clients."
        })
        
    return data



# ============================================================
# 2. UNIVERSAL UI TOOL (The "Interface Contract")
# ============================================================

@tool
def render_ui(title: str, content: List[Dict[str, Any]], id: str = None, design: dict = None, layout: str = "vertical"):
    """
    The PRIMARY tool for generating UI. This is the bridge to the frontend.
    Tell the user what to show on the screen.
    
    Args:
        title: The card title
        content: A list of content blocks (Markdown, Image, Form, etc.)
        id: Optional stable ID to update existing card
        design: Optional design config: {themeColor: str, fontFamily: 'serif'|'mono'|'sans', backgroundColor: str}
        layout: 'vertical' or 'grid'
        
    Content Block Types:
    - markdown: {"type": "markdown", "content": "text"}
    - key_value: {"type": "key_value", "data": {"Key": "Value"}}
    - image: {"type": "image", "url": "https://...", "alt": "description"}
    - link: {"type": "link", "url": "https://...", "text": "Click here"}
    - form: {"type": "form", "fields": [...], "submitLabel": "Submit", "action": "tool_name"}
    
    The CopilotKit middleware intercepts this tool's ARGUMENTS and sends them
    to the Frontend to render via UniversalCard component.
    """
    # This tool doesn't need to DO anything in Python except return success.
    # The frontend intercepts the arguments and handles rendering.
    return f"UI card '{title}' rendered."

# For backwards compatibility, keep show_dynamic_card as an alias
show_dynamic_card = render_ui

# ============================================================
# 3. ACTION TOOLS (State Mutations, No UI)
# ============================================================

@tool
def setThemeColor(themeColor: str):
    """
    Changes the primary theme color of the website.
    
    Args:
        themeColor: Hex color code (e.g., "#2563EB")
    """
    return f"Theme color changed to {themeColor}."

@tool
def delete_card(id: str = None, title: str = None):
    """
    Deletes a card/widget from the screen.
    Use this when the user asks to remove, close, or delete a card.
    
    Args:
        id: The ID of the card to delete
        title: The title of the card to delete (if ID is unknown)
    """
    return "Card deleted."

# ============================================================
# 4. STATE MANAGEMENT
# ============================================================

class AgentState(CopilotKitState):
    """
    Agent state schema. Store session-specific data here.
    """
    pass

# ============================================================
# 5. AGENT CONFIGURATION
# ============================================================

agent = create_agent(
    model="gpt-4o-mini",
    tools=[
        # Data Tools (Pure Functions)
        get_company_data,
        
        # Universal UI Tool (The Bridge)
        render_ui,
        show_dynamic_card,  # Alias for backwards compatibility
        
        # Action Tools (State Mutations)
        setThemeColor,
        delete_card,
    ],
    middleware=[CopilotKitMiddleware()],
    state_schema=AgentState,
    system_prompt=AGENT_PROMPT,
    # response_format=AgentOutputSchema
)

graph = agent
