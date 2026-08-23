import React from 'react';
import { Download, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

// --- Configuration and Helper Data ---

// Base colors for the design
const ACCENT_COLOR = 'bg-orange-500 text-white';
const PRIMARY_COLOR = 'text-indigo-700';
const CURRENT_DATE_COLOR = 'bg-indigo-700 text-white';

// Placeholder image function (using a reliable placeholder service)
const getAvatarUrl = (name) => {
    // Simple deterministic color scheme based on name initial
    const colors = {
        P: '7c3aed', // purple
        A: '1d4ed8', // blue
        F: '059669', // green
        V: 'dc2626', // red
        default: 'f97316' // orange
    };
    const initial = name.charAt(0).toUpperCase();
    const color = colors[initial] || colors.default;

    return `https://placehold.co/40x40/${color}/ffffff/svg?text=${initial}`;
};

// --- Time Calculation Helpers for Schedule Grid ---
// Schedule starts at 7:00 AM (420 minutes from midnight)
const START_HOUR = 7; // 7:00 AM
const ROW_HEIGHT_PX = 64; // h-16 in Tailwind. Represents 1 hour.

/**
 * Converts "HH:MM" string to minutes from midnight.
 * @param {string} timeStr - Time string (e.g., "17:00").
 */
const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

/**
 * Calculates the top position and height for an appointment card
 * using absolute positioning within the day column.
 * @param {string} startStr - Start time (e.g., "17:00").
 * @param {string} endStr - End time (e.g., "19:00").
 */
const calculateStyle = (startStr, endStr) => {
    const startMin = timeToMinutes(startStr);
    const endMin = timeToMinutes(endStr);
    const scheduleStartMin = START_HOUR * 60; // 420 minutes

    const offsetMin = startMin - scheduleStartMin;
    const durationMin = endMin - startMin;

    // Pixels per minute = ROW_HEIGHT_PX / 60
    const topPx = offsetMin * (ROW_HEIGHT_PX / 60);
    const heightPx = durationMin * (ROW_HEIGHT_PX / 60);

    return {
        top: `${topPx}px`,
        height: `${heightPx}px`,
    };
};

// --- Dummy Data ---

const CALENDAR_DAYS = [
    ['29', '30', '31', '1', '2', '3', '4'],
    ['5', '6', { day: '7', active: true }, '8', '9', '10', '11'],
    ['12', '13', '14', '15', '16', '17', '18'],
    ['19', '20', '21', '22', '23', '24', '25'],
    ['26', '27', '28', '29', '30', '31'],
];

const SCHEDULE_DAYS = [
    { name: 'SEN', date: 14, isToday: false },
    { name: 'SEL', date: 15, isToday: false },
    { name: 'RAB', date: 16, isToday: true }, // Current day in the view
    { name: 'KAM', date: 17, isToday: false },
    { name: 'JUM', date: 18, isToday: false },
    { name: 'SAB', date: 19, isToday: false },
];

const TIME_SLOTS = [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
    '7:00 PM', '8:00 PM', '9:00 PM'
];

const MENTORS_TODAY = [
    { name: 'Prim Adams', role: 'UI/UX Design', time: '18:00 - 20:00', avatar: getAvatarUrl('Prim Adams'), isOnline: true },
    { name: 'Ang Angel', role: 'Web Developer', time: '17:00 - 19:00', avatar: getAvatarUrl('Ang Angel'), isOnline: true },
    { name: 'Farrel', role: 'Web Developer', time: '17:00 - 19:00', avatar: getAvatarUrl('Farrel'), isOnline: true },
    { name: 'Victoria', role: 'UI/UX Design', time: '18:00 - 20:00', avatar: getAvatarUrl('Victoria'), isOnline: true },
];

const APPOINTMENTS = [
    // Senin 14
    { dayIndex: 0, start: '17:00', end: '19:00', mentor: 'Ang Angel', role: 'Web Developer', isPrimary: true },
    { dayIndex: 0, start: '18:00', end: '20:00', mentor: 'Prim Adams', role: 'UI/UX Design', isPrimary: false },
    // Selasa 15
    { dayIndex: 1, start: '18:00', end: '20:00', mentor: 'Farrel', role: 'Web Developer', isPrimary: false },
    // Rabu 16
    { dayIndex: 2, start: '17:00', end: '19:00', mentor: 'Prim Adams', role: 'UI/UX Design', isPrimary: false },
    { dayIndex: 2, start: '19:00', end: '21:00', mentor: 'Farrel', role: 'Web Developer', isPrimary: false },
    // Kamis 17
    { dayIndex: 3, start: '18:00', end: '20:00', mentor: 'Ang Angel', role: 'Web Developer', isPrimary: true },
    // Jumat 18
    { dayIndex: 4, start: '17:00', end: '19:00', mentor: 'Prim Adams', role: 'UI/UX Design', isPrimary: true },
    { dayIndex: 4, start: '18:00', end: '20:00', mentor: 'Ang Angel', role: 'Web Developer', isPrimary: false },
    { dayIndex: 4, start: '20:00', end: '21:00', mentor: 'Prim Adams', role: 'UI/UX Design', isPrimary: true },
    // Sabtu 19
    { dayIndex: 5, start: '17:00', end: '19:00', mentor: 'Prim Adams', role: 'UI/UX Design', isPrimary: true },
    { dayIndex: 5, start: '18:00', end: '20:00', mentor: 'Ang Angel', role: 'Web Developer', isPrimary: false },
];

// Current time marker for the schedule (19:33)
const CURRENT_TIME_STR = "19:33";

// Calculate the vertical position of the 19:33 line
const calculateCurrentTimeLineTop = () => {
    const startMin = timeToMinutes(CURRENT_TIME_STR);
    const scheduleStartMin = START_HOUR * 60; // 420 minutes (7:00 AM)
    const offsetMin = startMin - scheduleStartMin;
    const topPx = offsetMin * (ROW_HEIGHT_PX / 60);
    return `${topPx}px`;
}


// --- Component Functions ---

/**
 * Calendar component for the sidebar.
 */
const MiniCalendar = () => (
    <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-800">Oktober 2025</h3>
            <div className="flex space-x-2 text-gray-500">
                <ChevronLeft className="w-5 h-5 cursor-pointer" />
                <ChevronRight className="w-5 h-5 cursor-pointer" />
            </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs text-center">
            {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => (
                <span key={day} className="font-medium text-gray-500">{day}</span>
            ))}
            {CALENDAR_DAYS.flat().map((item, index) => {
                const day = typeof item === 'object' ? item.day : item;
                const isActive = typeof item === 'object' && item.active;
                const isCurrentMonth = index > 2 && index < 30; // Rough heuristic for styling current month dates
                const isSelected = day === '6'; // Highlighted date '6' from the screenshot

                let dayClasses = 'p-1 rounded-md cursor-pointer transition-colors';

                if (!isCurrentMonth) {
                    dayClasses += ' text-gray-400';
                }

                if (isSelected) {
                    dayClasses += ` ${ACCENT_COLOR} font-bold`;
                } else if (isActive) {
                    dayClasses += ` ${CURRENT_DATE_COLOR} font-bold`;
                } else if (isCurrentMonth) {
                    dayClasses += ' text-gray-700 hover:bg-gray-100';
                }

                return (
                    <div key={index} className={dayClasses}>
                        {day}
                    </div>
                );
            })}
        </div>
    </div>
);

