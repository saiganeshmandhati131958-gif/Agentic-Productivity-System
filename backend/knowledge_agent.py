from google_adk import Agent
from alloydb_client import SessionLocal, text

class KnowledgeAgent(Agent):
    def __init__(self):
        super().__init__(
            name="KnowledgeAgent",
            instructions="You retrieve lecture notes using AlloyDB AI vector search."
        )

    @Agent.tool
    def search_notes(self, query: str, user_id: str):
        """Semantic search over lecture notes using AlloyDB AI built-in embeddings."""
        db = SessionLocal()
        search_query = text("""
            SELECT content, 
                   1 - (embedding <=> google_ml.embedding('text-embedding-004', :query)::vector) as similarity
            FROM notes
            WHERE user_id = :uid
            ORDER BY similarity DESC
            LIMIT 3;
        """)
        result = db.execute(search_query, {"query": query, "uid": user_id}).fetchall()
        return [row[0] for row in result]
