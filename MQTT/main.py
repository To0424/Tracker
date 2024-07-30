# main.py
import time
from db import SessionLocal, fetch_tags, fetch_latest_data
from mqtt_client import publish_data, stop_mqtt

def first_publish():
    session = SessionLocal()
    try:
        tag_ids = fetch_tags(session)
        latest_data_points = fetch_latest_data(session, tag_ids)
        for tag_id, point in latest_data_points.items():
            publish_data([point])  # Publish only the latest data point for each tag
    finally:
        session.close()

if __name__ == "__main__":
    try:
        while True:
            first_publish()
            time.sleep(5)  # Adjust the interval as needed
    except KeyboardInterrupt:
        print("Publishing stopped")
    finally:
        stop_mqtt()