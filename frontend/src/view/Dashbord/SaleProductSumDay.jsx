import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { API_URL } from "../../service/api";

const MonthlySalesChart = () => {
    const [chartData, setChartData] = useState({
        series: [
            { name: "USD Sales", data: [] },
            { name: "KHR Sales", data: [] },
            { name: "THB Sales", data: [] }
        ],
        options: {
            chart: { type: "line", height: 250 },
            xaxis: { categories: [] },
            colors: ["#f5190a", "#a31aff", "#33ff57"], // Colors for different currencies
        },
    });

    useEffect(() => {
        const fetchMonthlyData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/dashbord/sumtotal_usd_khr_thb`); // Backend API endpoint
                const dailyDataUSD = Array(31).fill(0);  // Create an array for USD
                const dailyDataKHR = Array(31).fill(0);  // Create an array for KHR
                const dailyDataTHB = Array(31).fill(0);  // Create an array for THB

                // Populate daily data from the API response
                response.data.forEach(({ day, TotalAmountUSD, TotalAmountKHR, TotalAmountTHB }) => {
                    dailyDataUSD[day - 1] = TotalAmountUSD;
                    dailyDataKHR[day - 1] = TotalAmountKHR;
                    dailyDataTHB[day - 1] = TotalAmountTHB;
                });

                const categories = Array.from({ length: 31 }, (_, i) => `ទី ${i + 1}`);

                setChartData({
                    series: [
                        { name: "USD Sales", data: dailyDataUSD },
                        { name: "KHR Sales", data: dailyDataKHR },
                        { name: "THB Sales", data: dailyDataTHB }
                    ],
                    options: { ...chartData.options, xaxis: { categories } },
                });
            } catch (error) {
                console.error("Error fetching monthly data:", error);
            }
        };
        
        fetchMonthlyData();
    }, []); // Only run once when the component mounts

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <h2 className="text-xl text-gray-600 font-NotoSansKhmer font-bold mb-4">សរុបការលក់ប្រចាំថ្ងៃក្នុងខែនេះគិតជាលុយសុតដែលទទូលបាន</h2>
            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={250}
            />
        </div>
    );
};

export default MonthlySalesChart;
