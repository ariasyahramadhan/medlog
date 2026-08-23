import React, { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarCheck, ChevronDown } from "lucide-react";

// --- Utility Functions ---
const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

// --- Date Picker Component (Full Popup) ---
const DatePickerPopup = ({ onClose, onSelect }) => {
    const TODAY = new Date();
    const initialSelectedDate = new Date();

    const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
    const [currentViewDate, setCurrentViewDate] = useState(initialSelectedDate);
    const [isMonthYearPickerOpen, setIsMonthYearPickerOpen] = useState(false);

    const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const headerDate = useMemo(() => {
        const day = selectedDate.toLocaleString("en-US", { weekday: "short" });
        const month = selectedDate.toLocaleString("en-US", { month: "short" });
        const date = selectedDate.getDate();
        return `${day}, ${month} ${date}`;
    }, [selectedDate]);

    const calendarDays = useMemo(() => {
        const totalDays = getDaysInMonth(currentViewDate);
        const firstDayIndex = getFirstDayOfMonth(currentViewDate);
        const days = [];

        for (let i = 0; i < firstDayIndex; i++) days.push({ day: null, isCurrentMonth: false });

        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), i);
            days.push({ day: i, date, isCurrentMonth: true, isToday: isSameDay(date, TODAY), isSelected: isSameDay(date, selectedDate) });
        }

        while (days.length % 7 !== 0) days.push({ day: null, isCurrentMonth: false });

        return days;
    }, [currentViewDate, selectedDate]);

    const changeMonth = (amount) => {
        setCurrentViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
        setIsMonthYearPickerOpen(false);
    };

    const years = Array.from({ length: 11 }, (_, i) => currentViewDate.getFullYear() - 5 + i);

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full">
                <div className="bg-secondary p-6 text-white">
                    <p className="text-sm opacity-80">Select date</p>
                    <h2 className="text-3xl font-bold">{headerDate}</h2>
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setIsMonthYearPickerOpen((p) => !p)}
                            className="text-sm font-medium text-gray-700 flex items-center p-1 hover:bg-gray-100 rounded-md"
                        >
                            {monthNames[currentViewDate.getMonth()]} {currentViewDate.getFullYear()}
                            <ChevronDown size={16} className="ml-2 text-gray-500" />
                        </button>

                        <div className="flex gap-2">
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
                        </div>
                    </div>

                    {isMonthYearPickerOpen ? (
                        <>
                            <h3 className="font-semibold mb-2">Select Year</h3>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setCurrentViewDate(new Date(year, currentViewDate.getMonth(), 1))}
                                        className={`p-2 rounded-md ${year === currentViewDate.getFullYear() ? "bg-secondary text-white" : "hover:bg-indigo-50"}`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>

                            <h3 className="font-semibold mb-2">Select Month</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {monthNames.map((m, i) => (
                                    <button
                                        key={m}
                                        onClick={() => setCurrentViewDate(new Date(currentViewDate.getFullYear(), i, 1))}
                                        className={`p-2 rounded-md ${i === currentViewDate.getMonth() ? "bg-secondary text-white" : "hover:bg-indigo-50"}`}
                                    >
                                        {m.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
                                {weekdays.map((w) => <div key={w}>{w}</div>)}
                            </div>

                            <div className="grid grid-cols-7 gap-y-1">
                                {calendarDays.map((d, idx) => (
                                    <div key={idx} className="flex justify-center">
                                        {d.day && (
                                            <button
                                                onClick={() => setSelectedDate(d.date)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm
                          ${d.isSelected ? "bg-secondary text-white" : d.isToday ? "border border-secondary text-secondary" : "hover:bg-indigo-50"}`}
                                            >
                                                {d.day}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="p-4 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 hover:bg-gray-100 rounded-lg text-secondary font-semibold">Cancel</button>
                    <button onClick={() => { onSelect(selectedDate); onClose(); }} className="px-4 py-2 hover:bg-gray-100 rounded-lg text-secondary font-semibold">OK</button>
                </div>
            </div>
        </div>
    );
};

// --- EXPORT (ready to be plugged into Catatan component) ---
export default DatePickerPopup;
