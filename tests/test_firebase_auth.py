import firebase_admin
from firebase_admin import auth, credentials
from unittest.mock import patch

# Initialize Firebase Admin SDK
cred = credentials.Certificate('/home/aryam/Holberton/CoquiNav/config/coquinav_firebase_config.json')
firebase_admin.initialize_app(cred)

# Function to create a new user and return their ID token
def test_create_user():
    user = None
    try:
        email = "testuser@example.com"
        password = "securepassword"

        # Check if the user already exists and delete them if they do
        try:
            existing_user = auth.get_user_by_email(email)
            auth.delete_user(existing_user.uid)
            print('Deleted existing user:', existing_user.uid)
        except firebase_admin.exceptions.NotFoundError:
            print('No existing user found with email:', email)

        # Create a new user
        user = auth.create_user(
            email=email,
            password=password
        )
        print('Successfully created new user:', user.uid)

        # Generate a custom token for the user
        custom_token = auth.create_custom_token(user.uid)
        print('Generated Custom Token (used as ID token here):', custom_token.decode('utf-8'))

        return custom_token.decode('utf-8'), user.uid
    except Exception as e:
        print('Error creating user or generating token:', e)
        return None, None

# Mock the verification of the ID token
def test_verify_user_token(id_token):
    with patch('firebase_admin.auth.verify_id_token') as mock_verify:
        try:
            # Simulate the behavior of the verify_id_token method
            mock_verify.return_value = {'uid': 'mocked_user_uid'}
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            print('Token verified. User ID:', uid)
            return uid
        except Exception as e:
            print('Error verifying token:', e)
            return None

if __name__ == "__main__":
    # Test user creation and token verification
    id_token, user_uid = test_create_user()
    if id_token:
        test_verify_user_token(id_token)
    
    # Delete the user after testing
    if user_uid:
        auth.delete_user(user_uid)
        print('Successfully deleted user:', user_uid)
