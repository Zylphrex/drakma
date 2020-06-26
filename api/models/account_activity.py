from django.conf import settings
from django.db import models
from djmoney.models.fields import MoneyField
from moneyed import Money, CAD

from api.utils.money import BalanceIntegrityException


class AccountActivity(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    activity_number = models.PositiveIntegerField()
    date = models.DateField()
    description = models.CharField(max_length=255)
    withdrawl = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    deposit = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    balance = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')

    @staticmethod
    def assert_balance_integrity(activity1, activity2, currency=CAD):
        if activity1 is None:
            old_balance = Money('0', currency)
        else:
            old_balance = activity1.balance
        balance_delta = activity2.deposit - activity2.withdrawl
        new_balance = activity2.balance

        if old_balance + balance_delta != new_balance:
            # TODO add more info in the exception
            raise BalanceIntegrityException()

    @staticmethod
    def assert_activities_integrity(activities, currency=CAD):
        for activity1, activity2 in zip(activities, activities[1:]):
            AccountActivity.assert_balance_integrity(activity1, activity2)

    def __str__(self):
        account = getattr(self, 'account', 'N/A')
        number = getattr(self, 'activity_number', 'N/A')
        date = self.date
        description = self.description
        transaction = f'+${self.deposit}/-${self.withdrawl}'
        balance = self.balance
        return f'{account} {number} [{date}] - {description} ({transaction}) {balance}'
