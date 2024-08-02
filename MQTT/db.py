from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from concurrent.futures import ThreadPoolExecutor

# Database configuration
DATABASE_URL = "postgresql://postgres:25613630@localhost:5432/Coord"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def fetch_tags(session):
    query = text("""
        SELECT DISTINCT tag_id
        FROM tags
    """)
    result = session.execute(query)
    return [row.tag_id for row in result.fetchall()]

def fetch_latest_data_for_tag(session, tag_id):
    query = text("""
        SELECT x_axis, y_axis, timestamp, floor
        FROM tags
        WHERE tag_id = :tag_id
        ORDER BY timestamp DESC
        LIMIT 1
    """)
    result = session.execute(query, {"tag_id": tag_id})
    row = result.fetchone()
    if row:
        return {
            "tag_id": tag_id,
            "x_axis": row.x_axis,
            "y_axis": row.y_axis,
            "timestamp": row.timestamp,
            "floor": row.floor
        }
    else:
        return None

def fetch_latest_data(session, tag_ids):
    with ThreadPoolExecutor() as executor:
        results = executor.map(lambda tag_id: fetch_latest_data_for_tag(session, tag_id), tag_ids)
    data = {tag_id: result for tag_id, result in zip(tag_ids, results) if result is not None}
    return data

def fetch_historical_data(session, tag_id, start_time, end_time):
    query = text("""
        SELECT x_axis, y_axis, timestamp, floor
        FROM tags
        WHERE tag_id = :tag_id AND timestamp BETWEEN :start_time AND :end_time
        ORDER BY timestamp
    """)
    result = session.execute(query, {"tag_id": tag_id, "start_time": start_time, "end_time": end_time})
    return [
        {"tag_id": tag_id, "x_axis": row.x_axis, "y_axis": row.y_axis, "timestamp": row.timestamp, "floor": row.floor}
        for row in result.fetchall()
    ]
