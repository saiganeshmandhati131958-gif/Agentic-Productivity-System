from google_adk import Agent, Tool
import os

# MCP Server configurations
CALENDAR_MCP = {
    "name": "google_calendar",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-google-calendar"],
    "env": {"GOOGLE_CREDENTIALS_JSON": os.getenv("GOOGLE_CREDENTIALS_JSON")}
}

class ScheduleAgent(Agent):
    def __init__(self):
        super().__init__(
            name="ScheduleAgent",
            instructions="You are an expert academic scheduler. You manage Google Calendar via MCP.",
            mcp_servers=[CALENDAR_MCP]
        )
