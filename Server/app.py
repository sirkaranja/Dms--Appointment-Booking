from flask import Flask, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, login_required, roles_required
from flask_login import LoginManager, current_user
from flask_migrate import Migrate
from models import db, User,Role, Appointment
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'appointmentsystem'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointment.db'
db = SQLAlchemy(app)
migrate = Migrate(app, db)





if __name__ == '__main__':
    app.run(debug=True, port=5000)
