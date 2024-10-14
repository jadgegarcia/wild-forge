FROM python:3.11

WORKDIR /app

COPY  ./backend /app

COPY ./requirements.txt /requirements.txt

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod 755 /entrypoint.sh

EXPOSE 8000

CMD python manage.py runserver 0:8000

ENTRYPOINT ["/entrypoint.sh"]