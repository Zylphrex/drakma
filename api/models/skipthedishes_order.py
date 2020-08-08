from django.db import models
from djmoney.models.fields import MoneyField
from moneyed import Money, CAD

class SkipTheDishesOrder(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    order_number = models.PositiveIntegerField(unique=True)
    status = models.CharField(max_length=32)
    type = models.CharField(max_length=32)
    time_placed = models.DateTimeField()
    time_collected = models.DateField(null=True)
    payment_method = models.CharField(max_length=64)
    food_subtotal = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    food_hst = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    skip_vouchers = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    gross_earnings = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    restaurant_subsidy = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    skip_subsidy = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    adjustment_details = models.TextField(blank=True)
    adjustments = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    courier_delay = models.DurationField()
    courier_delay_contribution = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    courier_tip = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    delivery_fee = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')
    delivery_hst = MoneyField(max_digits=19, decimal_places=4, default_currency='CAD')

    def __str__(self):
        return f"[{self.time_placed}] {self.order_number} ({self.type})"
