import os

from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Account, CurrentAccount
from api.serializers import AccountSerializer


class IndexView(LoginRequiredMixin, APIView):
    def get(self, request):
        try:
            current_account = CurrentAccount.objects.get(user=request.user)
            serializer = AccountSerializer(current_account.account)
        except CurrentAccount.DoesNotExist:
            account = Account.objects.filter(holders__in=[request.user]).first()
            CurrentAccount.objects.create(user=request.user, account=account)
            serializer = AccountSerializer(account)
        return redirect("accounts", slug=serializer.data["slug"])


class ReactView(LoginRequiredMixin, APIView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = "index.html"

    def get(self, request, **kwargs):
        return Response({
            "sentry_dsn": os.environ.get("SENTRY_DSN"),
            "sentry_env": os.environ.get("SENTRY_ENV"),
        })
