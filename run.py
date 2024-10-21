# Entry point of the Flask application.
from flask import Flask, render_template, request, redirect, url_for, flash, session
from firebase_auth import create_user, login_user  # Assuming login_user is implemented for authentication
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

# Route for user registration.
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate input
        if not email or not password:
            flash('Email and password are required.', 'danger')
            return redirect(url_for('register'))

        # Create a user in Firebase
        user = create_user(email, password)
        
        if user:
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Registration failed. Please try again.', 'danger')

    return render_template('register.html')

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
        user = login_user(email, password)  # Assuming login_user function is implemented

        if user:
            session['user'] = email  # Save user session
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Login failed. Please check your credentials and try again.', 'danger')

    return render_template('login.html')

# Route for user signup (alias to register page).
@app.route('/signup')
def signup():
    return redirect(url_for('register'))

# Route for user logout.
@app.route('/logout')
def logout():
    session.pop('user', None)  # Remove the user session
    flash('You have been logged out.', 'success')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
