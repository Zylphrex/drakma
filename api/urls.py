from django.urls import path

from . import endpoints


urlpatterns = [
    path('current_account/', endpoints.CurrentAccountApi.as_view()),
    path('accounts/', endpoints.AccountsApi.as_view()),
    path('accounts/<slug>/upload/<filename>/', endpoints.AccountsUploadApi.as_view()),
    path('accounts/<slug>/activities/stats/', endpoints.AccountActivitiesStatsApi.as_view()),
    path('error/', lambda _: 1 / 0),
]
