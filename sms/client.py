import logging

from django.conf import settings
from twilio.rest import Client


logger = logging.getLogger(__name__)

if (
    settings.TWILIO_ACCOUNT_SID is not None
    and settings.TWILIO_AUTH_TOKEN is not None
    and settings.TWILIO_PHONE_NUMBER is not None
):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
else:
    client = None


def send_sms(number, msg):
    logger.info(f'sending {msg} to {number}')
    if client is not None:
        client.messages.create(
            to=number,
            from_=settings.TWILIO_PHONE_NUMBER,
            body=msg,
        )
