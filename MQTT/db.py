# db.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from concurrent.futures import ThreadPoolExecutor

# Database configuration
DATABASE_URL = "postgresql://postgres:25613630@localhost:5432/Coord"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fetch_tags(session):
    query = text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name LIKE 'tag_%'
    """)
    result = session.execute(query)
    return [row.table_name for row in result.fetchall()]

def fetch_data_for_tag(session, tag):
    query = text(f'SELECT "x_axis", "y_axis" FROM {tag}')
    result = session.execute(query)
    return [{"tag": tag, "id": idx, "x_axis": row.x_axis, "y_axis": row.y_axis} for idx, row in enumerate(result.fetchall())]

def fetch_data(session, tags):
    with ThreadPoolExecutor() as executor:
        results = executor.map(lambda tag: fetch_data_for_tag(session, tag), tags)
    data = [item for sublist in results for item in sublist]  # Flatten the list of lists
    return data