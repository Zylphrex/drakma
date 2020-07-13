from django.conf import settings
from django.db import models
from djmoney.models.fields import MoneyField


class Contact(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, primary_key=True)
    phone_number = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.user} {self.phone_number}'
