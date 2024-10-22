import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@mui/material';
import { Col } from 'react-bootstrap';

const BookingDate = () => {
    const [selectedRange, setSelectedRange] = useState([new Date(), new Date()]);
    const [timeSlot, setTimeSlot] = useState(null);

    // Handle date range change
    const handleDateChange = (range) => {
        setSelectedRange(range); // range is an array with [startDate, endDate]
    };

    // Handle time slot selection
    const handleTimeSlotSelection = (slot) => {
        setTimeSlot(slot);
    };

    const timeSlots = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ];
    
    return (
        <div>
            <h2 className="text-center">Chọn lịch</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Calendar
                    onChange={handleDateChange}
                    selectRange={true} // Enable range selection
                    value={selectedRange}
                    showDoubleView={true} // Display two months side by side
                    className="custom-calendar" // Added custom class for styling
                    calendarType='iso8601'
                    style={{ width: '100%', height: '500px' }} // Điều chỉnh kích thước trực tiếp

                />
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3>Available Time Slots for Selected Days</h3>
                <Col md={6}  style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px',margin:"0 auto" }}>
                    {timeSlots.map((slot, index) => (
                        <Button
                            key={index}
                            variant={timeSlot === slot ? 'contained' : 'outlined'}
                            onClick={() => handleTimeSlotSelection(slot)}
                            disabled={index % 3 === 0} // Example of disabling certain slots
                            style={{ margin: '5px' }}
                        >
                            {slot}
                        </Button>
                    ))}
                </Col>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {timeSlot && selectedRange
                    ? (
                        <p>
                            Selected Time Slot: {timeSlot} <br />
                            From: {selectedRange[0].toDateString()} <br />
                            To: {selectedRange[1].toDateString()}
                        </p>
                    ) : <p>Please select a time slot and date range</p>}
            </div>
        </div>
    );
};

export default BookingDate;
