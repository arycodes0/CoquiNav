from unittest.mock import patch
from firebase_auth import verify_user_token

class TestFirebaseTokenVerification(unittest.TestCase):

    @patch('firebase_admin.auth.verify_id_token')
    def test_verify_token_success(self, mock_verify_id_token):
        # Mock a successful token verification
        mock_verify_id_token.return_value = {'uid': 'test_uid'}

        # Call the verify_user_token function
        uid = verify_user_token('test_id_token')

        # Verify that the UID is correctly returned
        self.assertEqual(uid, 'test_uid')

    @patch('firebase_admin.auth.verify_id_token')
    def test_verify_token_failure(self, mock_verify_id_token):
        # Mock an exception during token verification
        mock_verify_id_token.side_effect = Exception("Invalid token")
        
        # Call the verify_user_token function with an invalid token
        uid = verify_user_token('invalid_token')

        # Verify that the function returns None when verification fails
        self.assertIsNone(uid)

