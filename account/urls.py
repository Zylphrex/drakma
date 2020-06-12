from django.contrib.auth import views as auth_views
from django.urls import path

app_name = "account"

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name="index.html")),
    path('logout/', auth_views.LogoutView.as_view(template_name="index.html")),
]

