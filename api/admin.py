from django.contrib import admin

from api.models import Account, AccountActivity, CurrentAccount

# Register your models here.
admin.site.register(Account)
admin.site.register(AccountActivity)
admin.site.register(CurrentAccount)
