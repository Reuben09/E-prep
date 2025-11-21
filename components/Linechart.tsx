// // LineChart.jsx (converted from BarChart.jsx)
// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     LineElement,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// // Register chart components
// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// const LineChart = ({ dataPoints }) => {
//     const labels = dataPoints.map((_, index) => `Quiz ${index + 1}`);

//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: 'Score Over Time',
//                 data: dataPoints,
//                 borderColor: '#0099FF',
//                 backgroundColor: '#0099FF',
//                 fill: false,
//                 tension: 0.3, // smooth curve
//                 pointRadius: 5,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: { display: false },
//             title: { display: false },
//         },
//         scales: {
//             x: {
//                 grid: { display: false },
//             },
//             y: {
//                 beginAtZero: true,
//                 grid: { display: false },
//             },
//         },
//     };

//     return (
//         <div className="max-sm:h-[80vh] w-full flex flex-row items-start justify-between px-[30px]">
//             <Line data={data} options={options} />
//         </div>
//     );
// };

// export default LineChart;

// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     LineElement,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

// const LineChart = ({ dataPoints }) => {
//     const labels = dataPoints.map((_, index) => `Quiz ${index + 1}`);

//     const data = {
//         labels,
//         datasets: [
//             {
//                 label: '',
//                 data: dataPoints,
//                 borderColor: '#4AA3FF',
//                 backgroundColor: 'rgba(74, 163, 255, 0.2)',
//                 fill: true,
//                 tension: 0.4, // smooth curve like screenshot
//                 borderWidth: 3,
//                 pointRadius: 5,
//                 pointBackgroundColor: '#4AA3FF',
//                 pointBorderColor: '#ffffff',
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: { legend: { display: false } },
//         scales: {
//             x: {
//                 ticks: { color: '#777' },
//                 grid: { color: '#eee' }, // ✔ grid like screenshot
//             },
//             y: {
//                 beginAtZero: true,
//                 ticks: { color: '#777' },
//                 grid: { color: '#eee' },
//             },
//         },
//     };

//     return (
//         <div
//             className="
//                 w-[95vw] 
//                 lg:w-[50vw] 
//                 h-[350px]
//                 mx-auto
//                 flex items-center justify-center
//             "
//         >
//             <Line data={data} options={options} />
//         </div>
//     );
// };

// export default LineChart;

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ dataPoints }) => {
    // Only show the 5 most recent quizzes
    const recent = dataPoints.slice(-5);

    // Keep correct quiz numbering
    const labels = recent.map((_, index) => `Quiz ${dataPoints.length - recent.length + index + 1}`);

    const data = {
        labels,
        datasets: [
            {
                label: '',
                data: recent,
                borderColor: '#4AA3FF',
                backgroundColor: 'rgba(74, 163, 255, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#4AA3FF',
                pointBorderColor: '#ffffff',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                ticks: { color: '#777' },
                grid: { color: '#eee' },
            },
            y: {
                beginAtZero: true,
                ticks: { color: '#777' },
                grid: { color: '#eee' },
            },
        },
    };

    return (
        <div
            className="
                w-[95vw]
                lg:w-[50vw]
                h-[350px]
                mx-auto
                flex items-center justify-center
            "
        >
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;