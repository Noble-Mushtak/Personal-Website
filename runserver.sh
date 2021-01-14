#!/bin/bash
if [[ "$1" = "no_debug" ]]; then
    DJANGO_LOCAL=True python3 manage.py runserver 0:8070 --insecure
else
    DJANGO_DEBUG=True DJANGO_LOCAL=True python3 manage.py runserver 0:8070
fi