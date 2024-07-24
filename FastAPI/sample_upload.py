import requests
import time

API_URL = "http://localhost:8000/data/"  # Update this URL if your FastAPI app runs on a different host/port

def get_coordinates():
    # Your logic for getting coordinates goes here
    # For demonstration, we return a static coordinate
    return {"x_axis": 1.0, "y_axis": 2.0}

def main():
    while True:
        coordinates = get_coordinates()
        response = requests.post(API_URL, json=coordinates)
        if response.status_code == 200:
            print(f"Successfully posted: {coordinates}")
        else:
            print(f"Failed to post data: {response.status_code}, {response.text}")
        time.sleep(5)  # Adjust the interval as needed

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Stopped by user")