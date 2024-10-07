from flask import request, session, redirect, url_for, flash, render_template
from firebase_auth import verify_user_token  # Import your Firebase auth helper

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
