# wildforge-api

## Running Dev

#### Setup Python Virtual Environment
```bash
python -m venv venv
venv/Scripts/activate

# install the requirements
pip install -r requirements.txt
```

To deactivate virtual environment
```bash
deactivate
```




check if wildforge-db is running 

#### Running Django REST API
```bash
python backend/manage.py makemigrations
python backend/manage.py migrate
python backend/manage.py loaddata backend/api/fixtures/gemini_fixture.json
python backend/manage.py runserver
```

#### Running Test
```bash
python backend/manage.py test
```

### Swagger Endpoint
http://0.0.0.0:8000/swagger/