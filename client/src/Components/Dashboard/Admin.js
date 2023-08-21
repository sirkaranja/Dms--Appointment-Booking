import React, { useState, useEffect } from 'react';
import { Card, Table, Pagination, Container, Row, Col, Nav } from 'react-bootstrap';
import './style.css';

const ITEMS_PER_PAGE = 8;

const Admin = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalOrganizers, setTotalOrganizers] = useState(0);

  useEffect(() => {
    async function fetchOrganizers() {
      try {
        const response = await fetch('http://127.0.0.1:5000/organizers');
        const data = await response.json();

        // Assuming the API response has an 'organizers' property
        if (Array.isArray(data.organizers)) {
          setOrganizers(data.organizers);
        } else {
          console.error('Invalid data format:', data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching organizers:', error);
        setLoading(false);
      }
    }

    async function fetchEvents() {
      try {
        const response = await fetch('http://127.0.0.1:5000/events');
        const data = await response.json();

        // Assuming the API response has an 'events' property
        if (Array.isArray(data.events)) {
          setEvents(data.events);
          setCurrentEvents(data.events.slice(0, ITEMS_PER_PAGE)); // Initial events on page 1
        } else {
          console.error('Invalid data format:', data);
        }

        setEventsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEventsLoading(false);
      }
    }

    async function fetchTotalEvents() {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_total_events');
        const data = await response.json();
        setTotalEvents(data.total_events);
      } catch (error) {
        console.error('Error fetching total events:', error);
      }
    }

    async function fetchTotalOrganizers() {
      try {
        const response = await fetch('http://127.0.0.1:5000/total_organizers');
        const data = await response.json();
        setTotalOrganizers(data.total_organizers);
      } catch (error) {
        console.error('Error fetching total organizers:', error);
      }
    }

    fetchOrganizers();
    fetchEvents();
    fetchTotalEvents();
    fetchTotalOrganizers();
  }, []);

  const filteredOrganizers = organizers.filter((organizer) =>
    organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newStartIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const newEndIndex = newStartIndex + ITEMS_PER_PAGE;
    setCurrentEvents(events.slice(newStartIndex, newEndIndex));
  };

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col sm={2} className="sidebar">
            <div className="sidebar-title">
            AppointmentEase
            </div>
            <Nav defaultActiveKey="/dashboard" className="flex-column">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/organizers">Appointments</Nav.Link>
              <Nav.Link href="/events">Report</Nav.Link>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav>
          </Col>
          <Col sm={10} className="main-content">
            {window.location.pathname === '/dashboard' && (
              <div>
                <h2>Dashboard</h2>
                <Row>
                  <Col sm={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Total Events</Card.Title>
                        <Card.Text>{totalEvents}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Total Organizers</Card.Title>
                        <Card.Text>{totalOrganizers}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {window.location.pathname === '/organizers' && (
              <div>
                <h2>Organizers</h2>
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <Table striped bordered hover className="organizers-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrganizers
                          .slice(startIndex, endIndex)
                          .map((organizer, index) => (
                            <tr key={index}>
                              <td>{organizer.name}</td>
                              <td>{organizer.email}</td>
                              <td>{organizer.phone_number}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                    <Pagination>
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                      {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </Pagination>
                  </div>
                )}
              </div>
            )}

            {window.location.pathname === '/events' && (
              <div>
                <h2>Events</h2>
                {eventsLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Location</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th>Organizer ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEvents.map((event) => (
                          <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.title}</td>
                            <td>{event.location}</td>
                            <td>{event.description}</td>
                            <td>{event.event_category}</td>
                            <td>{event.organizer_id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Pagination>
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                      {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={index + 1 === currentPage}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </Pagination>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Admin;
