# db.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Database configuration
DATABASE_URL = "postgresql://postgres:25613630@localhost:5432/Coord"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fetch_data(session):
    query = text('SELECT "x_axis", "y_axis" FROM tag_1')
    result = session.execute(query)
    return [{"id": idx, "x_axis": row.x_axis, "y_axis": row.y_axis} for idx, row in enumerate(result.fetchall())]