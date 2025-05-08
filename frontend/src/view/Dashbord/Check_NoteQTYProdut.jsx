


// import React, { useEffect, useState } from "react";
// import ReactApexChart from "react-apexcharts";
// import axios from "axios";
// import { API_URL } from "../../service/api";

// const StockChart = () => {
//     const [chartData, setChartData] = useState({
//         series: [],
//         options: {
//             chart: { type: "line", height: 350, toolbar: { show: false } },
//             stroke: { curve: "smooth", width: [3, 3, 3], dashArray: [0, 0, 5] },
//             markers: { size: 4, colors: ["#FF2929", "#FF4560", "#00E396"], strokeWidth: 2 },
//             dataLabels: { enabled: false },
//             xaxis: { categories: [], labels: { rotate: -45 } },
//             yaxis: { title: { text: "ចំនួន ​ផលិតផល" } },
//             legend: { position: "top" },
//             colors: ["#FF2929", "#FF4560", "#00E396"]
//         }
//     });

//     useEffect(() => {
//         const fetchStockData = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/api/dashbord/check_notQTY`);
//                 if (Array.isArray(response.data)) {
//                     const products = response.data.map(
//                         (item) => `${item.pro_names} (${item.unit_names})`
//                     );
//                     const unitNamesArray = response.data.map((item) => item.unit_names);
//                     const stockIn = response.data.map((item) => Number(item.stock_IN) || 0);

//                     setChartData((prev) => ({
//                         ...prev,
//                         series: [
//                             { name: "ចំនួនផលិតផលនៅក្នុងស្តុក", data: stockIn },
//                         ],
//                         options: {
//                             ...prev.options,
//                             xaxis: { categories: products },
//                             tooltip: {
//                                 shared: true,
//                                 intersect: false,
//                                 y: {
//                                     formatter: function (val, { dataPointIndex }) {
//                                         return unitNamesArray[dataPointIndex]
//                                             ? `${val} ${unitNamesArray[dataPointIndex]}`
//                                             : `${val} units`;
//                                     }
//                                 }
//                             }
//                         }
//                     }));
//                 } else {
//                     console.error("Unexpected API response format:", response.data);
//                 }
//             } catch (error) {
//                 console.error("Error fetching stock data:", error);
//             }
//         };
//         fetchStockData();
//     }, []);

//     return (
//         <div className="max-w-screen-2xl w-full mx-auto">
//             <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold mb-4">
//                 ចំនួនផលិតផលដែលលក់គ្រប់គ្រងស្ដុកនៅសល់
//             </h2>
//             <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={350} />
//         </div>
//     );

// };

// export default StockChart;




import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_URL } from "../../service/api";

const StockChart = () => {
    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: { type: "line", height: 350, toolbar: { show: false } },
            stroke: { curve: "smooth", width: [3, 3, 3], dashArray: [0, 0, 5] },
            markers: { size: 4, colors: ["#FF2929", "#FF4560", "#00E396"], strokeWidth: 2 },
            dataLabels: { enabled: false },
            xaxis: { categories: [], labels: { rotate: -45 } },
            yaxis: { title: { text: "ចំនួន ​ផលិតផល" } },
            legend: { position: "top" },
            colors: ["#FF2929", "#FF4560", "#00E396"],
        },
        unitNames: [],
    });

    const printRef = useRef(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/dashbord/check_notQTY`);
                if (Array.isArray(response.data)) {
                    const products = response.data.map(
                        (item) => `${item.pro_names} (${item.unit_names})`
                    );
                    const unitNamesArray = response.data.map((item) => item.unit_names);
                    const stockIn = response.data.map((item) => Number(item.stock_IN) || 0);

                    setChartData((prev) => ({
                        ...prev,
                        series: [{ name: "ចំនួនផលិតផលនៅក្នុងស្តុក", data: stockIn }],
                        options: {
                            ...prev.options,
                            xaxis: { categories: products },
                            tooltip: {
                                shared: true,
                                intersect: false,
                                y: {
                                    formatter: (val, { dataPointIndex }) => {
                                        return unitNamesArray[dataPointIndex]
                                            ? `${val} ${unitNamesArray[dataPointIndex]}`
                                            : `${val} units`;
                                    },
                                },
                            },
                        },
                        unitNames: unitNamesArray,
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

    

    // Print Chart
    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const win = window.open("", "", "height=700,width=1000");
        win.document.write("<html><head><title>Print</title>");
        win.document.write("<style>body{font-family:Arial;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}</style>");
        win.document.write("</head><body>");
        win.document.write("<h2>ចំនួនផលិតផលដែលនៅសល់ក្នុងស្តុក</h2>");
        win.document.write(printContents);
        win.document.write("</body></html>");
        win.document.close();
        win.print();
    };

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold">
                    ចំនួនផលិតផលដែលលក់គ្រប់គ្រងស្តុកនៅសល់
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        បោះពុម្ព
                    </button>
                </div>
            </div>

            <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
            />

            {/* Printable Table */}
            <div ref={printRef} className="hidden print:block mt-6">
                <table>
                    <thead>
                        <tr>
                            <th>ផលិតផល</th>
                            <th>ចំនួន</th>
                            <th>ឯកតា</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.options.xaxis.categories.map((label, i) => (
                            <tr key={i}>
                                <td>{label}</td>
                                <td>{chartData.series[0]?.data[i]}</td>
                                <td>{chartData.unitNames[i] || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockChart;
