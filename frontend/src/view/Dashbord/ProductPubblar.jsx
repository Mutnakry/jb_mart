import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { API_URL } from "../../service/api";

const TopProductsChart = () => {
    const [chartData, setChartData] = useState({
        series: [{ name: 'បរិមាណលក់', data: [] }],
        options: {
            chart: { type: 'bar', height: 350, toolbar: { show: false } },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
            dataLabels: { enabled: false },
            xaxis: { categories: [], labels: { style: { fontSize: '12px', fontFamily: 'Noto Sans Khmer, sans-serif' } } },
            colors: ['#0040ff'],
            // title: { text: 'ផលិតផលលក់ដាច់ជាងគេ', align: 'center', style: { fontSize: '18px', fontFamily: 'Noto Sans Khmer, sans-serif' } },
            tooltip: {
                y: {
                    formatter: (value, { dataPointIndex }) => {
                        const unit = chartData.unitNames[dataPointIndex];
                        if (unit) {
                            return `${value} ${unit}`;
                        }
                        return `${value} `;
                    }
                }
            }
        },
        unitNames: []
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/dashbord/ProductPopular`);

                if (!Array.isArray(data) || data.length === 0) {
                    setError("No data found.");
                    return;
                }

                const categories = data.map(({ pro_names, unit_names }) => `${pro_names} (${unit_names})`);
                const unitNames = data.map(({ unit_names }) => unit_names);
                const quantities = data.map(({ total_qty }) => total_qty);

                setChartData(prev => ({
                    ...prev,
                    series: [{ ...prev.series[0], data: quantities }],
                    options: {
                        ...prev.options,
                        xaxis: { ...prev.options.xaxis, categories }
                    },
                    unitNames
                }));
            } catch (error) {
                console.error("Error fetching top products:", error);
                setError("មិនអាចទាញយកទិន្នន័យបាន។ សូមព្យាយាមម្ដងទៀត!");
            }
        };

        fetchTopProducts();
    }, []);

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold mb-4">ផលិតផលលក់ដាច់ជាងគេ</h2>
            {error ? <p className="text-red-500">{error}</p> : <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />}
        </div>
    );
};

export default TopProductsChart;
