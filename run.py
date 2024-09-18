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

if __name__ == '__main__':
    app.run(debug=True)