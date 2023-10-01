from django.urls import path
from django.shortcuts import redirect, reverse
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView

from . import views

def redirect_to(url_name):
    """
    Create a view which redirects to the URL corresponding to url_name
    """
    return lambda _: redirect(reverse(url_name), permanent=True)

app_name = "main"
urlpatterns = [
    path("", views.index, name="index"),
    path(
        "favicon.ico",
        RedirectView.as_view(
            url=staticfiles_storage.url("img/favicon.ico"),
            permanent=True
        )
    ),
    
    path("privacy-policy", views.privacy_policy, name="privacy_policy"),
    path("Privacy-Policy", redirect_to("main:privacy_policy")),

    # Getting and posting chats are disabled
    # because I don't have time to moderate the chat anymore,
    # but I left the code in in case I want to enable it again later
    # path("chat-center", views.chat_center, name="chat_center"),
    # path("Chat-Center", redirect_to("main:chat_center")),
    # path("get-chats", views.get_chats, name="get_chats"),
    # path("post-chat", views.post_chat, name="post_chat"),
    # path("get-new-chats", views.get_new_chats, name="get_new_chats"),
    
    path("maze-game", views.maze_game, name="maze_game"),
    path("Games/First-Game", redirect_to("main:maze_game")),
    path("Projects/First-Game", redirect_to("main:maze_game")),
    
    # For testing 500 errors
    path("error", lambda _: undefined_func()),
]
