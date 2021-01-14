"""website URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import sys
from django.urls import path, re_path, include
from django.shortcuts import redirect
from django.template import loader
from django.http import HttpResponseNotFound, HttpResponseServerError

def handler404(request, exception=None):
    """
    View for 404 error
    """
    template = loader.get_template("main/404.html")
    return HttpResponseNotFound(template.render({}, request))

def handler500(request):
    """
    View for 500 error
    """
    template = loader.get_template("main/500.html")
    return HttpResponseServerError(template.render({}, request))

urlpatterns = [
    path("", include("main.urls")),
    path("blog/", include("blog.urls")),
    # Redirect Blog/ to blog/
    path(
      "Blog<path:path>",
      lambda _, path: redirect("/blog"+path, permanent=True)
    ),
]