/**
 * Single mentor item for the today's list.
 */
const MentorListItem = ({ name, role, time, avatar }) => (
    <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center space-x-3">
            <div className="relative">
                <img
                    src={avatar}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = getAvatarUrl(name); }}
                />
                {/* Placeholder for online status dot */}
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
                <p className={`font-semibold text-sm ${PRIMARY_COLOR}`}>{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
            </div>
        </div>
        <div className="flex items-center space-x-1 text-gray-500 text-xs">
            <time className="font-medium">{time}</time>
            <ChevronRight className="w-3 h-3" />
        </div>
    </div>
);

/**
 * Sidebar component combining the calendar and mentor list.
 */
const Sidebar = () => (
    <div className="w-full lg:w-96 bg-white rounded-lg shadow-xl p-0 h-full overflow-hidden">
        <MiniCalendar />
        <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Daftar Pementor Hari Ini</h3>
            <div className="space-y-1 divide-y divide-gray-100">
                {MENTORS_TODAY.map((mentor, index) => (
                    <MentorListItem key={index} {...mentor} />
                ))}
            </div>
            <button className={`w-full mt-6 py-3 font-poppins rounded-[30px] shadow-lg transition-transform hover:scale-[1.01] ${ACCENT_COLOR} text-lg`}>
                Seluruhnya
            </button>
        </div>
    </div>
);

/**
 * Single appointment card within the schedule grid.
 */
const AppointmentCard = ({ mentor, role, start, end, isPrimary }) => {
    const style = calculateStyle(start, end);

    const cardClasses = isPrimary
        ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
        : 'bg-blue-50 text-indigo-700 border-l-4 border-indigo-700';

    return (
        <div
            style={style}
            className={`absolute left-0 w-[95%] p-2 rounded-lg shadow-sm text-xs transition-shadow hover:shadow-md ${cardClasses}`}
        >
            <p className="font-semibold">{mentor}</p>
            <p className="text-gray-500 text-xs mt-0.5">{role}</p>
            <p className="text-gray-500 text-xs mt-1 font-mono">{start.replace(':', '')} - {end.replace(':', '')} AM</p>
        </div>
    );
};

