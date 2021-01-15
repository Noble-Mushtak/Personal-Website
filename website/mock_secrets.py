SECRET_KEY = '^lrmqyy24e_s&)hk@5q851p)eer^ac#wx!4(nh_f0b=t4-k7d5'

"""
If you are running this on another computer,
 and do not have a MySQL database with the user noble and db website set up,
 this will need to be modified!
"""
DATABASE = {
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'website',
    'USER': 'noble',
    'PASSWORD': '',
    'HOST': ''
}

WEBMASTER_VERIFICATION = {
    'google': '53553551efcc348a',
}