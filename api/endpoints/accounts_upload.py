from datetime import datetime

from django.db import transaction
from rest_framework.exceptions import ParseError, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from api.models import Account, AccountActivity
from api.serializers import AccountSerializer
from api.utils.csv import csv_file_to_dicts
from api.utils.money import BalanceIntegrityException, parse_money


class AccountsUploadApi(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request, **kwargs):
        try:
            slug = kwargs['slug']
            account = Account.objects.get(holders__in=[request.user], slug=slug)
        except Account.DoesNotExist:
            raise PermissionDenied(detail='No available account with name found.')

        activities = csv_file_to_dicts(request.FILES['activities'], [
            ('date', lambda date: datetime.strptime(date, '%m/%d/%Y').date()),
            ('description', lambda description: description.strip()),
            ('withdrawl', parse_money),
            ('deposit', parse_money),
            ('balance', parse_money),
        ])

        try:
            inserted = account.append_activities(activities)
            return Response({'inserted': inserted}, status=status.HTTP_200_OK)
        except BalanceIntegrityException:
            raise ParseError(detail='Balance integrity violation found.')
