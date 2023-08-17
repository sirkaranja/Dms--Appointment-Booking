import React, { useState } from 'react';
import Calendar from 'react-calendar';
import ModalComponent from './ModalComponent';
import './CalendarComponent.css'; // Import the CSS file

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = date => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <div className="CalendarComponent">
      <div className="CalendarContainer">
        <Calendar
          value={selectedDate}
          onClickDay={handleDateClick}
          className="Calendar"
          showNeighboringMonth={false} // Add this prop to show only selected month's days
        />
      </div>
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarComponent;
