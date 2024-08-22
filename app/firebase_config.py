import firebase_admin
from firebase_admin import credentials

""" Path to the downloaded service account key JSON file """
cred = credentials.Certificate('/home/aryam/Holberton/CoquiNav/config/coquinav_firebase_config.json')

""" Initialize the Firebase app """
firebase_admin.initialize_app(cred)
