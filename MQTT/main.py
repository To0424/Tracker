import time
from db import SessionLocal, fetch_tags, fetch_latest_data
from mqtt_client import publish_data, stop_mqtt

def first_publish():
    session = SessionLocal()
    try:
        tag_ids = fetch_tags(session)
        latest_data_points = fetch_latest_data(session, tag_ids)
        # Ensure publish_data is called with the correct arguments
        publish_data(list(latest_data_points.values()))  # Pass the list of data points
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
