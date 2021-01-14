from django.urls import path
from django.shortcuts import render, redirect, reverse

from . import views
from main.urls import redirect_to

app_name = "blog"
urlpatterns = [
    path("", views.index, name="index"),
    path("<slug:slug>", views.post, name="post"),
    path("feed.rss", views.rss_feed, name="rss_feed"),
    path("RSS-Feed.rss", redirect_to("blog:rss_feed")),
]