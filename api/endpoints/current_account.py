from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from api.models import Account, CurrentAccount


class CurrentAccountApi(LoginRequiredMixin, APIView):
    def post(self, request):
        try:
            account = Account.objects.get(**request.data)
            current_account, _ = CurrentAccount.objects.get_or_create(user=request.user)
            current_account.account = account
            current_account.save()
            return Response(status=status.HTTP_200_OK)
        except Account.DoesNotExist:
            raise Http404;

