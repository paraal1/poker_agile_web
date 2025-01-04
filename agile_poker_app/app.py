from flask import Flask, render_template, request, redirect, url_for, jsonify
import uuid

app = Flask(__name__)

# Temporary in-memory storage for rooms
rooms = {}
voting_system = {
    "fibonacci": [1, 2, 3, 5, 8, 13, 21],
    "t-shirt": ["XS", "S", "M", "L", "XL"],
}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/create_game", methods=["GET", "POST"])
def create_game():
    if request.method == "POST":
        game_title = request.form["game_title"]
        voting_system = request.form["voting_system"]
        if not game_title.strip():
            return "Game title cannot be empty", 400  # Simple error handling

        # Generate a unique room ID
        room_id = str(uuid.uuid4())[:8]  # Shorten the UUID for simplicity
        rooms[room_id] = {
            "title": game_title,
            "voting_system": voting_system,
            "players": [],
        }

        # Redirect to the game room
        return redirect(url_for("game_room", room_id=room_id))
    return render_template("create_game.html")


@app.route("/game/<room_id>", methods=["GET", "POST"])
def game_room(room_id):
    room = rooms.get(room_id)
    if not room:
        return "Room not found", 404

    if request.method == "POST":
        # Handle vote submission
        vote = request.form["vote"]
        if "votes" not in room:
            room["votes"] = []
        room["votes"].append(vote)

    # Ensure players list exists for this room
    if "players" not in room:
        room["players"] = []

    # Get the voting system from the room data
    voting_system_name = room.get("voting_system")
    options = voting_system.get(voting_system_name, [])

    return render_template("game_room.html", room=room, options=options)


@app.route("/game/<room_id>/join", methods=["POST"])
def join_game(room_id):
    room = rooms.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404

    player_name = request.json.get("player_name")
    if player_name:
        room["players"].append(player_name)
        return jsonify({"success": True})
    return jsonify({"error": "Player name is required"}), 400


@app.route("/game/<room_id>/players", methods=["GET"])
def get_players(room_id):
    room = rooms.get(room_id)
    if not room:
        return jsonify({"error": "Room not found"}), 404

    # Return the list of players as JSON
    return jsonify(room["players"])


if __name__ == "__main__":
    app.run(debug=True)
