// // import React, { useEffect, useState } from 'react';
// // import ReactApexChart from 'react-apexcharts';
// // import axios from 'axios';
// // import { API_URL } from "../../service/api";

// // const SaleProductExchang = () => {
// //   const [purchaseDetail, setPurchaseDetail] = useState({});
// //   const [state, setState] = useState({
// //     series: [],
// //     options: {
// //       chart: {
// //         width: 380,
// //         type: 'polarArea',
// //       },
// //       labels: [],
// //       responsive: [
// //         {
// //           breakpoint: 480,
// //           options: {
// //             chart: {
// //               width: 200,
// //             },
// //             legend: {
// //               position: 'bottom',
// //             },
// //           },
// //         },
// //       ],
// //     },
// //   });

// //   const fetchPurchaseDetail = async () => {
// //     try {
// //       const response = await axios.get(`${API_URL}/api/dashbord/sumtotal_sale`);
// //       console.log(response.data);
// //       setPurchaseDetail(response.data); // Store the entire response data
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchPurchaseDetail();
// //   }, []);

// //   const getAggregatedSalesData = (data) => {
// //     const totals = {
// //       total_amount_usd: parseFloat(data.TotalAmountUSD || 0),
// //       total_amount_khr: parseFloat(data.TotalAmountKHR || 0),
// //       total_amount_thb: parseFloat(data.TotalAmountTHB || 0),
// //     };

// //     return [
// //       { product: 'Total USD', total: totals.total_amount_usd },
// //       { product: 'Total KHR', total: totals.total_amount_khr },
// //       { product: 'Total THB', total: totals.total_amount_thb },
// //     ];
// //   };

// //   const salesData = purchaseDetail ? getAggregatedSalesData(purchaseDetail) : [];

// //   useEffect(() => {
// //     console.log('purchaseDetail:', purchaseDetail);
// //     console.log('salesData:', salesData);

// //     if (salesData.length > 0) {
// //       const series = salesData.map(item => item.total);
// //       const labels = salesData.map(item => item.product);
// //       console.log('series:', series);
// //       console.log('labels:', labels);

// //       setState(prevState => ({
// //         series: series,
// //         options: {
// //           ...prevState.options,
// //           labels: labels,
// //         },
// //       }));
// //     }
// //   }, [purchaseDetail]);

// //   return (
// //     <div className="max-w-screen-2xl mx-auto">
// //       <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold mb-4">Total Sales by Currency for This Year</h2>
// //       <div id="chart">
// //         <ReactApexChart options={state.options} series={state.series} type="polarArea" width={520} />
// //       </div>
// //     </div>
// //   );
// // };

// // export default SaleProductExchang;


import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { API_URL } from "../../service/api";

const ApexChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      { name: "Total USD", data: new Array(12).fill(0) },
      { name: "Total KHR", data: new Array(12).fill(0) },
      { name: "Total THB", data: new Array(12).fill(0) },
    ],
    options: {
      chart: { type: "bar", height: 250 },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      // xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
      xaxis: {
        categories: ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"]
      },
      yaxis: { title: { text: "រៀល (ការលក់សរុប)" } },
      fill: { opacity: 1 },
      tooltip: { y: { formatter: (val) => ` ${val} ` } },
    },
  });

  // Function to fetch data from the API
  const fetchMonthlySales = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dashbord/sumtotal_sale`);
      console.log("API Response:", response.data);

      updateChartData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to process API response and update the chart data
  const updateChartData = (data) => {
    // Create an array with all months set to 0 initially
    const monthsData = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      TotalAmountUSD: 0,
      TotalAmountKHR: 0,
      TotalAmountTHB: 0,
    }));

    // Merge API data with the initialized months
    data.forEach((item) => {
      const monthIndex = item.month - 1; // Convert month number (1-12) to array index (0-11)
      monthsData[monthIndex] = {
        ...monthsData[monthIndex],
        TotalAmountUSD: item.TotalAmountUSD || 0,
        TotalAmountKHR: item.TotalAmountKHR || 0,
        TotalAmountTHB: item.TotalAmountTHB || 0,
      };
    });

    // Extract values for the chart
    const usdData = monthsData.map((item) => item.TotalAmountUSD);
    const khrData = monthsData.map((item) => item.TotalAmountKHR);
    const thbData = monthsData.map((item) => item.TotalAmountTHB);

    setChartData((prevState) => ({
      ...prevState,
      series: [
        { name: "ខែនេះលក់បានសរុប​​ $", data: usdData },
        { name: "ខែនេះលក់បានសរុប​ រៀល ", data: khrData },
        { name: "ខែនេះលក់បានសរុប​ បាត", data: thbData },
      ],
    }));
  };

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  return (
    <div className="max-w-screen-2xl w-full mx-auto">
      <h2 className="text-xl text-gray-600 font-NotoSansKhmer font-bold mb-4">សរុបការលក់ក្នុងឆ្នាំនេះទៅតាមខែ</h2>

      <div id="chart" className="font-NotoSansKhmer font-bold">
        <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={250} />
      </div>
    </div>
  );
};

export default ApexChart;
