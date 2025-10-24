from flask import Flask, request
import webbrowser
import os
import sys

app = Flask(__name__)

@app.route('/open')
def open_website():
    user_id = request.args.get('userId')
    if user_id:
        # The URL of your React website, running on the same computer
        website_url = f"http://localhost:3000/?userId={user_id}"

        # Open the website in the default browser based on the operating system
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
    # Run the server on all available network interfaces on port 8082
    app.run(host='0.0.0.0', port=8082)