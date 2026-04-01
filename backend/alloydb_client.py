import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# AlloyDB Connection Details
ALLOYDB_DB = os.getenv("ALLOYDB_DB", "productivity_os")
ALLOYDB_USER = os.getenv("ALLOYDB_USER", "postgres")
ALLOYDB_PASS = os.getenv("ALLOYDB_PASS")
ALLOYDB_HOST = os.getenv("ALLOYDB_HOST")

DATABASE_URL = f"postgresql://{ALLOYDB_USER}:{ALLOYDB_PASS}@{ALLOYDB_HOST}/{ALLOYDB_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS google_ml_integration CASCADE;"))
        
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                deadline TIMESTAMP,
                difficulty INT,
                status TEXT DEFAULT 'pending',
                user_id TEXT
            );
        """))
        
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS notes (
                id SERIAL PRIMARY KEY,
                content TEXT,
                embedding vector(768),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_id TEXT
            );
        """))
        conn.commit()
