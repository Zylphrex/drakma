from datetime import datetime

from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Account, AccountActivity
from api.serializers import AccountActivitySerializer


class AccountActivitiesApi(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, **kwargs):
        start_date = request.GET.get('startDate')
        if start_date:
            try:
                start_date = datetime.fromisoformat(start_date)
            except ValueError:
                raise ParseError(detail='Invalid start date: {}'.format(start_date))

        end_date = request.GET.get('endDate')
        if end_date:
            try:
                end_date = datetime.fromisoformat(end_date)
            except ValueError:
                raise ParseError(detail='Invalid end date: {}'.format(end_date))

        try:
            slug = kwargs['slug']
            account = Account.objects.get(holders__in=[request.user], slug=slug)
        except Account.DoesNotExist:
            raise Http404

        activities = AccountActivity.objects.filter(account=account)
        if start_date:
            activities = activities.filter(date__gte=start_date)
        if end_date:
            activities = activities.filter(date__lte=end_date)
        activities = activities.order_by('activity_number')
        serializer = AccountActivitySerializer(activities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
