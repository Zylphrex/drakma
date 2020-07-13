from .base import *

import os

import django_heroku


SECURE_SSL_REDIRECT = True

# Activate Django-Heroku.
django_heroku.settings(locals(), staticfiles=False)

TWILIO_ACCOUNT_SID = os.environ['TWILIO_ACCOUNT_SID']
TWILIO_AUTH_TOKEN = os.environ['TWILIO_AUTH_TOKEN']
TWILIO_PHONE_NUMBER = os.environ['TWILIO_PHONE_NUMBER']
