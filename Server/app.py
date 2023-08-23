from flask import Flask, jsonify
from flask_migrate import Migrate
from models import db, User, Role, Appointment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize the database first

migrate = Migrate(app, db)  # Then set up the migrations

@app.route('/')
def home():
    return "<h1>dashboard</h1>"
# Define the route to get all users
@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    user_list = []
    for user in users:
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role.name
        }
        user_list.append(user_data)
    return jsonify(user_list)

# Define the route to get all appointments
@app.route('/appointments', methods=['GET'])
def get_all_appointments():
    appointments = Appointment.query.all()
    appointment_list = []
    for appointment in appointments:
        try:
            appointment_data = {
                'id': appointment.id,
                'title': appointment.title,
                'description': appointment.description,
                'date': appointment.date.strftime('%Y-%m-%d'),  # Format the date
                'category': appointment.category,
                'time': appointment.time,
                'status': appointment.status,
                'phone_number': appointment.phone_number,
                'user_id': appointment.user_id
            }
            appointment_list.append(appointment_data)
        except Exception as e:
            print(f"Error processing appointment {appointment.id}: {e}")
    return jsonify(appointment_list)



if __name__ == '__main__':
    app.run(port=5555)
