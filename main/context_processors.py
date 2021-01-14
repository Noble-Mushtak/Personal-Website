from django.conf import settings

def site(request):
    """
    Context processor which allows the use of {{ site_domain }}
    in templates
    """
    return {"site_domain": settings.SITE_DOMAIN}