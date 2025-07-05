from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
from flask import render_template

app = Flask(__name__)
try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client['webhooks']
    events = db['events']
    # Test connection
    client.server_info()
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    events = None

@app.route('/webhook', methods=['POST'])
def webhook():
    try:
        event_type = request.headers.get('X-GitHub-Event')
        data = request.json

        if not data:
            return jsonify({"error": "No data received"}), 400

        print(f"Received event: {event_type}")

        event_record = {}

        if event_type == "push":
            print("Extracting push event data...")
            print(data)

            event_record = {
                "event_type": "push",
                "author": data["pusher"]["name"],
                "from_branch": None,
                "to_branch": data["ref"].split("/")[-1],
                "timestamp": datetime.utcnow().isoformat()
            }

            events.insert_one(event_record)
            print("Saved to MongoDB:", event_record)

        elif event_type == "pull_request":
            print("Extracting pull request event data...")
            print(data)

            event_record = {
                "event_type": "pull_request",
                "author": data["sender"]["login"],
                "action": data["action"],
                "title": data["pull_request"]["title"],
                "from_branch": data["pull_request"]["head"]["ref"],
                "to_branch": data["pull_request"]["base"]["ref"],
                "timestamp": datetime.utcnow().isoformat()
            }

            # If pull request is merged
            if data["action"] == "closed" and data["pull_request"]["merged"]:
                event_record["status"] = "merged"
                event_record["merged_by"] = data["pull_request"]["merged_by"]["login"]

            events.insert_one(event_record)
            print("Saved to MongoDB:", event_record)

        else:
            return jsonify({"status": f"Event type {event_type} ignored."}), 200

        return jsonify({"status": "Event received"}), 200

    except Exception as e:
        print(" Error occurred:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/events', methods=['GET'])
def get_events():
    if events is None:
        return jsonify({"error": "MongoDB connection failed"}), 500
    
    try:
        all_events = events.find().sort("timestamp", -1)
        return dumps(all_events), 200
    except Exception as e:
        print(f"Error fetching events: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/events-page')
def events_page():
    return render_template('events.html')

@app.route('/clear-events', methods=['POST'])
def clear_events():
    result = events.delete_many({})
    return jsonify({"status": "cleared", "deleted_count": result.deleted_count}), 200


if __name__ == '__main__':
    app.run(debug=True)