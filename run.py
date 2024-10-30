# Entry point of the Flask application.
from flask import Flask, render_template, request, redirect, url_for, flash, session
from firebase_auth import create_user, login_user
import os

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')  # Securely stored secret key.

# Route for the index page.
@app.route('/')
def index():
    # Check if the user is logged in
    if 'user' in session:
        return render_template('index.html')
    else:
        flash('Please log in to access this page.', 'info')
        return redirect(url_for('login'))

# Route for user signup/registration.
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate input
        if not email or not password:
            flash('Email and password are required.', 'danger')
            return redirect(url_for('signup'))

        # Create a user in Firebase
        user = create_user(email, password)
        
        if user:
            flash('Signup successful! Please log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Signup failed. Please try again.', 'danger')

    return render_template('signup.html')  # Render signup.html for both GET and POST requests

# Route for user login.
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate input
        if not email or not password:
            flash('Email and password are required.', 'danger')
            return redirect(url_for('login'))

        # Authenticate user with Firebase
        user = login_user(email, password)

        if user:
            session['user'] = email  # Save user session
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Login failed. Please check your credentials and try again.', 'danger')

    return render_template('login.html')

# Route for user logout.
@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove the user session
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
