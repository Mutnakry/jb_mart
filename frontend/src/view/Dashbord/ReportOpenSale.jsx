import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { API_URL } from "../../service/api";

const ApexChart = () => {
    const [chartData, setChartData] = useState({
        series: [{ data: [] }],
        options: {
            chart: {
                type: 'bar',
                height: 430
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: { position: 'top' }
                }
            },
            dataLabels: {
                enabled: true,
                offsetX: -6,
                style: { fontSize: '12px', colors: ['#fff'] }
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['#fff']
            },
            tooltip: { shared: true, intersect: false },
            xaxis: { categories: [] }
        }
    });

    useEffect(() => {
        const fetchReportOpenSale = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/dashbord/Reportopensale`);
                console.log("API Response:", response.data);

                if (Array.isArray(response.data)) {
                    const categories = response.data.map(item => item.opening_date);
                    const openingBalanceData = response.data.map(item => item.opening_balance);
                    const closingBalanceData = response.data.map(item => item.closing_balance);

                    setChartData(prevState => ({
                        ...prevState,
                        series: [
                            { name: 'សមតុល្យបើកការលក់', data: openingBalanceData },
                            { name: 'សមតុល្យបិទការលក់', data: closingBalanceData }
                        ],
                        options: {
                            ...prevState.options,
                            colors: ['#FF0000', '#008000'],
                            xaxis: { categories },
                            tooltip: {
                                y: {
                                    formatter: (val) => `$${val.toLocaleString()}` // Format values as currency
                                }
                            }
                        }
                    }));
                } else {
                    console.error("Unexpected API response format:", response.data);
                }
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };

        fetchReportOpenSale();
    }, []);


    return (
        <div className="max-w-screen-2xl w-full mx-auto px-6">
            <h2 className="text-2xl text-gray-600 font-NotoSansKhmer font-bold mb-4">ក្រាប់បង្ហាញបើកនិងបិទការលក់</h2>

            <div id="chart">
                <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={430} />
            </div>
        </div>
    );
};

export default ApexChart;

