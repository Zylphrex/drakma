from datetime import timedelta

from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import ExpressionWrapper, F, Min, Max, Sum, fields
from django.http import Http404
from rest_framework import status
from rest_framework.exceptions import ParseError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Account, AccountActivity
from api.serializers import AccountActivitySerializer
from api.utils.date import parse_relative_date


class AccountActivitiesStatsApi(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, **kwargs):
        try:
            start_date = request.GET.get('startDate', '120d')
            start_date = parse_relative_date(start_date)
        except ValueError as e:
            raise ParseError(detail=f'Invalid start date: {start_date}')

        try:
            end_date = request.GET.get('endDate', '0d')
            end_date = parse_relative_date(end_date)
        except ValueError:
            raise ParseError(detail=f'Invalid end date: {end_date}')

        try:
            stats_period = max(int(request.GET.get('statsPeriod', '10')), 1)
        except ValueError:
            raise ParseError(detail=f'Invalid stats period: {stats_period}')

        try:
            slug = kwargs['account_slug']
            account = Account.objects.get(holders__in=[request.user], slug=slug)
        except Account.DoesNotExist:
            raise Http404

        activities = AccountActivity.objects \
            .filter(account=account) \
            .filter(date__gte=start_date) \
            .filter(date__lte=end_date)

        first_date = activities.aggregate(Min('date'))['date__min']

        period = ExpressionWrapper(
            (F('date') - first_date) / stats_period,
            output_field=fields.DurationField()
        )
        period_date = ExpressionWrapper(
            first_date + stats_period * F('period'),
            output_field=fields.DateField()
        )
        activities = activities.annotate(period=period) \
            .order_by('period') \
            .values('period') \
            .annotate(
                period_date=period_date,
                period_balance=ArrayAgg('balance'),
                period_deposit=Sum('deposit'),
                period_withdrawl=Sum('withdrawl'),
            )

        # if there is a period of inactivity on the account, the series
        # will be missing data during those periods, so let's fill them
        activities = list(activities)
        periods = {activity['period'] for activity in activities}
        all_periods = set(range(max(periods) + 1))
        for period in sorted(all_periods - periods):
            # since we align the beginning of the activities to the
            # first activity within the defined date range, the 0th
            # period should always be defined
            assert period != 0

            previous = activities[period - 1]
            activities.insert(period, {
                'period': period,
                'period_date': previous['period_date'] + timedelta(days=stats_period),
                'period_balance': [previous['period_balance'][-1]],
                'period_deposit': 0.,
                'period_withdrawl': 0.,
            })

        # drop the extraneous balance data, we just want the final balance
        # at the end of each period
        for activity in activities:
            activity['period_balance'] = activity['period_balance'][-1]
            activity['period_withdrawl'] = -activity['period_withdrawl']

        return Response(activities, status=status.HTTP_200_OK)
