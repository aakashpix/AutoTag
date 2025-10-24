from flask import Flask, request
from flask_socketio import SocketIO
import webbrowser
import os
import sys

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/open')
def open_website():
    user_id = request.args.get('userId')
    if user_id:
        # Step 1: Emit a simple signal to the mobile app
        socketio.emit('generate_otp')
        print(f"Emitted 'generate_otp' signal.")

        # Step 2: Open the website with only the User ID
        website_url = f"http://localhost:3000/?userId={user_id}"
        if sys.platform.startswith('win'):
            os.system(f"start {website_url}")
        elif sys.platform.startswith('darwin'):
            os.system(f"open {website_url}")
        elif sys.platform.startswith('linux'):
            os.system(f"xdg-open {website_url}")
        else:
            webbrowser.open(website_url)

        print(f"Opening website with User ID: {user_id}")
        return "Website opened successfully!"
    else:
        return "User ID not provided.", 400

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)