from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.schema import CheckConstraint 
from datetime import date, datetime
from faker import Faker
import random

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db' 
db = SQLAlchemy(app)
fake = Faker()

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), nullable=False)
    
    role = db.relationship("Role", back_populates="users")

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    date = db.Column(db.Date, nullable=False)
    category = db.Column(db.String, nullable=False)
    time = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    user = db.relationship("User", back_populates="appointments")
    
    __table_args__ = (
        CheckConstraint("status IN ('Approved', 'Rejected', 'Rescheduled', 'Referred')", name="check_status"),
        CheckConstraint("category IN ('Departmental Updates', 'Client Consultation', 'Business', 'Staff Appointment', 'Conflict Resolution')", name="check_category"),
    )

User.appointments = db.relationship("Appointment", order_by=Appointment.id, back_populates="user")
Role.users = db.relationship("User", order_by=User.id, back_populates="role")
# ... (other imports)

# Create sample instances
def create_sample_instances():
    with app.app_context():
        admin_role = Role(name='Admin')
        secretary_role = Role(name='Secretary')
        manager_role = Role(name='Manager')
        
        db.session.add_all([admin_role, secretary_role, manager_role])
        db.session.commit()

        admin_user = User(
            name='Admin User',
            email='admin@example.com',
            password='adminpass',
            role=admin_role
        )

        secretary_user = User(
            name='Secretary User',
            email='secretary@example.com',
            password='secretpass',
            role=secretary_role
        )

        manager_user = User(
            name='Manager User',
            email='manager@example.com',
            password='managerpass',
            role=manager_role
        )

        db.session.add_all([admin_user, secretary_user, manager_user])
        db.session.commit()

        appointment1 = Appointment(
            title='Meeting with Client',
            description='Discuss project details',
            date=date(2023, 8, 25),
            category='Client Consultation',
            time='10:00 AM',
            status='Approved',
            phone_number='123-456-7890',
            user=admin_user
        )

        appointment2 = Appointment(
            title='John Felix Meeting',
            description='Discuss updates',
            date=date(2023, 8, 25),
            category='Staff Appointment',
            time='4:00 PM',
            status='Rejected',
            phone_number='112-654-3210',
            user=manager_user
        )
        appointment3 = Appointment(
            title='Team Meeting',
            description='Discuss project updates',
            date=date(2023, 8, 26),
            category='Departmental Updates',
            time='3:00 PM',
            status='Approved',
            phone_number='987-654-3210',
            user=manager_user
        )
      
        db.session.add_all([appointment1, appointment2,appointment3])
        db.session.commit()

# ... (rest of the code)

if __name__ == '__main__':
    with app.app_context():
        create_sample_instances()
        print("Sample instances created successfully.")

