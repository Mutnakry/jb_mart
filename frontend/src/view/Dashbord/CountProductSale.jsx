import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { API_URL } from "../../service/api";

const ChartPruchaeseDetail = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: { width: 520, type: 'donut' },
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: { width: 300 },
                        legend: { position: 'bottom' },
                    },
                },
            ],
        },
    });

    useEffect(() => {
        const fetchPurchaseDetail = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/dashbord/countProduct_qty_sale`);

                if (Array.isArray(response.data)) {
                    const salesData = response.data.map(item => ({
                        product: `${item.pro_names} : ${item.unit_names} `,
                        total: Number(item.total_quantity) || 0,
                    }));

                    const series = salesData.map(item => item.total);
                    const labels = salesData.map(item => item.product);

                    setChartData(prev => ({
                        ...prev,
                        series,
                        options: { ...prev.options, labels },
                    }));
                } else {
                    console.error("Unexpected API response format:", response.data);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchPurchaseDetail();
    }, []);

    return (
        <div className="max-w-screen-2xl mx-auto px-6">
            {chartData === 0 ?(
                <h2 className="text-2xl text-gray-600 font-NotoSansKhmer font-bold mb-4">
            លក់ផលិតផលក្នុងថ្ងៃនេះ
            </h2>
            ):null}
            

            <div id="chart">
                {chartData.series.length > 0 ? (
                    <ReactApexChart 
                        options={chartData.options} 
                        series={chartData.series} 
                        type="donut" 
                        width={440} 
                    />
                ) : (
                    <p className='text-red-500 text-xl'>ថ្ងៃនេះលក់មិនទាន់បានផលិតផលទេ</p>
                )}
            </div>
        </div>
    );
};

export default ChartPruchaeseDetail;
