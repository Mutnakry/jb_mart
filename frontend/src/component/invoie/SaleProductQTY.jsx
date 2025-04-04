


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { API_URL } from '../../service/api';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';
import { FiRefreshCcw } from "react-icons/fi";
import Navbar from '../Navbar';


import { FaFileExcel } from 'react-icons/fa'; // Add this import
import * as XLSX from 'xlsx'; // Add this import

function Supplier() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Suppliers, setSuppliers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("ទាំងអស់");

    useEffect(() => {
        getAllOrder();
        getALLCustomer();
    }, []);

    const getAllOrder = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/invoice/orderQTY`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const getALLCustomer = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product/all`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching customers data', error);
        }
    };

    const [filterDate, setFilterDate] = useState("ទាំងអស់");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const filterByDate = (create_at) => {
        const today = new Date();
        const orderDateObj = new Date(create_at);

        switch (filterDate) {
            case "today":
                return orderDateObj.toDateString() === today.toDateString();
            case "yesterday":
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                return orderDateObj.toDateString() === yesterday.toDateString();
            case "last7days":
                const last7Days = new Date();
                last7Days.setDate(today.getDate() - 7);
                return orderDateObj >= last7Days;
            case "last30days":
                const last30Days = new Date();
                last30Days.setDate(today.getDate() - 30);
                return orderDateObj >= last30Days;
            case "thisMonth":
                return (
                    orderDateObj.getMonth() === today.getMonth() &&
                    orderDateObj.getFullYear() === today.getFullYear()
                );
            case "lastMonth":
                const lastMonth = new Date();
                lastMonth.setMonth(today.getMonth() - 1);
                return (
                    orderDateObj.getMonth() === lastMonth.getMonth() &&
                    orderDateObj.getFullYear() === lastMonth.getFullYear()
                );
            case "last3Months":
                const last3Months = new Date();
                last3Months.setMonth(today.getMonth() - 3);
                return orderDateObj >= last3Months;
            case "thisYear":
                return orderDateObj.getFullYear() === today.getFullYear();
            case "lastYear":
                return orderDateObj.getFullYear() === today.getFullYear() - 1;
            case "custom":
                if (!customStartDate || !customEndDate) return false;
                const start = new Date(customStartDate);
                const end = new Date(customEndDate);
                return orderDateObj >= start && orderDateObj <= end;
            default:
                return true;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesCustomer = selectedCustomer === "ទាំងអស់" || order.product_id == selectedCustomer;
        const matchesDate = filterByDate(order.create_at);

        return matchesCustomer && matchesDate;
    });

    const totalQTY = filteredOrders.reduce(
        (total, order) => total + (Number(order.total_qty) || 0),
        0
    );

    const AmountTotalPrice = filteredOrders.reduce(
        (total, order) => total + (Number(order.price) || 0),
        0
    );
    const AmountTotal = filteredOrders.reduce(
        (total, order) => total + (Number(order.price * order.total_qty) || 0),
        0
    );
    const AmountTotaltotal_discount = filteredOrders.reduce(
        (total, order) => total + (Number(order.total_discount) || 0),
        0
    );

    const ReFrest = () => {
        setFilterDate("");
        setSelectedCustomer("ទាំងអស់")
    }

    
    const handlePrint = () => {
        const printContents = document.getElementById('invoicesale').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };


    const exportToExcel = () => {
        // Define headers for the Excel file
        const headerRow = [
            "លេខរៀង", "ឈ្មោះផលិតផល", "ទិញនៅថ្ងៃទី", "តម្លៃលក់",
            "ចំនួន", "បញ្ចុះតម្លៃ ($)", "សរុបចំនួន", "បន្ងែមដោយ"
        ];

        // Extract data from filteredOrders
        const dataRows = filteredOrders.map((product, index) => {
            return [
                index + 1,
                product.pro_names,
                formatDateToKhmer(new Date(product.create_at)), // Format date
                `${product.price} $`, // Price + Currency
                product.qtytotal_qty,
                `${product.total_discount} $`,
                `${(product.total_qty * product.price).toFixed(2)} $`, // Total
                product.user_at || 'N/A' // Added By
            ];
        });

        // Combine header and data
        const excelData = [headerRow, ...dataRows];

        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Product Report");

        // Write Excel file
        XLSX.writeFile(wb, "Product_Report.xlsx");
    };


    return (

        <div >
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0 px-4 sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">

                    <div className='grid md:grid-cols-3 grid-cols-1 gap-3 border-t-2 border-blue-500 bg-gray-200/50 py-6 px-2'>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">ទំនាក់ទំនង:</label>
                            <select
                                className='input_text w-[370px] block'
                                id="unit_ID"
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                {Suppliers.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.pro_names}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">កាលបរិច្ឆេទ:</label>
                            <select
                                className='input_text w-[370px] font-NotoSansKhmer text-md block'
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                <option value="today">ថ្ងៃនេះ</option>
                                <option value="yesterday">ម្សិលមិញ</option>
                                <option value="last7days">7 ថ្ងៃចុងក្រោយ</option>
                                <option value="last30days">30 ថ្ងៃចុងក្រោយ</option>
                                <option value="thisMonth">ខែនេះ</option>
                                <option value="lastMonth">1 ខែចុងក្រោយ</option>
                                <option value="last3Months">3 ខែចុងក្រោយ</option>
                                <option value="thisYear">ឆ្នាំនេះ</option>
                                <option value="lastYear">ឆ្នាំមុន</option>
                                <option value="custom">ជ្រើសរើសកាលបរិច្ឆេទផ្ទាល់ខ្លួន</option>
                            </select>

                            {filterDate === "custom" && (
                                <div className="flex gap-3">
                                    <input
                                        type="date"
                                        className="input_text"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="input_text"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                    />

                                </div>
                            )}
                        </div>
                        <div>
                            <br />
                            <button onClick={ReFrest} className='bg-blue-500 p-2 rounded-full'>  <FiRefreshCcw className='text-xl text-white' /></button>
                        </div>
                    </div>

                    <div id='invoicesale' className='mt-6'>


                        <div className="flex justify-end my-6 print:hidden space-x-2">
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-1 px-4 py-2 ml-2 font-bold text-white bg-green-500 hover:bg-green-700"
                            >
                                <FaFileExcel /> <span>នាំចេញ Excel</span>
                            </button>
                            <button onClick={handlePrint} className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700" type="button">
                                <IoPrint /> <span>បោះពុម្ភ</span>
                            </button>
                        </div>
                        <div className="relative overflow-x-auto h-screen scrollbar-hidden">
                            <AnimatePresence>
                                <table className="min-w-full table-auto">
                                    <thead className="text-white bg-blue-600/95">
                                        <tr className="text-sm font-bold font-NotoSansKhmer">
                                            <th className="px-4 py-2 ">លេខរៀង</th>
                                            <th className="px-4 py-2 whitespace-nowrap">ឈ្មោះផលិតផល</th>
                                            <th className="px-4 py-2 ">ទិញនៅថ្ងៃទី</th>
                                            <th className="px-4 py-2 ">តម្លៃលក់</th>
                                            <th className="px-4 py-2 ">ចំនួន</th>
                                            <th className="px-4 py-2 ">	បញ្ចុះតម្លៃ ($)</th>
                                            <th className="px-4 py-2 ">សរុបចំនួន</th>
                                            <th className="px-4 py-2 ">បន្ងែមដោយ</th>
                                        </tr>
                                    </thead>
                                    {loading ? (
                                        <p>Loading...</p>
                                    ) : error ? (
                                        <p>{error}</p>
                                    ) : filteredOrders.length === 0 ? (
                                        <p className="px-10 py-4 text-red-500 text-start whitespace-nowrap ">រកមិនឃើញប្រភេទ ?</p>
                                    ) : (
                                        <tbody>
                                            {filteredOrders.map((product, index) => (
                                                <motion.tr
                                                    key={product.id}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={rowAnimation}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110">
                                                    <td className="px-4 py-1 ">{index + 1}</td>
                                                    <td className='whitespace-nowrap'>
                                                        {product.pro_names}
                                                    </td>
                                                    <td className="px-4 py-1 whitespace-nowrap">{formatDateToKhmer(new Date(product.create_at))}</td>
                                                    <td className="px-4 py-1 whitespace-nowrap">{product.price} $</td>
                                                    <td className="px-4 py-1 whitespace-nowrap">{product.total_qty}</td>
                                                    <td className="px-4 py-1 whitespace-nowrap">{product.total_discount} $</td>
                                                    <td className="px-4 py-1 whitespace-nowrap">{product.total_qty * product.price} $</td>
                                                    <td className="px-4 py-1 whitespace-nowrap">{product.user_at}</td>

                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    )}
                                    <tfoot>
                                        <tr className="font-bold h-16 bg-gray-200">
                                            <td colSpan='3' className="text-right px-4 py-2">សរុប:</td>
                                            <td className="px-4 py-2">
                                                {AmountTotalPrice.toFixed(2)} $
                                            </td>
                                            <td className="px-4 py-2">{totalQTY} ផលិតផល</td>
                                            <td className="px-4 py-2">
                                                {(AmountTotaltotal_discount).toFixed(2)} $
                                            </td>
                                            <td colSpan='2' className="px-4 py-2">
                                                {AmountTotal.toFixed(2)} $
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default Supplier;