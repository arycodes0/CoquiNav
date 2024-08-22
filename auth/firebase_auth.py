from firebase_admin import auth

def create_user(email, password):
    try:
        user = auth.create_user(
            email=email,
            password=password
        )
        print('You have successfully created a new user:', user.uid)
        return user
    except Exception as e:
        print('Error creating user:', e)
        return None

""" Below we verify the user's token. """

def verify_user_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        print('Token verified. User ID:', uid)
        return uid
    except Exception as e:
        print('Error verifying token:', e)
        return None
