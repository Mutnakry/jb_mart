import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_URL } from "../../service/api";

const TopProductsChart = () => {
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState("all");
    const [selectedLimit, setSelectedLimit] = useState("all");

    const printRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/dashbord/ProductPopular`);

                if (!Array.isArray(data) || data.length === 0) {
                    setError("No data found.");
                    return;
                }

                setOriginalData(data);
                applyFilters(data, selectedUnit, selectedLimit);
            } catch (error) {
                console.error("Error fetching top products:", error);
                setError("មិនអាចទាញយកទិន្នន័យបាន។ សូមព្យាយាមម្ដងទៀត!");
            }
        };

        fetchTopProducts();
    }, []);

    const applyFilters = (data, unit, limit) => {
        let result = [...data];

        if (unit !== "all") {
            result = result.filter(item => item.unit_names === unit);
        }

        if (limit !== "all") {
            result = result.slice(0, parseInt(limit, 10));
        }

        setFilteredData(result);
    };

    const handleUnitChange = (e) => {
        const value = e.target.value;
        setSelectedUnit(value);
        applyFilters(originalData, value, selectedLimit);
    };

    const handleLimitChange = (e) => {
        const value = e.target.value;
        setSelectedLimit(value);
        applyFilters(originalData, selectedUnit, value);
    };

    const getUniqueUnits = () => {
        const units = originalData.map(item => item.unit_names);
        return [...new Set(units)];
    };

    const chartData = {
        series: [{
            name: 'បរិមាណលក់',
            data: filteredData.map(item => item.total_qty),
        }],
        options: {
            chart: { type: 'bar', height: 350, toolbar: { show: false } },
            plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
            dataLabels: { enabled: false },
            xaxis: {
                categories: filteredData.map(item => `${item.pro_names} (${item.unit_names})`),
                labels: { style: { fontSize: '12px', fontFamily: 'Noto Sans Khmer, sans-serif' } }
            },
            colors: ['#0040ff'],
            tooltip: {
                y: {
                    formatter: (value, { dataPointIndex }) => {
                        const unit = filteredData[dataPointIndex]?.unit_names;
                        return unit ? `${value} ${unit}` : `${value}`;
                    }
                }
            }
        }
    };

    const exportToExcel = () => {
        const worksheetData = filteredData.map(item => ({
            Product: item.pro_names,
            Quantity: item.total_qty,
            Unit: item.unit_names
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Top Products");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "TopProducts_Filtered.xlsx");
    };

    const handlePrint = () => {
        const win = window.open('', '', 'height=800,width=1000');
        win.document.write('<html><head><title>Print</title>');
        win.document.write('<style>');
        win.document.write(`
            body { font-family: 'Noto Sans Khmer', sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #f0f0f0; }
            h2 { margin-bottom: 12px; }
        `);
        win.document.write('</style></head><body>');
        win.document.write('<h2>ផលិតផលលក់ដាច់ជាងគេ</h2>');
        win.document.write('<p>Filter Unit: ' + (selectedUnit === "all" ? "ទាំងអស់" : selectedUnit) + '</p>');
        win.document.write('<p>Filter Limit: ' + (selectedLimit === "all" ? "ទាំងអស់" : selectedLimit) + '</p>');

        win.document.write('<table><thead><tr><th>ផលិតផល</th><th>បរិមាណ</th><th>ឯកតា</th></tr></thead><tbody>');

        filteredData.forEach(item => {
            win.document.write(`<tr><td>${item.pro_names}</td><td>${item.total_qty}</td><td>${item.unit_names}</td></tr>`);
        });

        win.document.write('</tbody></table>');
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    };

    return (
        <div className="max-w-screen-2xl w-full mx-auto">
            <h2 className="md:text-2xl text-sm text-gray-600 font-NotoSansKhmer font-bold mb-4">ផលិតផលលក់ដាច់ជាងគេ</h2>

            <div className="flex flex-col sm:flex-row gap-2 mb-4 items-center">
                {/* Filter by Unit */}
                <select
                    value={selectedUnit}
                    onChange={handleUnitChange}
                    className="border border-gray-300 rounded px-4 py-2 text-sm"
                >
                    <option value="all">-- ជ្រើសរើសឯកតា --</option>
                    {getUniqueUnits().map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                    ))}
                </select>

                {/* Filter by Limit */}
                <select
                    value={selectedLimit}
                    onChange={handleLimitChange}
                    className="border border-gray-300 rounded px-4 py-2 text-sm"
                >
                    <option value="5">Top 5</option>
                    <option value="10">Top 10</option>
                    <option value="25">Top 25</option>
                    <option value="50">Top 50</option>
                    <option value="100">Top 100</option>
                    <option value="all">ទាំងអស់</option>
                </select>

                <div className="flex gap-2">
                    <button
                        onClick={exportToExcel}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        បញ្ជូនទៅ Excel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        បោះពុម្ព
                    </button>
                </div>
            </div>

            {/* Chart or Error */}
            <div ref={printRef}>
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="bar"
                        height={350}
                    />
                )}
            </div>
        </div>
    );
};

export default TopProductsChart;
