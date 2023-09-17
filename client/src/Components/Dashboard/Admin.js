import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Pagination,
  Container,
  Row,
  Col,
  Nav,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaCalendar,
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
} from 'react-icons/fa';
import logo from '../../assets/logo2.png';
import { Bar } from 'react-chartjs-2';

import './style.css';

const ITEMS_PER_PAGE = 8;

const Admin = () => {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [currentAppointments, setCurrentAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // ... (other state variables)

  const [newAppointment, setNewAppointment] = useState({
    title: '',
    category: '', // Initialize category
    date: '',
    time: '',
    description: '',
    status: '', // Initialize status
    phone_number: '',
  });

 // Create state variables for category and status
 const [selectedCategory, setSelectedCategory] = useState('');
 const [selectedStatus, setSelectedStatus] = useState('');
  const [appointmentCounts, setAppointmentCounts] = useState({
    'Approved': 0,
    'Rejected': 0,
    'Rescheduled': 0,
    'Referred': 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 0,
  });
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };
  const [showReferModal, setShowReferModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [referralNumber, setReferralNumber] = useState('');

  const toggleReferModal = () => {
    setShowReferModal(!showReferModal);
  };

  const handleReferClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    toggleReferModal();
  };

  const handleReferAppointment = async () => {
    // Use selectedAppointmentId and referralNumber to perform referral logic
    // Make API requests and update data accordingly
    toggleReferModal();
  };

const handleDeleteAppointment = async (appointmentId) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
  if (confirmDelete) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Call fetchAppointments to refresh the appointment data
        fetchAppointments();
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  }
};


  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch('http://127.0.0.1:5000/appointments');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAppointments(data);

          const counts = {
            'Approved': 0,
            'Rejected': 0,
            'Rescheduled': 0,
            'Referred': 0,
          };

          data.forEach((appointment) => {
            if (appointment.status in counts) {
              counts[appointment.status]++;
            }
          });

          setAppointmentCounts(counts);

          setCurrentAppointments(data.slice(0, ITEMS_PER_PAGE));
        } else {
          console.error('Invalid data format:', data);
        }

        setAppointmentsLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointmentsLoading(false);
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch('http://127.0.0.1:5000/users');
        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
          setCurrentUsers(data);
        } else {
          console.error('Invalid data format:', data);
        }

        setUsersLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsersLoading(false);
      }
    }

    fetchAppointments();
    fetchUsers();
  }, []);

  const handleUserInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
  
      if (response.ok) {
        // Update the user in the currentUsers state
        setCurrentUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === editingUser.id ? editingUser : user))
        );
  
        setShowEditModal(false); // Close the edit modal
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };



//to delete user
const handleDeleteUser = (userId) => {
  const deleteUserConfirmation = window.confirm("Are you sure you want to delete this user?");
  if (deleteUserConfirmation) {
    deleteUser(userId);
  }
};

