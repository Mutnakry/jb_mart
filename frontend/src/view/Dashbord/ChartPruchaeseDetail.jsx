import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { API_URL } from "../../service/api";


const ChartPruchaeseDetail = () => {
    const [PruchaeseDetail, setPurchaseDetail] = useState([]);
    const [state, setState] = useState({
        series: [],
        options: {
            chart: {
                width: 380,
                type: 'pie',
            },
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
        },
    });

    const FectPurchaseDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/dashbord/puchasedetail`);
            console.log(response.data); // Check the structure
            setPurchaseDetail(response.data); // Store the entire response data
        } catch (error) {
            console.error('Error fetching categories data:', error);
        }
    };

    useEffect(() => {
        FectPurchaseDetail();
    }, []);

    const getAggregatedSalesData = (data) => {
        const totals = {
            total_amount: 0,
            total_discount: 0,
            total_pay: 0,
            total_amoun_di: 0,
        };

        data.forEach(item => {
            totals.total_amount += parseFloat(item.amount_total);
            totals.total_discount += parseFloat(item.amount_discount);
            totals.total_pay += parseFloat(item.amount_pay);
            totals.total_amoun_di += parseFloat(item.amoun_di); // Amount difference
        });

        return [
            { product: 'ទឹកប្រាក់ចំណាយទិញផលិតផលសរុប $', total: totals.total_amount },
            { product: 'សរុបទឹកប្រាក់បញ្ចុំតម្លៃសរុប​ $', total: totals.total_discount },
            { product: 'ចំនួនទឹកបប្រាក់ដែលបានបង់រួចសរុប $', total: totals.total_pay },
            { product: 'ទឹកប្រាក់ចំនួនសរុបដែលនៅជុំពាក់សរុប $', total: totals.total_amoun_di },
        ];
    };

    const salesData = PruchaeseDetail.length > 0 ? getAggregatedSalesData(PruchaeseDetail) : [];

    console.log(salesData); // Ensure the data is populated

    useEffect(() => {
        if (salesData.length > 0) {
            const series = salesData.map(item => item.total);
            const labels = salesData.map(item => item.product);
            setState(prevState => ({
                series: series,
                options: {
                    ...prevState.options,
                    labels: labels,
                },
            }));
        }
    }, [PruchaeseDetail]);
    return (
        <div className="max-w-screen-2xl mx-auto ">
            <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold mb-4">ចំណាយទិញផលិតផលសរុប</h2>
            <div id="chart">
                <ReactApexChart options={state.options} series={state.series} type="pie" width={520} />
            </div>
        </div>
    );
};
export default ChartPruchaeseDetail;
