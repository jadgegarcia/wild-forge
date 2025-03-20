# Techno Systems

Merged systems:
- Class Management, Team Management, and Peer Evaluation
- Activity Management
- Spring board
- Teknoplat 


# Development

Requirements:
- mysql or postgre
- node & npm
- python 3.11

Run `npm install` first in the `frontend` folder to install all the dependencies to avoid eslint errors.

To auto fix eslint errors open your VSCode User Settings JSON and add the following:
```json
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
},
"editor.formatOnSave": true, 
"eslint.validate": [
    "json",
    "javascript",
    "javascriptreact",
    "html"
],
```

### Eslint and Prettier
If you encounter eslint errors, uninstall `Prettier` extensions in your VSCode so that we will use only the `ESLint` extension. (Note: prettier is already included in our local eslint configuration)

If there is a chance that some files are not being formatted, you can run the following command:
```
npm run lint-fix
```

#### Backend API
```
cd backend
```

Setup Python Virtual Environment
```
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
```

Uncomment this line under `backend/backend/wildforge/settings.py` if commented out
```
# load_dotenv(os.path.join(API_REPO_DIR, 'nondocker.env'))
```

In the "nondocker.env" file edit the credentials according to your local settings credential


Run the migrations and the backend server:
```
python backend/manage.py makemigrations
python backend/manage.py migrate
python backend/manage.py loaddata backend/api/fixtures/gemini_fixture.json
python backend/manage.py runserver
```

# Note:
- gemini fixtures or the default api key settings is located at backend/api/fixtures/gemini_fixture.json
- for the AWS S3 ensure that you add the credentials(access key, secret key, and bucket name) in the nondocker file for running locally


#### Frontend React
```
cd frontend
npm install
```

then run the frontend server:
```
npm start
```


## Run demo
React App:                  http://127.0.0.1:3000/

Django API with swagger:    http://127.0.0.1:8000/swagger/

