from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from api.models import Account
from api.serializers import AccountSerializer


class AccountApi(LoginRequiredMixin, APIView):
    def get(self, request):
        slug = request.query_params.get('slug')
        if slug is not None:
            try:
                account = Account.objects.get(holders__in=[request.user], slug=slug)
                serializer = AccountSerializer(account)
            except Account.DoesNotExist:
                raise Http404
        else:
            accounts = Account.objects.filter(holders__in=[request.user]).order_by('slug')
            serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
