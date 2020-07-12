from rest_framework.exceptions import ParseError, PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.models import Account, AmountOwing
from api.utils.money import parse_money


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

        owed_to = kwargs['owed_to']
        owing, created = AmountOwing.objects.get_or_create(account=account, owed_to=owed_to)

        # changed = owing.amount != amount

        owing.amount = amount
        owing.save()

        return Response(status=status.HTTP_200_OK)
