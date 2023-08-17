import React, { useState } from 'react';
import Modal from 'react-modal';
import './CalendarComponent.css';

const appointmentTypes = [
  'Departmental Updates',
  'Client Consultation',
  'Business',
  'Staff Appointment',
  'Conflict Resolution',
];

const ModalComponent = ({ isOpen, onClose, selectedDate }) => {
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [description, setDescription] = useState('');
  const [appointmentHour, setAppointmentHour] = useState('');
  const [appointmentMinute, setAppointmentMinute] = useState('');

  const hoursInDay = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return hour;
  });

  const minutesInHour = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return minute;
  });

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) {
      greeting = 'Good morning';
    } else if (hour < 18) {
      greeting = 'Good afternoon';
    } else {
      greeting = 'Good evening';
    }
    return `${greeting}! You are booking an appointment on ${selectedDate.toDateString()}.`;
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Handle the form submission here
    const appointmentDetails = {
      title: appointmentTitle,
      type: appointmentType,
      time: `${appointmentHour}:${appointmentMinute}`,
      description: description,
      date: selectedDate,
    };
    console.log('Appointment Details:', appointmentDetails);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="Modal"
    >
      <h2>Book Appointment</h2>
      <p className="GreetingMessage">{getGreetingMessage()}</p>
      <form onSubmit={handleSubmit}>
        <label>Appointment Title</label>
        <input
          type="text"
          value={appointmentTitle}
          onChange={e => setAppointmentTitle(e.target.value)}
        />

        <label>Appointment Type</label>
        <select
          value={appointmentType}
          onChange={e => setAppointmentType(e.target.value)}
        >
          <option value="" disabled>Select an appointment type</option>
          {appointmentTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <div className="TimeSelection">
          <label>Appointment Time</label>
          <div className="TimeDropdowns">
            <select
              value={appointmentHour}
              onChange={e => setAppointmentHour(e.target.value)}
            >
              <option value="" disabled>Select hour</option>
              {hoursInDay.map(hour => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              value={appointmentMinute}
              onChange={e => setAppointmentMinute(e.target.value)}
            >
              <option value="" disabled>Select minute</option>
              {minutesInHour.map(minute => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label>Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <button type="submit">Book Appointment</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default ModalComponent;
