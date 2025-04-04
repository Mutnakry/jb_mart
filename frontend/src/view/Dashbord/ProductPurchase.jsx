

import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { API_URL } from "../../service/api";

const ChartPruchaeseDetail = () => {
    const [purchaseDetail, setPurchaseDetail] = useState([]);
    const [state, setState] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: { show: true },
                zoom: { enabled: true }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: { position: 'bottom', offsetX: -10, offsetY: 0 }
                }
            }],
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                    dataLabels: {
                        total: {
                            enabled: true,
                            style: { fontSize: '13px', fontWeight: 900 }
                        }
                    }
                }
            },
            xaxis: {
                categories: [] // Will be updated dynamically
            },
            legend: { position: 'right', offsetY: 40 },
            fill: {colors: ['#4dff4d'], opacity: 1 }
        }
    });

    const fetchPurchaseDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/dashbord/product`);
            console.log("API Response:", response.data); // Debug API response
            if (Array.isArray(response.data)) {
                setPurchaseDetail(response.data);
            } else {
                console.error("Unexpected API response format:", response.data);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    useEffect(() => {
        fetchPurchaseDetail();
    }, []);

    useEffect(() => {
        if (purchaseDetail.length > 0) {
            console.log("Processing Data:", purchaseDetail); // Debug data before processing

            const labels = purchaseDetail.map(item => item.pro_names);
            const seriesData = purchaseDetail.map(item => Number(item.total_quantity) || 0);

            console.log("Processed Data for Chart:", { labels, seriesData });

            setState(prevState => ({
                ...prevState,
                series: [{ name: "សរុបចំនួនទិញចូលផលិតផល", data: seriesData }],
                options: {
                    ...prevState.options,
                    xaxis: { categories: labels }
                }
            }));
        }
    }, [purchaseDetail]); // Update when data changes

    return (
        <div className="max-w-screen-2xl w-full mx-auto px-6">
            <h2 className="text-2xl text-gray-600 font-NotoSansKhmer font-bold mb-4">
                បញ្ចាទិញផលិតផលក្នុងខែនេះ
            </h2>
            <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
            </div>
        </div>
    );
};

export default ChartPruchaeseDetail;
