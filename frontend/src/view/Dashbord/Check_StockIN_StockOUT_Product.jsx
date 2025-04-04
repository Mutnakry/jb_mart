


import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { API_URL } from "../../service/api";

const StockChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: { type: "line", height: 350, toolbar: { show: false } },
            stroke: { curve: "smooth", width: [3, 3, 3], dashArray: [0, 0, 5] },
            markers: { size: 4, colors: ["#008FFB", "#FF4560", "#00E396"], strokeWidth: 2 },
            dataLabels: { enabled: false },
            xaxis: { categories: [], labels: { rotate: -45 } },
            yaxis: { title: { text: "ចំនួន ​ផលិតផល" } },
            legend: { position: "top" },
            colors: ["#008FFB", "#FF4560", "#00E396"]
        }
    });

    const [unitNames, setUnitNames] = useState([]);
    
    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/dashbord/stock_product`);

                if (Array.isArray(response.data)) {
                    const products = response.data.map(
                        (item) => `${item.pro_names} (${item.unit_names})`
                    );
                    const unitNamesArray = response.data.map((item) => item.unit_names); 
                    const stockIn = response.data.map((item) => Number(item.stock_IN) || 0);
                    const stockOut = response.data.map((item) => Number(item.stock_OUT) || 0);
                    const stockTotal = response.data.map((item) => Number(item.stock_total) || 0);

                    setUnitNames(unitNamesArray); // Update unit names

                    setChartData((prev) => ({
                        ...prev,
                        series: [
                            { name: "ចំនួនផលិតផលនៅក្នុងស្តុក", data: stockIn },
                            { name: "ចំនួនផលិតផលលក់ចេញ", data: stockOut },
                            { name: "ចំនួនផលិតផលសរុបទាំងអស់", data: stockTotal }
                        ],
                        options: {
                            ...prev.options,
                            xaxis: { categories: products },
                            tooltip: {
                                shared: true,
                                intersect: false,
                                y: {
                                    formatter: function (val, { dataPointIndex }) {
                                        return unitNamesArray[dataPointIndex] 
                                            ? `${val} ${unitNamesArray[dataPointIndex]}` 
                                            : `${val} units`;
                                    }
                                }
                            }
                        }
                    }));
                } else {
                    console.error("Unexpected API response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };
        fetchStockData();
    }, []);

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold mb-4">
                ចំនួនផលិតផលសរុប
            </h2>
            <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
        </div>
    );
};

export default StockChart;
