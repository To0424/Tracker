# mqtt_client.py
import json
import paho.mqtt.client as mqtt

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
        print(f"Failed to connect, return code {rc}")

mqtt_client.on_connect = on_connect
mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
mqtt_client.loop_start()

def publish_data(data_points):
    for data_point in data_points:
        payload = json.dumps({
            "tag_id": data_point["tag_id"],
            "x_axis": data_point["x_axis"],
            "y_axis": data_point["y_axis"],
            "timestamp": data_point["timestamp"].isoformat()
        })
        mqtt_client.publish(MQTT_TOPIC, payload)
        print(f"Published: {payload}")
    print("All existing data published to MQTT")

def stop_mqtt():
    mqtt_client.loop_stop()
    mqtt_client.disconnect()