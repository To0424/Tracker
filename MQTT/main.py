# main.py
import time
from db import SessionLocal, fetch_data
from mqtt_client import publish_data, stop_mqtt

def first_publish():
    session = SessionLocal()
    try:
        data_points = fetch_data(session)
        publish_data(data_points)
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