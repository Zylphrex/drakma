from django.utils.html import escape
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from api.models import Account, SkipTheDishesOrder
from api.utils.csv import csv_file_to_dicts
from api.utils.money import parse_money
from api.utils.date import parse_datetime, parse_datetime_or_default, parse_duration_or_default


class SkipTheDishesStatementApi(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, **kwargs):
        try:
            slug = kwargs['account_slug']
            account = Account.objects.get(holders__in=[request.user], slug=slug)
        except Account.DoesNotExist:
            raise PermissionDenied(detail='No available account with name found.')

        orders = csv_file_to_dicts(
            request.FILES['orders'],
            field_parsers={
                'Order Number': int,
                'Order Placement Time': parse_datetime,
                'Order Collection Time': parse_datetime_or_default,
                'Food & Beverage Subtotal': parse_money,
                'Food & Beverage HST': parse_money,
                'Skip Paid Vouchers': parse_money,
                'Gross Earnings From Skip': parse_money,
                'Restaurant Subsidy': parse_money,
                'Skip Subsidy': parse_money,
                'Adjustments': parse_money,
                'Courier Delay Time': parse_duration_or_default,
                'Courier Delay Time Contribution': parse_money,
                'Tip to Courier': parse_money,
                'Deliver Fee': parse_money,
                'Delivery Fee HST': parse_money,
            },
            detect_headers=True,
        )

        orders = [
            {
                'account': account,
                'order_number': order['Order Number'],
                'status': order['Status'],
                'type': order['Type'],
                'time_placed': order['Order Placement Time'],
                'time_collected': order['Order Collection Time'],
                'payment_method': order['Payment Method'],
                'food_subtotal': order['Food & Beverage Subtotal'],
                'food_hst': order['Food & Beverage HST'],
                'skip_vouchers': order['Skip Paid Vouchers'],
                'gross_earnings': order['Gross Earnings From Skip'],
                'restaurant_subsidy': order['Restaurant Subsidy'],
                'skip_subsidy': order['Skip Subsidy'],
                'adjustment_details': order['Adjustment Details'],
                'adjustments': order['Adjustments'],
                'courier_delay': order['Courier Delay Time'],
                'courier_delay_contribution': order['Courier Delay Time Contribution'],
                'courier_tip': order['Tip to Courier'],
                'delivery_fee': order['Deliver Fee'],
                'delivery_hst': order['Delivery Fee HST'],
            }
            for order in orders
        ]

        existing = set(
            SkipTheDishesOrder.objects \
                .filter(order_number__in=[o['order_number'] for o in orders]) \
                .values_list('order_number', flat=True)
        )
        orders = [
            SkipTheDishesOrder(**order)
            for order in orders
            if order['order_number'] not in existing
        ]
        SkipTheDishesOrder.objects.bulk_create(orders)

        return Response(status=status.HTTP_200_OK)
