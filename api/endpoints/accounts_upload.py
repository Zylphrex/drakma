from datetime import datetime

from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.http import Http404
from rest_framework.exceptions import ParseError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from api.models import Account, AccountActivity
from api.serializers import AccountSerializer
from api.utils.csv import csv_file_to_dicts
from api.utils.money import BalanceIntegrityException, parse_money


class AccountsUploadApi(LoginRequiredMixin, APIView):
    def put(self, request, **kwargs):
        try:
            slug = kwargs['slug']
            account = Account.objects.get(holders__in=[request.user], slug=slug)
        except Account.DoesNotExist:
            raise Http403

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
