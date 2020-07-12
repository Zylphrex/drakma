from django.urls import path

from . import endpoints


urlpatterns = [
    path('current_account/', endpoints.CurrentAccountApi.as_view()),
    path('accounts/', endpoints.AccountsApi.as_view()),
    path('accounts/<account_slug>/upload/<filename>/', endpoints.AccountsUploadApi.as_view()),
    path('accounts/<account_slug>/activities/stats/', endpoints.AccountActivitiesStatsApi.as_view()),
    path('accounts/<account_slug>/owes/<owed_to>/', endpoints.AmountOwingApi.as_view()),
    path('error/', lambda _: 1 / 0),
]
