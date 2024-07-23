import json
import time
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import paho.mqtt.client as mqtt
#This file is used to fetch data from the database and publish it to MQTT.
# Database configuration
DATABASE_URL = "postgresql://postgres:25613630@localhost:5432/Coord"
#replace password with database password, databasename with your database name if you are using a postgres database(pgadmin)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# MQTT configuration
MQTT_BROKER = 'broker.hivemq.com'
MQTT_PORT = 1883
MQTT_TOPIC = 'cart/position'

# Create an MQTT client instance
mqtt_client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print("Failed to connect, return code %d\n", rc)

mqtt_client.on_connect = on_connect
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

def fetch_data(session):
    query = text('SELECT "x_axis", "y_axis" FROM data2')
    result = session.execute(query)
    return [{"id": idx, "x_axis": row.x_axis, "y_axis": row.y_axis} for idx, row in enumerate(result.fetchall())]

def first_publish():
    session = SessionLocal()
    try:
        data_points = fetch_data(session)
        for data_point in data_points:
            mqtt_client.publish(MQTT_TOPIC, json.dumps(data_point))
            print(f"Published: {data_point}")
        print("All existing data published to MQTT")
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
        mqtt_client.loop_stop()
        mqtt_client.disconnect()