from rest_framework import serializers

from api.models import AccountActivity


class AccountActivitySerializer(serializers.ModelSerializer):
    withdrawl = serializers.SerializerMethodField()
    deposit = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()

    def get_withdrawl(self, obj):
        return obj.withdrawl.amount

    def get_deposit(self, obj):
        return obj.deposit.amount

    def get_balance(self, obj):
        return obj.balance.amount

    class Meta:
        model = AccountActivity
        fields = [
            'account',
            'activity_number',
            'date',
            'description',
            'withdrawl',
            'deposit',
            'balance',
        ]
