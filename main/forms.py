import os
from django import forms
from django.conf import settings

SLUGS = [
    ("/chat-center", "/chat-center"),
]

# Add a slug for every blog post
posts_dir = os.path.join(settings.BASE_DIR, "blog/data/posts")
for entity in os.listdir(posts_dir):
    if len(entity) >= 5 and entity[-5:] == ".json" and \
        os.path.isfile(os.path.join(posts_dir, entity)):
        post_slug = entity[:-5]
        chat_slug = "/blog/"+post_slug
        SLUGS.append((chat_slug, chat_slug))

class GetChatsForm(forms.Form):
    """
    Form fields for getting chat comments
    """
    start = forms.IntegerField(min_value=0, required=False)
    end = forms.IntegerField(min_value=0, required=False)
    slug = forms.ChoiceField(choices=SLUGS)

class GetNewChatsForm(forms.Form):
    """
    Form fields for getting new chat comments
    """
    last_num_comments = forms.IntegerField(min_value=0)
    slug = forms.ChoiceField(choices=SLUGS)

class PostChatForm(forms.Form):
    """
    Form fields for posting a chat comment
    """
    name = forms.CharField(label="Name", max_length=60)
    text = forms.CharField(label="Text", max_length=3000)
    FORMATTING_CHOICES = [
        ("0", "HTML"),
        ("1", "Regular"),
    ]
    formatting = forms.ChoiceField(choices=FORMATTING_CHOICES)
    slug = forms.ChoiceField(choices=SLUGS)