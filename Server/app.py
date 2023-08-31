from datetime import date
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, User, Role, Appointment

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appointments.db' 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # Initialize the database first

migrate = Migrate(app, db)  # Then set up the migrations

@app.route('/')
def home():
    return "<h1>dashboard</h1>"
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

#delete method for appointments
@app.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    try:
        appointment = Appointment.query.get(appointment_id)
        if appointment:
            db.session.delete(appointment)
            db.session.commit()
            return jsonify({'message': 'Appointment deleted successfully'}), 200
        else:
            return jsonify({'error': 'Appointment not found'}), 404
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Route to update an appointment by ID
@app.route('/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    if request.method == 'PUT':
        data = request.json
        appointment = Appointment.query.get(appointment_id)
        
        if not appointment:
            return jsonify({"message": "Appointment not found"}), 404
        
        appointment.title = data['title']
        appointment.description = data['description']
        appointment.date = date.fromisoformat(data['date'])
        appointment.category = data['category']
        appointment.time = data['time']
        appointment.status = data['status']
        appointment.phone_number = data['phone_number']
        appointment.user_id = data['user_id']
        
        db.session.commit()
        
        return jsonify({"message": "Appointment updated successfully"}), 200
    else:
        return jsonify({"message": "Invalid request method"}), 405

@app.route('/appointments', methods=['POST'])
def add_appointment():
    if request.method == 'POST':
        try:
            data = request.json
            new_appointment = Appointment(
                title=data['title'],
                description=data['description'],
                date=date.fromisoformat(data['date']),
                category=data['category'],
                time=data['time'],
                status=data['status'],
                phone_number=data['phone_number'],
            )
            
            db.session.add(new_appointment)
            db.session.commit()
            
            return jsonify({"message": "Appointment added successfully"}), 201
        except KeyError as e:
            return jsonify({"error": f"Missing field: {str(e)}"}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": "An error occurred while adding the appointment"}), 500
    else:
        return jsonify({"message": "Invalid request method"}), 405


#method for calculating number of appointments based on categories
@app.route('/category_counts', methods=['GET'])
def get_category_counts():
    try:
        # Calculate category counts from the appointments in the database
        category_counts = {
            'Business Appointments': Appointment.query.filter_by(category='Business Appointments').count(),
            'Staff Appointment': Appointment.query.filter_by(category='Staff Appointment').count(),
            'Departmental Updates': Appointment.query.filter_by(category='Departmental Updates').count()
        }
        return jsonify({'category_counts': category_counts})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#user methods
#method for  adding new users 
@app.route('/users', methods=['POST'])
def add_user():
    try:
        data = request.get_json()
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=data['password'],
            role_id=data['role_id']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
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
            'role': user.role_id
        }
        user_list.append(user_data)
    return jsonify(user_list)

#delete user route
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user= User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return jsonify({'message': 'User deleted successfully'}), 200
        else:
            return jsonify({'message': "User not found"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5555)
