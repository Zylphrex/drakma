from django.contrib import admin

from api.models import (
    Account,
    AccountActivity,
    AmountOwing,
    CurrentAccount,
)

admin.site.register(Account)
admin.site.register(AccountActivity)
admin.site.register(AmountOwing)
admin.site.register(CurrentAccount)
