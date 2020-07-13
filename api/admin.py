from django.contrib import admin

from api.models import (
    Account,
    AccountActivity,
    AmountOwing,
    Contact,
    CurrentAccount,
)

admin.site.register(Account)
admin.site.register(AccountActivity)
admin.site.register(AmountOwing)
admin.site.register(Contact)
admin.site.register(CurrentAccount)
