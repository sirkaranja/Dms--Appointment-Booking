from flask import Flask
from flask_login import UserMixin
from flask_security import RoleMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointment.db'
db = SQLAlchemy(app)


roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')
    active = db.Column(db.Boolean())
    roles = db.relationship('Role', secondary=roles_users, backref='roled')

class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    title = db.Column(db.String)
    appoint_type = db.Column(db.String)
    appointment_date = db.Column(db.Date)
    appointment_time = db.Column(db.Time)
    status = db.Column(db.String)
    rescheduled_date = db.Column(db.Date)
    rescheduled_time = db.Column(db.Time)
    
    __table_args__ = (
        CheckConstraint(
            appoint_type.in_(['Departmental Updates', 'Client Consultation', 'Business', 'Staff Appointment', 'Conflict Resolution']),
            name='appoint_type_check'
        ),
        CheckConstraint(
            status.in_(['Approved', 'Rejected', 'Rescheduled']),
            name='status_check'
        )
    )
