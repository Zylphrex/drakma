from django.contrib import admin

from api.models import Account, AccountActivity, CurrentAccount

admin.site.register(Account)
admin.site.register(AccountActivity)
admin.site.register(CurrentAccount)
