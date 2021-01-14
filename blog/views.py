import json
import os
from django.http import Http404
from django.conf import settings
from django.shortcuts import render, redirect, reverse
from django.utils.dateparse import parse_datetime

def index(request):
    """
    View for blog's home page
    """
    with open(os.path.join(settings.BASE_DIR, "blog/data/directory.json")) \
         as file:
        directory_info = json.load(file)
        
    return render(
      request, "blog/index.html",
      {"directory_info": directory_info}
    )

def post(request, slug):
    """
    View for blog post
    """
    # We expect the slug to be all lowercase
    slug_lowercase = slug.lower()
    
    # Try to open the JSON file about this blog post,
    #  but raise 404 exception if the JSON file can not be found
    try:
        with open(os.path.join(
            settings.BASE_DIR, "blog/data/posts/"+slug_lowercase+".json"
        )) as file:
            context = json.load(file)
    except IOError:
        raise Http404("Blog post not found")
    
    # If this post exists, but the slug was not all lowercase, redirect:
    if slug != slug_lowercase:
        return redirect(
            reverse("blog:post", kwargs={"slug": slug_lowercase}),
            permanent=True
        )
    
    # Parse pubtime (published time) field
    context["pubtime_obj"] = parse_datetime(context["pubtime"])
    
    return render(request, "blog/posts/"+slug+".html", context)

def rss_feed(request):
    """
    RSS Feed for recent blog posts
    """
    # Get the 10 latest blog posts
    with open(os.path.join(settings.BASE_DIR, "blog/data/directory.json")) \
         as file:
        latest_blog_posts_info = json.load(file)[:10]

    # For every post, get the description and pubtime
    for post_info in latest_blog_posts_info:
        slug = post_info["slug"]
        with open(os.path.join(
            settings.BASE_DIR, "blog/data/posts/"+slug+".json"
        )) as file:
            more_post_info = json.load(file)
            post_info["desc"] = more_post_info["desc"]
            # Reformat the pubtime field
            # (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Date)
            post_info["pubtime"] = \
                parse_datetime(more_post_info["pubtime"]) \
                .__format__("%a, %d %b %Y %H:%M:%S GMT")
    
    return render(
        request, "blog/feed.rss",
        {"posts": latest_blog_posts_info},
        content_type="text/xml"
    )