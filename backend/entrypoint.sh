#!/bin/sh
pip3 install -r /requirements.txt

# May as well do this too, while we're here.
python /backend/manage.py makemigrations
python /backend/manage.py migrate
python /backend/manage.py loaddata criteria_fixture.json

# execs $CMD
exec "$@"