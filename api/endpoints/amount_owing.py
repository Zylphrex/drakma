from rest_framework.exceptions import ParseError, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import Account, AmountOwing, Contact
from api.utils.money import parse_money, zero_dollars

from sms import send_sms


class AmountOwingApi(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, **kwargs):
        try:
            slug = kwargs['account_slug']
            account = Account.objects.get(holders__in=[request.user], slug=slug)
        except Account.DoesNotExist:
            raise PermissionDenied(detail='No available account with name found.')

        try:
            amount = parse_money(request.data['amount'])
        except KeyError:
            raise ParseError(detail='Missing data: amount')

        try:
            contact = Contact.objects.get(user=request.user)
        except Contact.DoesNotExist:
            raise PermissionDenied(detail='No contact info for user found.')

        owed_to = kwargs['owed_to']
        owing, created = AmountOwing.objects.get_or_create(account=account, owed_to=owed_to)
        owing.amount = amount
        owing.save()

        if amount > zero_dollars():
            message = f"There is an balance of {amount} on your account with {owed_to}"
            send_sms(contact.phone_number, message)

        return Response(status=status.HTTP_200_OK)
