from django.conf import settings
from django.db import models

from api.models import Account


class CurrentAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, unique=True, on_delete=models.CASCADE)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user} - {self.account}'
