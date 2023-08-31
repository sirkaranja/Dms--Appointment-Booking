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
  const [appointmentCounts, setAppointmentCounts] = useState({
    Approved: 0,
    Rejected: 0,
    Rescheduled: 0,
    Referred: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 0,
  });

  useEffect(() => {
    // Fetch appointments
    async function fetchAppointments() {
      try {
        const response = await fetch('http://127.0.0.1:5000/appointments');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAppointments(data);
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

    // Fetch users
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

    // Fetch appointment counts
    const counts = {
      Approved: 0,
      Rejected: 0,
      Rescheduled: 0,
      Referred: 0,
    };

    appointments.forEach((appointment) => {
      if (appointment.status in counts) {
        counts[appointment.status]++;
      }
    });

    setAppointmentCounts(counts);

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
                <FaTachometerAlt size={24} /> <span className="sidebar-text">Dashboard</span>
              </Nav.Link>
              <Nav.Link href="/appointments" className="sidebar-link">
                <FaCalendar size={24} /> <span className="sidebar-text">Appointments</span>
              </Nav.Link>
              <Nav.Link href="/users" className="sidebar-link">
                <FaUsers size={24} /> <span className="sidebar-text">Users</span>
              </Nav.Link>
              <Nav.Link href="/reports" className="sidebar-link">
                <FaChartBar size={24} /> <span className="sidebar-text">Reports</span>
              </Nav.Link>
              <Nav.Link href="/logout" className="sidebar-link">
                <FaSignOutAlt size={24} /> <span className="sidebar-text">Logout</span>
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
                              <Button variant="info" size="sm">Edit</Button>
                              <Button variant="danger" size="sm">Delete</Button>
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
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" />
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="number" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
          <Button variant="primary">
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
    </div>
  );
};

export default Admin;
