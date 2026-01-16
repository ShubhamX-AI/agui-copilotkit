"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import List, Literal

from langchain.tools import tool
from langchain.agents import create_agent
from copilotkit import CopilotKitMiddleware, CopilotKitState

@tool
def get_company_info(info_types: List[Literal["services", "location"]]):
    """
    Get information about the company's services or location.
    """
    results = []
    
    if "services" in info_types:
        results.append({
            "id": "services",
            "title": "Our Services",
            "description": "We specialize in AI Consulting, Custom Software Development, and Cloud Architecture, helping businesses transform through modern technology."
        })
    
    if "location" in info_types:
        results.append({
            "id": "location",
            "title": "Our Offices",
            "description": "Headquartered in San Francisco, CA, with strategic global hubs in London and Bangalore to serve our international clients."
        })
        
    return results

@tool
def show_company_info(info: List[dict]):
    """
    Displays company information cards on the screen.
    """
    return "Company info displayed."

@tool
def get_weather(location: str):
    """
    Get the weather for a given location and display the weather card.
    """
    return f"The weather for {location} is 70 degrees. Weather card displayed."

@tool
def setThemeColor(themeColor: str):
    """
    Changes the primary theme color of the website.
    """
    return f"Theme color changed to {themeColor}."

@tool
def show_dynamic_card(title: str, content: List[dict], id: str = None, design: dict = None):
    """
    Displays a flexible card with mixed content: markdown, images, key_value pairs, and INTERACTIVE FORMS.
    Use this for general answers, reports, or when asking the user for input.
    - content blocks: {type: 'markdown'|'image'|'form', ...props}
    - design: {themeColor: string, fontFamily: 'serif'|'mono'|'sans'}
    """
    return f"Dynamic card '{title}' displayed."

@tool
def delete_card(id: str = None, title: str = None):
    """
    Deletes a card/widget from the screen. Use this when the user asks to remove, close, or delete a card.
    """
    return "Card deleted."

@tool
def show_proverbs_view():
    """
    Shows the Proverbs management view.
    """
    return "Proverbs view displayed."

@tool
def go_to_moon():
    """
    Initiates the moon mission sequence (Human-in-the-loop).
    """
    return "Moon mission initiated."

@tool
def send_email(to: str, subject: str, body: str):
    """
    Send an email to a recipient.
    """
    print(f"Sending email to {to} with subject: {subject}")
    print(f"Body: {body}")
    return "Email sent successfully."

class AgentState(CopilotKitState):
    proverbs: List[str]

agent = create_agent(
    model="gpt-4.1-mini",
    tools=[
        get_company_info, 
        show_company_info,
        get_weather, 
        setThemeColor, 
        show_dynamic_card, 
        delete_card, 
        show_proverbs_view,
        go_to_moon,
        send_email
    ],
    middleware=[CopilotKitMiddleware()],
    state_schema=AgentState,
    system_prompt="""You are a helpful research assistant and UI orchestrator.
You can control the user's workspace by calling tools that display widgets and cards.

CORE RULES:
1. **Visual First**: Whenever possible, use `show_dynamic_card` or specific UI tools (`get_weather`, `show_company_info`) to present information.
2. **Handling Form Submissions**: 
   - When a user submits a form in a dynamic card, you will receive a message like: `[Form Submitted: Title] Action: action_name Data: { ... }`.
   - Treat this as the user's request. For example, if they submit a "Lead Gen" form, thank them and perhaps show a confirmation card or send an email.
3. **Dynamic Cards**:
   - Use `show_dynamic_card` for flexible layouts.
   - Use a stable `id` to update an existing card (e.g., updating a "Process" card as steps complete).
   - Content blocks:
     - `{"type": "markdown", "content": "..."}`: Rich text.
     - `{"type": "image", "url": "...", "alt": "..."}`: Visuals.
     - `{"type": "form", "fields": [...], "submitLabel": "..."}`: To ask for user input.
4. **Theming**: You can change the global theme color using `setThemeColor`.

Example: If the user asks for weather and company info, call both `get_weather` and `show_company_info` (after fetching data with `get_company_info`).
"""
)

graph = agent
