from django.conf import settings
from django.db import models


class Account(models.Model):
    slug = models.SlugField(unique=True)
    holders = models.ManyToManyField(settings.AUTH_USER_MODEL)

    def __str__(self):
        return self.slug
