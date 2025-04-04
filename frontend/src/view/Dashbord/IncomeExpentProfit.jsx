import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { API_URL } from "../../service/api";

const IncomeExpentProfit = () => {
    const [chartData, setChartData] = useState({ categories: [], series: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchIncomeData();
    }, []);

    const fetchIncomeData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/dashbord/profit`);
            const data = response.data;

            // Extract fields from API response
            const categories = data.map(item => item.month); // X-axis: Months (YYYY-MM)
            const incomeSeries = data.map(item => item.total_income); // Y-axis: Income
            const expenseSeries = data.map(item => item.total_expent); // Y-axis: Expense
            const profitSeries = data.map(item => item.profit); // Y-axis: Profit

            setChartData({
                categories,
                series: [
                    { name: "Income", data: incomeSeries, color: "#00FF00" },  // Green for Income
                    { name: "Expense", data: expenseSeries, color: "#FF0000" }, // Red for Expense
                    { name: "Profit", data: profitSeries, color: "#4D4DFF" }   // Blue-Violet for Profit
                ],
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
                    chart: { type: "area", height: 450, stacked: false },
                    colors: ["#00FF00", "#FF0000", "#4D4DFF"], // Green, Red, Blue-Violet
                    dataLabels: { enabled: false },
                    stroke: { curve: "smooth", width: 2 },
                    xaxis: {
                        categories: chartData.categories,  // Using the months as categories
                        type: "category",  // Set type to 'category' for month-based x-axis
                    },
                    yaxis: { opposite: false },
                    legend: { position: "top", horizontalAlign: "left" },
                    fill: { 
                        type: "gradient", 
                        gradient: { opacityFrom: 0.6, opacityTo: 0.3 } 
                    }
                }}
                series={chartData.series}
                type="area"
                height={450}
            />
        </div>
    );
};

export default IncomeExpentProfit;
