from flask import Flask
from flask_migrate import Migrate
from models import db, User, Role, Appointment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize the database first

migrate = Migrate(app, db)  # Then set up the migrations

# Define routes and views here

if __name__ == '__main__':
    app.run(port=5555)
