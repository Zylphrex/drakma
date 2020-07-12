from django.conf import settings
from django.db import models
from djmoney.models.fields import MoneyField


class AmountOwing(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    owed_to = models.CharField(max_length=255)
    amount = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD', null=True)

    def __str__(self):
        return f'[{self.account}] {self.owed_to} {self.amount}'
