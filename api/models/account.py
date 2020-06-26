from django.conf import settings
from django.db import models

from api.models import AccountActivity


class Account(models.Model):
    slug = models.SlugField(unique=True)
    holders = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def last_activity(self):
        return AccountActivity.objects.filter(account=self).last()

    def _prune_duplicate_activities(self, activities, last_activity):
        if not activities or last_activity is None:
            return activities

        matches = AccountActivity.objects.filter(
            account=self,
            date=activities[0].date,
            description=activities[0].description,
            withdrawl=activities[0].withdrawl,
            deposit=activities[0].deposit,
            balance=activities[0].balance,
        ).order_by('activity_number')

        for match in matches:
            overlap = last_activity.activity_number - match.activity_number
            try:
                if (
                    activities[overlap].date == last_activity.date
                    and activities[overlap].description == last_activity.description
                    and activities[overlap].withdrawl == last_activity.withdrawl
                    and activities[overlap].deposit == last_activity.deposit
                    and activities[overlap].balance == last_activity.balance
                ):
                    return activities[overlap + 1:]
            except IndexError:
                pass

        return activities

    def _ensure_balance_integrity(self, activities, last_activity):
        if not activities:
            return

        activities = [last_activity] + activities
        AccountActivity.assert_activities_integrity(activities)

    def append_activities(self, activities):
        last_activity = self.last_activity()

        activities = [AccountActivity(**activity) for activity in activities]
        activities = self._prune_duplicate_activities(activities, last_activity)
        self._ensure_balance_integrity(activities, last_activity)

        if last_activity is None:
            last_activity_number = 0
        else:
            last_activity_number = last_activity.activity_number + 1

        for i, activity in enumerate(activities):
            activity.activity_number = last_activity_number + i
            activity.account = self
        AccountActivity.objects.bulk_create(activities)

        return len(activities)

    def __str__(self):
        return self.slug
