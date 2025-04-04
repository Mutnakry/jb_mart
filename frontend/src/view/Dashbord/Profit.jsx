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

const IncomeChart = () => {
    const [incomeData, setIncomeData] = useState({ categories: [], series: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchIncomeData();
    }, []);

    const fetchIncomeData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/dashbord/profit`);
            const data = response.data;
    
            if (!data || data.length === 0) {
                setError("No data available");
                return;
            }
    
            // Convert "YYYY-MM" to "Khmer Month YYYY"
            const categories = data.map(item => {
                const [year, month] = item.month.split("-"); // Extract year and month
                return `${khmerMonths[month]} ${year}`; // e.g., "មករា 2025"
            });
    
            const incomeSeries = data.map(item => item.profit || 0); // Fix key name
    
            setIncomeData({
                categories,
                series: [{ name: "ចំណេញ", data: incomeSeries }],
            });
        } catch (error) {
            setError("Error fetching income data");
            console.error(error);
        }
    };
    

    if (error) return <div>{error}</div>;
    if (incomeData.categories.length === 0) return <div>Loading...</div>;

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <ReactApexChart
                options={{
                    chart: { type: "area", height: 200, zoom: { enabled: false } },
                    colors: ["#4d4dff"], // Main color (blue-violet)
                    dataLabels: { enabled: false },
                    stroke: { curve: "smooth", colors: ["#4d4dff"], width: 3 }, // Blue stroke
                    title: { text: "ចំណេញ (Profit)", align: "left" },
                    xaxis: {
                        categories: incomeData.categories, // Khmer month names
                        type: "category",
                    },
                    yaxis: { opposite: false },
                    legend: { horizontalAlign: "left" },
                    fill: {
                        type: "gradient",
                        gradient: {
                            shadeIntensity: 1,
                            opacityFrom: 0.7,
                            opacityTo: 0.3,
                            colorStops: [
                                { offset: 0, color: "#4d4dff", opacity: 1 },  // Strong blue
                                { offset: 100, color: "#4d4dff", opacity: 0.3 } // Faded blue
                            ]
                        }
                    }
                }}
                series={incomeData.series}
                type="area"
                height={200}
            />
        </div>
    );
};

export default IncomeChart;
