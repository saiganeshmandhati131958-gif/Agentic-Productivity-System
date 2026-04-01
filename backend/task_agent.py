from google_adk import Agent
from alloydb_client import SessionLocal, text

class TaskAgent(Agent):
    def __init__(self):
        super().__init__(
            name="TaskAgent",
            instructions="You manage student tasks in AlloyDB. You can create, list, and prioritize tasks."
        )

    @Agent.tool
    def get_pending_tasks(self, user_id: str):
        """Retrieves all pending tasks for a user from AlloyDB."""
        db = SessionLocal()
        result = db.execute(
            text("SELECT title, deadline, difficulty FROM tasks WHERE user_id = :uid AND status = 'pending'"),
            {"uid": user_id}
        ).fetchall()
        return [dict(row) for row in result]