const deleteUser = async (userId) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/users/${userId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted user from the currentUsers state
      setCurrentUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
    } else {
      console.error('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};


const handleAddAppointment = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newAppointment,
        category: selectedCategory, // Set category
        status: selectedStatus, // Set status
      }),
    });

    if (response.ok) {
      // Clear the form input fields
      setNewAppointment({
        title: '',
        category: '',
        date: '',
        time: '',
        description: '',
        status: '',
        phone_number: '',
      });

      // Fetch the updated list of appointments to refresh the table
      fetchAppointments();
    } else {
      console.error('Failed to add appointment');
    }
  } catch (error) {
    console.error('Error adding appointment:', error);
  }
};

  const handleUserSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        fetchUsers();
        toggleUserModal();
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col sm={2} className="sidebar">
            <div className="sidebar-title">
              <img src={logo} alt="Logo" />
            </div>
            <Nav defaultActiveKey="/dashboard" className="flex-column">
              <Nav.Link href="/" className="sidebar-link">
                <FaTachometerAlt size={24} />{' '}
                <span className="sidebar-text">Dashboard</span>
              </Nav.Link>
              <Nav.Link href="/appointments" className="sidebar-link">
                <FaCalendar size={24} />{' '}
                <span className="sidebar-text">Appointments</span>
              </Nav.Link>
              <Nav.Link href="/users" className="sidebar-link">
                <FaUsers size={24} /> <span className="sidebar-text">Users</span>
              </Nav.Link>
              <Nav.Link href="/reports" className="sidebar-link">
                <FaChartBar size={24} />{' '}
                <span className="sidebar-text">Reports</span>
              </Nav.Link>
              <Nav.Link href="/logout" className="sidebar-link">
                <FaSignOutAlt size={24} />{' '}
                <span className="sidebar-text">Logout</span>
              </Nav.Link>
            </Nav>
          </Col>
          <Col sm={10} className="main-content">
            {window.location.pathname === '/' && (
              <div>
                <h2>Dashboard</h2>
                <Row>
                  {Object.keys(appointmentCounts).map((status) => (
                    <Col sm={3} key={status}>
                      <Card>
                        <Card.Body>
                          <Card.Title>{status}</Card.Title>
                          <Card.Text>{appointmentCounts[status]}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
      

            {window.location.pathname === '/appointments' && (
              <div>
                <h2>Appointments</h2>
                <Button variant="primary" className="add-button" onClick={toggleModal}>
                  Add Appointment
                </Button>
                {appointmentsLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Description</th>
                          <th>Status</th>
                          <th>Phone Number</th>
                          <th>Actions</th> 
                        </tr>
                      </thead>
                      <tbody>
                        {currentAppointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td>{appointment.id}</td>
                            <td>{appointment.title}</td>
                            <td>{appointment.category}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>
                            <td>{appointment.description}</td>
                            <td>{appointment.status}</td>
                            <td>{appointment.phone_number}</td>
                            <td>
        {/* Action buttons */}
        <Button variant="info" size="sm">
          Update
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
          Delete
        </Button>
        <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleReferClick(appointment.id)}
                      >
                        Refer
                      </Button>
      </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination>
                      {/* Pagination controls */}
                    </Pagination>
                  </div>
                )}
              </div>
            )}

            {window.location.pathname === '/users' && (
              <div>
                <h2>Users</h2>
                <Button variant="primary" className="add-button" onClick={toggleUserModal}>
                  Add User
                </Button>
                {usersLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role ID</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role_id}</td>
                            <td>
                              <Button variant="info" size="sm" onClick={() => handleEditUser(user)}>Edit</Button>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={toggleModal}>
  <Modal.Header closeButton>
    <Modal.Title>Add Appointment</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={newAppointment.title}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              title: e.target.value,
            })
          }
        />
      </Form.Group>
      <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="staff appointment">Staff Appointment</option>
          <option value="business appointment">Business Appointment</option>
          <option value="departmental updates">Departmental Updates</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          name="date"
          value={newAppointment.date}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              date: e.target.value,
            })
          }
        />
      </Form.Group>
      <Form.Group controlId="time">
        <Form.Label>Time</Form.Label>
        <Form.Control
          type="time"
          name="time"
          value={newAppointment.time}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              time: e.target.value,
            })
          }
        />
      </Form.Group>
      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={newAppointment.description}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              description: e.target.value,
            })
          }
        />
      </Form.Group>
      <Form.Group controlId="status">
        <Form.Label>Status</Form.Label>
        <Form.Control
          as="select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="rejected">Rejected</option>
          <option value="approved">Approved</option>
          <option value="rescheduled">Rescheduled</option>
          <option value="referred">Referred</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="number"
          name="phone_number"
          value={newAppointment.phone_number}
          onChange={(e) =>
            setNewAppointment({
              ...newAppointment,
              phone_number: e.target.value,
            })
          }
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={toggleModal}>
      Close
    </Button>
    <Button variant="primary" onClick={handleAddAppointment}>
      Save
    </Button>
  </Modal.Footer>
</Modal>
  

      
      <Modal show={showUserModal} onHide={toggleUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleUserInputChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleUserInputChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleUserInputChange}
              />
            </Form.Group>
            <Form.Group controlId="role_id">
              <Form.Label>Role ID</Form.Label>
              <Form.Control
                type="number"
                name="role_id"
                value={newUser.role_id}
                onChange={handleUserInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleUserModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUserSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={editingUser ? editingUser.name : ''}
          onChange={handleEditInputChange}
        />
      </Form.Group>
      <Form.Group controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={editingUser ? editingUser.email : ''}
          onChange={handleEditInputChange}
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={editingUser ? editingUser.password : ''}
          onChange={handleEditInputChange}
        />
      </Form.Group>
      <Form.Group controlId="role_id">
        <Form.Label>Role ID</Form.Label>
        <Form.Control
          type="number"
          name="role_id"
          value={editingUser ? editingUser.role_id : ''}
          onChange={handleEditInputChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleUpdateUser}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showReferModal} onHide={toggleReferModal}>
<Modal.Body>
    <Form>
      <Form.Group controlId="referralNumber">
        <Form.Label>Enter Referral Phone Number:</Form.Label>
        <Form.Control
          type="number"
          name="referralNumber"
          value={referralNumber}
          onChange={(e) => setReferralNumber(e.target.value)}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleReferModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleReferAppointment}>
            Refer
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Admin;
