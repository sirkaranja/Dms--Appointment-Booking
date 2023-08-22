from faker import Faker
from flask_security import SQLAlchemyUserDatastore
from models import db, User, Role, Appointment
from models import app 
from datetime import datetime
from datetime import time as dt_time

fake = Faker()
user_datastore = SQLAlchemyUserDatastore(db, User, Role)  # Initialize the user_datastore

def populate_users(num_users):
    with app.app_context():
        for _ in range(num_users):
            email = fake.email()
            password = fake.password()
            active = True
            roles = ['admin', 'secretary']

            user = user_datastore.create_user(
                email=email,
                password=password,  # Don't hash the password here
                active=active
            )

            for role_name in roles:
                role = user_datastore.find_or_create_role(name=role_name)
                user_datastore.add_role_to_user(user, role)

        db.session.commit()
def populate_appointments(num_appointments):
    with app.app_context():  # Enter the app context
        for _ in range(num_appointments):
            title = fake.sentence(nb_words=5)
            appoint_type = fake.random_element(['Departmental Updates', 'Client Consultation', 'Business', 'Staff Appointment', 'Conflict Resolution'])
            appointment_date = fake.date_this_year()

            # Convert string time to Python time object
            appointment_time_str = fake.time()
            appointment_time = dt_time(*map(int, appointment_time_str.split(':')))

            status = fake.random_element(['Approved', 'Rejected', 'Rescheduled'])

            if status == 'Rescheduled':
                rescheduled_date = fake.date_this_year()
                rescheduled_time_str = fake.time()
                rescheduled_time = dt_time(*map(int, rescheduled_time_str.split(':')))
            else:
                rescheduled_date = None
                rescheduled_time = None

            appointment = Appointment(
                title=title,
                appoint_type=appoint_type,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                status=status,
                rescheduled_date=rescheduled_date,
                rescheduled_time=rescheduled_time
            )

            db.session.add(appointment)

        db.session.commit()




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        populate_users(10)
        populate_appointments(20)
