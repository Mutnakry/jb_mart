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
            // const response = await axios.get(`${API_URL}/api/dashbord/expent`);
            const response = await axios.get(`${API_URL}/api/dashbord/profit`);

            const data = response.data;

            // Convert "YYYY-MM" to "Khmer Month YYYY"
            const categories = data.map(item => {
                const [year, month] = item.month.split("-"); // Extract year and month
                return `${khmerMonths[month]} ${year}`; // e.g., "មករា 2025"
            });

            const expenseSeries = data.map(item => item.total_expent);

            setChartData({
                categories,
                series: [{ name: "ចំណាយ", data: expenseSeries }],
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
                    colors: ["#FF0000"], // Red color
                    dataLabels: { enabled: false },
                    stroke: { curve: "smooth", width: 3 },
                    title: { text: "ចំណាយ (Expense)", align: "left" },
                    xaxis: {
                        categories: chartData.categories, // Khmer Month Names
                        labels: {
                            formatter: (value) => value, // Display in Khmer format
                        },
                        tickAmount: chartData.categories.length, // Ensures correct spacing
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
                                { offset: 0, color: "#FF0000", opacity: 1 },
                                { offset: 100, color: "#FF8888", opacity: 0.3 }
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
