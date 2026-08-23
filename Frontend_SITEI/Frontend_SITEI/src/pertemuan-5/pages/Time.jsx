import React, { useState, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react'; // Added ChevronUp and ChevronDown

// Main TimePicker Component
const TimePicker = ({ onTimeSelect, onClose }) => {
    // Initialize time state with the current time
    const now = new Date();
    const initialHour24 = now.getHours();

    const initialPeriod = initialHour24 >= 12 ? 'PM' : 'AM';
    // Convert 24h to 12h format (0 becomes 12 AM, 13 becomes 1 PM, etc.)
    const initialHour12 = initialHour24 % 12 === 0
        ? (initialHour24 === 0 ? 12 : 12)
        : initialHour24 % 12;

    const [hour, setHour] = useState(initialHour12);
    const [minute, setMinute] = useState(now.getMinutes());
    const [period, setPeriod] = useState(initialPeriod);

    // State to track which segment is active (for the orange highlight)
    const [activeSegment, setActiveSegment] = useState('hour'); // 'hour' or 'minute'

    // Function to handle the 'OK' action and format the final time
    const handleOk = () => {
        // Convert 12h back to 24h format
        let hour24 = hour;

        if (period === 'PM' && hour !== 12) {
            hour24 += 12;
        } else if (period === 'AM' && hour === 12) {
            // Midnight (12 AM) is 00
            hour24 = 0;
        }

        // Format the time as HH:MM string (e.g., '20:00' or '08:05')
        const formattedTime = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

        // Call the parent handler with the selected time
        onTimeSelect(formattedTime);
    };

    // Function to handle time increment
    const handleTimeIncrement = (segment) => {
        if (segment === 'hour') {
            let newHour = hour + 1;
            if (newHour > 12) newHour = 1; // Wrap from 12 to 1
            setHour(newHour);
            setActiveSegment('hour');
        } else if (segment === 'minute') {
            let newMinute = minute + 1;
            if (newMinute > 59) newMinute = 0; // Wrap from 59 to 0
            setMinute(newMinute);
            setActiveSegment('minute');
        }
    };

    // Function to handle time decrement
    const handleTimeDecrement = (segment) => {
        if (segment === 'hour') {
            let newHour = hour - 1;
            if (newHour < 1) newHour = 12; // Wrap from 1 to 12
            setHour(newHour);
            setActiveSegment('hour');
        } else if (segment === 'minute') {
            let newMinute = minute - 1;
            if (newMinute < 0) newMinute = 59; // Wrap from 0 to 59
            setMinute(newMinute);
            setActiveSegment('minute');
        }
    };

    // Helper function to format numbers with leading zero
    const formatTimeValue = (value) => String(value).padStart(2, '0');

    // Custom styled div for the main time segment - UPDATED to include arrows
    const TimeSegment = ({ value, label, isActive, onIncrement, onDecrement, onFocus }) => (
        <div className="flex flex-col items-center">
            {/* Up Arrow Button */}
            <button
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors mb-1"
                onClick={onIncrement}
                aria-label={`Increment ${label}`}
            >
                <ChevronUp size={20} />
            </button>

            {/* Value Display Area */}
            <div
                className={`flex flex-col items-center cursor-pointer transition-colors duration-200 p-2 rounded-xl h-24 sm:h-28 w-24 sm:w-28 ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                onClick={onFocus} // Click to activate the highlight without changing the value
            >
                <span className={`text-6xl sm:text-7xl font-light tabular-nums leading-none mt-2 transition-all duration-300`}>
                    {formatTimeValue(value)}
                </span>
                <span className="text-xs mt-1 text-gray-500 font-medium tracking-wide">
                    {label}
                </span>
            </div>

            {/* Down Arrow Button */}
            <button
                className="p-1 rounded-full text-gray-500 hover:bg-gray-200 active:bg-gray-300 transition-colors mt-1"
                onClick={onDecrement}
                aria-label={`Decrement ${label}`}
            >
                <ChevronDown size={20} />
            </button>
        </div>
    );

    // Custom styled button for AM/PM toggle (No change needed here)
    const PeriodButton = ({ label, isSelected, onClick }) => (
        <button
            className={`w-full py-2.5 sm:py-3 text-sm font-semibold rounded-lg transition-colors duration-150 ${isSelected ? 'bg-white text-orange-600 shadow-md ring-1 ring-orange-400' : 'text-gray-500 hover:bg-gray-200'}`}
            onClick={onClick}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center p-4 z-50">
            {/* Modal Container */}
            <div
                className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm sm:max-w-md transition-all transform scale-100"
                style={{ fontFamily: 'Inter, sans-serif' }}
            >
                {/* Header */}
                <h3 className="text-lg font-semibold text-gray-700 mb-6">
                    Enter time
                </h3>

                {/* Time Input Group */}
                <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6">

                    {/* Hour Segment - Updated props */}
                    <TimeSegment
                        value={hour}
                        label="Hour"
                        isActive={activeSegment === 'hour'}
                        onIncrement={() => handleTimeIncrement('hour')}
                        onDecrement={() => handleTimeDecrement('hour')}
                        onFocus={() => setActiveSegment('hour')}
                    />

                    {/* Colon Separator - Adjusted vertical alignment */}
                    <span className="text-6xl sm:text-7xl font-light text-gray-500 pt-8">:</span>

                    {/* Minute Segment - Updated props */}
                    <TimeSegment
                        value={minute}
                        label="Minute"
                        isActive={activeSegment === 'minute'}
                        onIncrement={() => handleTimeIncrement('minute')}
                        onDecrement={() => handleTimeDecrement('minute')}
                        onFocus={() => setActiveSegment('minute')}
                    />

                    {/* AM/PM Selector - Adjusted vertical alignment */}
                    <div className="flex flex-col space-y-2 bg-gray-100 p-1.5 rounded-xl self-start h-24 sm:h-28 ml-2 justify-center mt-[44px] sm:mt-[48px]">
                        <PeriodButton
                            label="AM"
                            isSelected={period === 'AM'}
                            onClick={() => { setPeriod('AM'); setActiveSegment(''); }}
                        />
                        <PeriodButton
                            label="PM"
                            isSelected={period === 'PM'}
                            onClick={() => { setPeriod('PM'); setActiveSegment(''); }}
                        />
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between pt-4">

                    {/* Clock Icon Placeholder */}
                    <div className="p-2 rounded-full text-gray-500">
                        <Clock size={24} />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-6">
                        <button
                            className="text-orange-600 font-bold px-4 py-2 uppercase hover:bg-orange-50 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="text-orange-600 font-bold px-4 py-2 uppercase hover:bg-orange-50 rounded-lg transition-colors"
                            onClick={handleOk}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Application Wrapper to demonstrate the TimePicker
const App = () => {
    const [isPickerOpen, setIsPickerOpen] = useState(true);
    const [selectedTime, setSelectedTime] = useState('—');

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        setIsPickerOpen(false);
    };

    const handleClose = () => {
        setIsPickerOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-8 text-gray-800">Dynamic Time Picker Demo</h1>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <p className="text-lg mb-4 text-gray-600">Selected Time:</p>
                <p className="text-4xl font-extrabold text-orange-600 mb-8">{selectedTime}</p>

                <button
                    className="bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:bg-orange-700 transition-colors"
                    onClick={() => setIsPickerOpen(true)}
                >
                    Open Time Picker
                </button>
            </div>

            {isPickerOpen && (
                <TimePicker
                    onTimeSelect={handleTimeSelect}
                    onClose={handleClose}
                />
            )}
        </div>
    );
};

export default TimePicker;