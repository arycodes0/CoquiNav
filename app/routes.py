from flask import Flask, request, session, redirect, url_for, flash, render_template
from firebase_auth import verify_user_token  # Import your Firebase auth helper

app = Flask(__name__)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Here we assume that the front-end sends the Firebase ID token to the backend
        id_token = request.form.get('id_token')

        # Verify the Firebase ID token
        uid = verify_user_token(id_token)
        
        if uid:
            # Log the user in (set session)
            session['user_id'] = uid  # Store Firebase user UID in session
            flash('Login successful', 'success')

            # Redirect the user to the events page
            return redirect(url_for('events_page'))
        else:
            flash('Login failed. Invalid token.', 'danger')

    return render_template('login.html')

@app.route('/signup')
def signup():
    return render_template('signup.html')

@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/events')
def events():
    return render_template('events.html')

@app.route('/addEvent')
def addEvent():
    return render_template('createEvents.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

if __name__ == '__main__':
    app.run(debug=True)