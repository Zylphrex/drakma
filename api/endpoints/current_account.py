from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from api.models import Account, CurrentAccount
from api.serializers import AccountSerializer


class CurrentAccountApi(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        try:
            current_account = CurrentAccount.objects.get(user=request.user)
            serializer = AccountSerializer(current_account.account)
        except CurrentAccount.DoesNotExist:
            account = Account.objects.filter(holders__in=[request.user]).first()
            CurrentAccount.objects.create(user=request.user, account=account)
            serializer = AccountSerializer(account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            account = Account.objects.get(**request.data)
            current_account, _ = CurrentAccount.objects.get_or_create(user=request.user)
            current_account.account = account
            current_account.save()
            return Response(status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            raise Http404;

