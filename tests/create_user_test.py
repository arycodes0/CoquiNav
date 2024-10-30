import unittest
from unittest.mock import patch
from firebase_admin import auth
from firebase_auth import create_user

class TestFirebaseAuth(unittest.TestCase):

    @patch('firebase_admin.auth.create_user')
    def test_create_user_success(self, mock_create_user):
        # Mock successful user creation
        mock_create_user.return_value = auth.UserRecord(uid='test_uid')
        
        # Call create_user function with test email and password
        user = create_user('testuser@example.com', 'testpassword123')

        # Verify user is successfully created
        self.assertIsNotNone(user)
        self.assertEqual(user.uid, 'test_uid')

    @patch('firebase_admin.auth.create_user')
    def test_create_user_failure(self, mock_create_user):
        # Mock an exception during user creation
        mock_create_user.side_effect = Exception("Error creating user")
        
        # Call create_user and expect None due to the exception
        user = create_user('testuser@example.com', 'testpassword123')

        # Verify that user creation failed and returned None
        self.assertIsNone(user)

