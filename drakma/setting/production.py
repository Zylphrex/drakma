from .base import *

import django_heroku


SECURE_SSL_REDIRECT = True

# Activate Django-Heroku.
django_heroku.settings(locals(), staticfiles=False)
