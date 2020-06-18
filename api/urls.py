from django.urls import path

from . import endpoints


urlpatterns = [
    path('accounts/', endpoints.AccountsApi.as_view()),
    path('current_account/', endpoints.CurrentAccountApi.as_view()),
]
