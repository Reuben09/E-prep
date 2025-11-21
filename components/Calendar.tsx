import React, { useState } from "react";
import dayjs from "dayjs";

const Calendar = ({ highlightedDates = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    const today = dayjs();

    const monthStart = currentMonth.startOf("month");
    const monthEnd = currentMonth.endOf("month");
    const startWeek = monthStart.startOf("week");
    const endWeek = monthEnd.endOf("week");

    const days = [];
    let date = startWeek;

    while (date.isBefore(endWeek, "day")) {
        days.push(date);
        date = date.add(1, "day");
    }

    const goToPrevMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, "month"));
    };

    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, "month"));
    };

    const isSameDay = (d1, d2) => d1.isSame(d2, "day");
    const isHighlighted = (date) =>
        highlightedDates.some((d) => dayjs(d).isSame(date, "day"));

    return (
        <div className="w-[100%] rounded-2xl bg-white p-5 shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={goToPrevMonth} className="text-xl font-light text-black">
                    ‹
                </button>

                <div className="text-lg font-medium bg-[#1E1E1E] text-white px-4 py-1 rounded-xl">
                    {currentMonth.format("MMMM")}
                </div>

                <button onClick={goToNextMonth} className="text-xl font-light text-black">
                    ›
                </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {days.map((dateObj, index) => {
                    const isCurrentMonth = dateObj.isSame(currentMonth, "month");
                    const isToday = isSameDay(dateObj, today);
                    const highlighted = isHighlighted(dateObj);

                    let style =
                        "w-9 h-9 flex items-center justify-center mx-auto rounded-lg transition";

                    if (!isCurrentMonth) {
                        style += " text-gray-300";
                    } else if (highlighted) {
                        style += " bg-blue-200 text-blue-600 font-medium";
                    } else if (isToday) {
                        style += " bg-black text-white font-medium";
                    } else {
                        style += " text-gray-700";
                    }

                    return (
                        <div key={index} className={style}>
                            {dateObj.date()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Calendar;
