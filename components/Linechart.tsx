// // LineChart.jsx
// import React from 'react';
// import { Bar, Line } from 'react-chartjs-2';
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
//                 fill: false,
//                 borderColor: '#0099FF',
//                 backgroundColor: '#0099FF',
//                 tension: 0.3, // smooth line
//                 pointRadius: 5,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: { display: false },
//             title: { display: false, text: 'User Scores', font: { size: 18 } },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false, // ❌ Remove vertical grid lines
//                 },
//             },
//             y: {
//                 beginAtZero: true,
//                 grid: {
//                     display: false, // ❌ Remove horizontal grid lines
//                 },
//             },
//         },
//     };

//     return (
//         <div className=' w-[55%] flex flex-col items-start justify-start px-[30px]'>
//             {/* <h1 className=' text-[#0099FF] font-semibold text-3xl'>Progress Chart</h1> */}
//             <Line data={data} options={options} />
//         </div>
//     );
// };

// export default LineChart;

// BarChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import InfiniteCarousel from './Carousel';

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const BarChart = ({ dataPoints }) => {
    const labels = dataPoints.map((_, index) => `Quiz ${index + 1}`);

    const data = {
        labels,
        datasets: [
            {
                label: 'Score',
                data: dataPoints,
                backgroundColor: '#0099FF',
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false, text: 'User Scores', font: { size: 18 } },
        },
        scales: {
            x: {
                grid: {
                    display: false, // ❌ remove vertical grid lines
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false, // ❌ remove horizontal grid lines
                },
            },
        },
    };

    return (
        <div className=" max-sm:h-[80vh] lg:w-[40%] flex flex-row items-start justify-between px-[30px]">
            {/* <h1 className='text-[#0099FF] font-semibold text-3xl'>Progress Chart</h1> */}
            <Bar data={data} options={options} />
            
                
            
        </div>
    );
};

export default BarChart;