/**
 * Main schedule grid view.
 */
const ScheduleView = () => {
    const currentTimeLineTop = calculateCurrentTimeLineTop();

    return (
        <div className="flex-1 bg-white p-4 lg:p-6 rounded-lg shadow-xl overflow-x-auto min-w-[700px]">
            {/* Schedule Header */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center space-x-4">
                    <h2 className="font-semibold text-xl text-gray-800">Oktober 2025</h2>
                    <div className={`px-3 py-1 text-sm font-poppins rounded-full text-secondary outline `}>Hari Ini</div>
                    <div className="flex space-x-2 text-gray-500">
                        <ChevronLeft className="w-5 h-5 cursor-pointer" />
                        <ChevronRight className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
                <div className="text-gray-500 text-sm font-medium">GMT+7</div>
            </div>

            {/* Schedule Grid Container */}
            <div className="grid grid-cols-[80px_repeat(6,1fr)]">
                {/* Day Headers (Sticky) */}
                <div className="sticky top-[80px] bg-white z-10"></div> {/* Empty corner space */}
                {SCHEDULE_DAYS.map((day, index) => (
                    <div
                        key={index}
                        className={`p-2 text-center font-semibold border-b-2 transition-colors ${day.isToday ? 'border-indigo-700' : 'border-gray-200'
                            }`}
                    >
                        <p className={`text-sm ${day.isToday ? PRIMARY_COLOR : 'text-gray-600'}`}>{day.name}</p>
                        <p className={`text-lg mt-0.5 ${day.isToday ? PRIMARY_COLOR : 'text-gray-800'}`}>{day.date}</p>
                    </div>
                ))}

                {/* Time Axis and Time Slots */}
                <div className="col-span-1 border-r border-gray-200 pt-1">
                    {TIME_SLOTS.map((time, index) => (
                        <div
                            key={index}
                            className={`h-16 flex items-start justify-end pr-2 text-xs text-gray-400 ${index > 0 ? 'border-t border-dashed border-gray-200' : ''}`}
                        >
                            {time.split(':')[0]}:00 AM
                        </div>
                    ))}
                    {/* Label for the last time slot if needed, otherwise it's just the bottom border line */}
                    <div className="h-4"></div>
                </div>

                {/* Day Columns for Appointments (Positioned Relative) */}
                {SCHEDULE_DAYS.map((day, dayIndex) => (
                    <div key={dayIndex} className="relative border-r border-gray-100 last:border-r-0">
                        {/* Hour Block Markers (Grid Lines) */}
                        {TIME_SLOTS.map((_, slotIndex) => (
                            <div key={slotIndex} className="h-16 border-t border-dashed border-gray-100"></div>
                        ))}

                        {/* Appointment Cards for this Day */}
                        {APPOINTMENTS.filter(a => a.dayIndex === dayIndex).map((appt, apptIndex) => (
                            <AppointmentCard
                                key={apptIndex}
                                mentor={appt.mentor}
                                role={appt.role}
                                start={appt.start}
                                end={appt.end}
                                isPrimary={appt.isPrimary}
                            />
                        ))}

                        {/* Current Time Indicator (Only on the current day) */}
                        {day.isToday && (
                            <>
                                {/* Line */}
                                <div
                                    className="absolute left-0 right-0 h-0.5 bg-red-500 z-20 transition-all duration-300"
                                    style={{ top: currentTimeLineTop }}
                                ></div>
                                {/* Time Label (19:33) */}
                                <div
                                    className="absolute -left-16 text-xs font-mono text-red-500 px-1 bg-white rounded"
                                    style={{ top: `calc(${currentTimeLineTop} - 10px)` }}
                                >
                                    {CURRENT_TIME_STR}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


/**
 * Main application component.
 */
export default function App() {
    return (
        <div className="min-h-screen">
            {/* Global Header */}
            <header className="flex justify-end p-4 border-b border-gray-200">
                <button className="flex items-center space-x-2 px-4 py-2 font-poppins text-base bg-primary rounded-lg hover:bg-secondary text transition-colors shadow-sm">
                    <Download className="w-4 h-4 text-base" />
                    <span >Download Data</span>
                </button>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
                {/* Left Sidebar */}
                <Sidebar />

                {/* Right Schedule View */}
                <ScheduleView />
            </div>
        </div>
    );
}