from google_adk import Orchestrator
from schedule_agent import ScheduleAgent
from task_agent import TaskAgent
from knowledge_agent import KnowledgeAgent

class OrchestratorAgent(Orchestrator):
    def __init__(self):
        super().__init__(
            name="StudentOS_Orchestrator",
            agents=[ScheduleAgent(), TaskAgent(), KnowledgeAgent()],
            instructions="""You are the Student Productivity OS. 
            1. Analyze user requests.
            2. Coordinate with TaskAgent to see what's due.
            3. Coordinate with ScheduleAgent to see free slots.
            4. Use KnowledgeAgent if the user needs study context.
            5. Synthesize a perfect, conflict-free weekly plan."""
        )
