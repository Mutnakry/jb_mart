// import React, { useState, useEffect } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";
// import { API_URL } from "../../service/api";

// const ExpenseChart = () => {
//     const [chartData, setChartData] = useState({ categories: [], series: [] });
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchExpenseData();
//     }, []);

//     const fetchExpenseData = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/api/dashbord/income`);
//             const data = response.data;

//             // Extract month and expenses
//             const categories = data.map(item => item.month); // X-axis: Months (YYYY-MM)
//             const expenseSeries = data.map(item => item.total_expent); // Y-axis: Expenses

//             setChartData({
//                 categories,
//                 series: [{ name: "Expense", data: expenseSeries }],
//             });
//         } catch (error) {
//             setError("Error fetching data");
//             console.error(error);
//         }
//     };

//     if (error) return <div>{error}</div>;
//     if (chartData.categories.length === 0) return <div>Loading...</div>;

//     return (
//         <div className="max-w-screen-2xl w-full mx-auto">
//             {/* <h2 className="text-2xl text-gray-600 font-bold mb-4">ចំណាយ (Expense)</h2> */}
//             <ReactApexChart
//                 options={{
//                     chart: { type: "area", height: 50, zoom: { enabled: false } },
//                     colors: ["#00ff00"], // Green color
//                     dataLabels: { enabled: false },
//                     stroke: { curve: "smooth", width: 3 },
//                     title: { text: "ចំណាយ (Expense)", align: "left" },
//                     xaxis: {
//                         categories: chartData.categories,
//                         labels: {
//                             formatter: (value) => value, // Keep YYYY-MM format
//                         },
//                         tickAmount: chartData.categories.length, // Ensures correct spacing
//                     },
//                     yaxis: { opposite: false },
//                     legend: { horizontalAlign: "left" },
//                     fill: {
//                         type: "gradient",
//                         gradient: {
//                             shadeIntensity: 1,
//                             opacityFrom: 0.5,
//                             opacityTo: 1,
//                             colorStops: [
//                                 { offset: 0, color: "#00ff00", opacity: 1 },
//                                 { offset: 100, color: "#4dff4d", opacity: 0.3 }
//                             ]
//                         }
//                     }
//                 }}
//                 series={chartData.series}
//                 type="area"
//                 height={350}
//             />
//         </div>
//     );
// };

// export default ExpenseChart;



import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { API_URL } from "../../service/api";

const khmerMonths = {
    "01": "មករា",
    "02": "កុម្ភៈ",
    "03": "មិនា",
    "04": "មេសា",
    "05": "ឧសភា",
    "06": "មិថុនា",
    "07": "កក្កដា",
    "08": "សីហា",
    "09": "កញ្ញា",
    "10": "តុលា",
    "11": "វិច្ឆិកា",
    "12": "ធ្នូ"
};

const ExpenseChart = () => {
    const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExpenseData();
    }, []);

    const fetchExpenseData = async () => {
        try {
            // const response = await axios.get(`${API_URL}/api/dashbord/income`);
            const response = await axios.get(`${API_URL}/api/dashbord/profit`);
            const data = response.data;
            // Convert months to Khmer format (YYYY-MM -> Khmer)
            const categories = data.map(item => {
                const [year, month] = item.month.split("-");
                return `${khmerMonths[month]} ${year}`; // e.g., "មករា 2025"
            });

            const expenseSeries = data.map(item => item.total_income);

            setChartData({
                categories,
                series: [{ name: "ចំណូល", data: expenseSeries }],
            });
        } catch (error) {
            setError("Error fetching data");
            console.error(error);
        }
    };

    if (error) return <div>{error}</div>;
    if (chartData.categories.length === 0) return <div>Loading...</div>;

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <ReactApexChart
                options={{
                    chart: { type: "area", height: 200, zoom: { enabled: false } },
                    colors: ["#00ff00"], 
                    dataLabels: { enabled: false },
                    stroke: { curve: "smooth", width: 3 },
                    title: { text: "ចំណូល (Income)", align: "left" },
                    xaxis: {
                        categories: chartData.categories,
                        labels: {
                            formatter: (value) => value, // Now in Khmer format
                        },
                        tickAmount: chartData.categories.length,
                    },
                    yaxis: { opposite: false },
                    legend: { horizontalAlign: "left" },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.5,
                            opacityTo: 1,
                            colorStops: [
                                { offset: 0, color: "#00ff00", opacity: 1 },
                                { offset: 100, color: "#4dff4d", opacity: 0.3 }
                            ]
                        }
                    }
                }}
                series={chartData.series}
                type="area"
                height={200}
            />
        </div>
    );
};

export default ExpenseChart;
