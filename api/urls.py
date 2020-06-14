from django.urls import path

from . import endpoints


urlpatterns = [
    path('accounts/', endpoints.AccountApi.as_view()),
]
