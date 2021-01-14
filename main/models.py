from django.db import models
from .forms import SLUGS

class ChatModel(models.Model):
    """
    Model used to store chat comment
    """
    name = models.CharField(max_length=60)
    text = models.CharField(max_length=3000)
    time = models.DateTimeField("time posted")
    slug = models.CharField(choices=SLUGS, max_length=1000)