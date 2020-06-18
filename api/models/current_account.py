from django.conf import settings
from django.db.models import CASCADE, Model, ForeignKey, OneToOneField

from api.models import Account


class CurrentAccount(Model):
    user = OneToOneField(settings.AUTH_USER_MODEL, unique=True, on_delete=CASCADE)
    account = ForeignKey(Account, on_delete=CASCADE)

    def __str__(self):
        return f'{self.user} - {self.account}'
