#Entry point for running the application
from flask import Flask, render_template

app = Flask(__name__)

# Route for the index page.
@app.route('/')
def index():
    return render_template('index.html')

# Route for the login page.
@app.route('/login')
def login():
    return render_template('login.html')

# Route for the signup page.
@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/createEvents')
def addEvent():
    return render_template('createEvents.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

if __name__ == '__main__':
    app.run(debug=True)