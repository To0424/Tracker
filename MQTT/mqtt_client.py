import json
import paho.mqtt.client as mqtt
from db import SessionLocal, fetch_historical_data

# MQTT configuration
MQTT_BROKER = 'broker.hivemq.com'
MQTT_PORT = 1883
MQTT_TOPIC = 'cart/position'
MQTT_REQUEST_TOPIC = 'cart/history/request'
MQTT_RESPONSE_TOPIC = 'cart/history/response'

mqtt_client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    if (rc == 0):
        print("Connected to MQTT Broker!")
        mqtt_client.subscribe(MQTT_REQUEST_TOPIC)
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload)
        tag_id = payload.get("tag_id")
        start_time = payload.get("start_time")
        end_time = payload.get("end_time")

        # Validate input
        if not tag_id or not start_time or not end_time:
            raise ValueError("Invalid input data")

        # Ensure tag_id is numeric
        if not str(tag_id).isdigit():
            raise ValueError("Invalid tag ID")

        session = SessionLocal()
        try:
            historical_data = fetch_historical_data(session, tag_id, start_time, end_time)
            response_payload = json.dumps(historical_data, default=str)
            mqtt_client.publish(MQTT_RESPONSE_TOPIC, response_payload)
            print(f"Published historical data: {response_payload}")
        finally:
            session.close()
    except Exception as e:
        print(f"Error processing message: {e}")

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

def publish_data(data_points):
    for data_point in data_points:
        payload = json.dumps({
            "tag_id": data_point["tag_id"],
            "x_axis": data_point["x_axis"],
            "y_axis": data_point["y_axis"],
            "timestamp": data_point["timestamp"].isoformat(),
            "floor": data_point["floor"]
        })
        mqtt_client.publish(MQTT_TOPIC, payload)
        print(f"Published: {payload}")
    print("All existing data published to MQTT")

def stop_mqtt():
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
