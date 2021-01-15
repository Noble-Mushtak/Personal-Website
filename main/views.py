import sys
import json
from django.shortcuts import render
from django.urls import reverse
from django.http import HttpResponse, HttpResponseForbidden
from django.utils.html import escape
from django.utils import timezone
from django.views.decorators.cache import never_cache
from .forms import GetChatsForm, GetNewChatsForm, PostChatForm
from .models import ChatModel

def index(request):
    """
    View for home page
    """
    return render(request, "main/index.html", {})

def privacy_policy(request):
    """
    View for Privacy Policy
    """
    return render(request, "main/privacy-policy.html", {})

def chat_center(request):
    """
    View for Chat Center
    """
    return render(request, "main/chat-center.html", {})

def maze_game(request):
    """
    View for Maze Game
    """
    return render(request, "main/maze-game.html", {})

GENERIC_ERROR_MESSAGE = "Whoops! Looks like something went wrong. Please refresh the page."

def err_response(form):
    """
    Given a form such that !form.is_valid(),
      returns a 400 HttpResponse representing that form's error messages.
    """
    # Log form errors
    print(form.errors.as_text(), file=sys.stderr)
    return HttpResponse(
        GENERIC_ERROR_MESSAGE,
        status=400,
        content_type="text/plain",
    )

# get_chats is not cached so that
#  the most up-to-date comments are always loaded in the chat center
@never_cache
def get_chats(request):
    """
    Gets chat comments
    """
    if request.method == "GET":
        # Data validation:
        form = GetChatsForm(request.GET)
        if form.is_valid():
            start = form.cleaned_data["start"]
            # By default, start is 100:
            if start == None: start = 100
            
            end = form.cleaned_data["end"]
            # By default, end is 0:
            if end == None: end = 0
            
            slug = form.cleaned_data["slug"]
            all_chats = ChatModel.objects.filter(slug=slug).order_by("time")
            num_comments = all_chats.count()

            # We want to get the latest start comments before the latest end comments.
            # For example, if start=100, end=0, we want to get the last 100 comments.
            # If start=100, end=50, we want to get the 50 comments before the last 50 comments.
            # If start=150, end=100, we want to get the 50 comments before the last 100 comments.
            start = min(start, num_comments)
            end = min(start, end)

            chats_json = []
            for chat in all_chats[num_comments-start:num_comments-end]:
                chats_json.append({
                    "name": chat.name,
                    "text": chat.text,
                    "time": chat.time.__format__("%a, %d %b %Y %H:%M:%S GMT"),
                })
            return HttpResponse(
                json.dumps({
                    "comments": chats_json,
                    "numTotalComments": num_comments,
                }), content_type="application/json"
            )
        else:
            # If validation fails, respond with the error messages:
            return err_response(form)
    else:
        return HttpResponse(
            "GET method is required", status=405,
            content_type="text/plain"
        )

# get_new_chats is continuously polled,
#  so it should never be cached
@never_cache
def get_new_chats(request):
    """
    Gets new chat comments
    """

    if request.method == "GET":
        # Data validation:
        form = GetNewChatsForm(request.GET)
        if form.is_valid():
            last_num_comments = form.cleaned_data["last_num_comments"]
            slug = form.cleaned_data["slug"]
            
            all_chats = ChatModel.objects.filter(slug=slug).order_by("time")
            num_comments = all_chats.count()

            # We want to get all the chats between last_num_comments
            #  and num_comments.
            last_num_comments = min(last_num_comments, num_comments)
            # If there are no such comments, just return a 204 response:
            if num_comments == last_num_comments:
                # text/plain stops HTML minifier from taking effect
                return HttpResponse(
                    status=204,
                    content_type="text/plain"
                )

            chats_json = []
            for chat in all_chats[last_num_comments:]:
                chats_json.append({
                    "name": chat.name,
                    "text": chat.text,
                    "time": chat.time.__format__("%a, %d %b %Y %H:%M:%S GMT"),
                })
            return HttpResponse(
                json.dumps({
                    "comments": chats_json,
                    "numTotalComments": num_comments,
                }), content_type="application/json"
            )
        else:
            # If validation fails, respond with the error messages:
            return err_response(form)
    else:
        return HttpResponse(
            "GET method is required", status=405,
            content_type="text/plain"
        )

def post_chat(request):
    """
    Posts chat comment
    Requires POST method, see main.forms.ChatForm for POST parameters
    """
    if request.method == "POST":
        # Data validation:
        form = PostChatForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data["name"]
            text = form.cleaned_data["text"]
            formatting = form.cleaned_data["formatting"]
            slug = form.cleaned_data["slug"]

            # Escape any HTML code if the user selected regular formatting,
            #  but preserve newlines using <br>.
            if formatting == "1":
                text = "<br>".join(escape(text).split("\n"))
            # Save the chat comment
            ChatModel.objects.create(
                name=name, text=text, time=timezone.now(), slug=slug
            )
            
            # Log that new chat comment was posted
            print(f"New chat comment posted at { slug }")
            # 204 indicates success
            # text/plain stops HTML minifier from taking effect
            return HttpResponse(
                status=204,
                content_type="text/plain"
            )
        else:
            # If validation fails, respond with the error messages:
            return err_response(form)
    else:
        return HttpResponse(
            "POST method is required", status=405,
            content_type="text/plain"
        )

def csrf_failure(request, reason=""):
    """
    View used for CSRF_FAILURE_VIEW in settings file
    """
    # Log CSRF Failures
    print(f"CSRF verification failed! Reason: { reason }", file=sys.stderr)
    return HttpResponseForbidden(GENERIC_ERROR_MESSAGE, content_type="text/plain")