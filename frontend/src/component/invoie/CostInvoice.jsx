


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { API_URL } from '../../service/api';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';
import { FiRefreshCcw } from "react-icons/fi";
import Navbar from '../Navbar';
import { FaFileExcel, FaRegEye } from 'react-icons/fa'; // Add this import
import * as XLSX from 'xlsx'; // Add this import
import { Link } from 'react-router-dom';

function Supplier() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectAccounts, setselectAccounts] = useState("ទាំងអស់");
    const [selectedcostTypes, setSelectedcostTypes] = useState("ទាំងអស់");

    const [filterAmountDi, setFilterAmountDi] = useState("ទាំងអស់");


    useEffect(() => {
        getAllOrder();
        getALLCustomer();
    }, []);

    const getAllOrder = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/invoice/InvoiceCost`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const [costTypes, setCostType] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const getALLCustomer = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/account/1`);
            const responeProduct = await axios.get(`${API_URL}/api/cost_type/1`);
            setAccounts(response.data);
            console.log(response.data)
            setCostType(responeProduct.data);
        } catch (error) {
            console.error('Error fetching customers data', error);
        }
    };

    const [filterDate, setFilterDate] = useState("ទាំងអស់");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const filterByDate = (dob) => {
        const today = new Date();
        const orderDateObj = new Date(dob);

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
        const matchesCustomer = selectAccounts === "ទាំងអស់" || order.account_id == selectAccounts;
        const matchesProduct = selectedcostTypes === "ទាំងអស់" || order.cost_type_id == selectedcostTypes;
        const matchesDate = filterByDate(order.dob);
        // Determine the payment status
        let paymentStatus = "ទាំងអស់";
        if (order.payment >= order.price) {
            paymentStatus = "បង់"; // Fully Paid
        } else if (order.payment > 0 && order.payment < order.price) {
            paymentStatus = "បានបង់ខ្លះ"; // Partially Paid
        } else if (order.payment < order.price) {
            paymentStatus = "ជុំពាក់"; // Owing
        }

        const matchesPaymentStatus = filterAmountDi === "ទាំងអស់" || paymentStatus === filterAmountDi;

        return matchesCustomer && matchesDate && matchesPaymentStatus && matchesProduct;
    });



    const totalTax = filteredOrders.reduce((sum, customer) => sum + customer.tax, 0);
    const totalPrice = filteredOrders.reduce((sum, customer) => sum + customer.price, 0);
    const totalPayment = filteredOrders.reduce((sum, customer) => sum + customer.payment, 0);


    const ReFrest = () => {
        setFilterDate("");
        setselectAccounts("ទាំងអស់");
        setFilterAmountDi("ទាំងអស់");
        setSelectedcostTypes("ទាំងអស់");
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
            "លេខរៀង", "កាលបរិច្ឆេទ", "ប្រភេទនែការចំណាយ", "ប្រភេទគណនីចំណាយ",
            "ព័ត៌មានលម្អិតពីការបន្ត", "ស្ថានភាពការទូទាត់", "ពន្ធ", "ចំនួនសរុប", "ការទូទាត់ដល់ពេលតំណត់", "បន្ថែមដោយ"
        ];

        // Initialize total variables
        let totalTax = 0;
        let totalPrice = 0;
        let totalPayment = 0;

        // Extract data from filteredOrders
        const dataRows = filteredOrders.map((customer, index) => {
            totalTax += customer.tax;
            totalPrice += customer.price;
            totalPayment += customer.payment;

            return [
                index + 1,
                new Date(customer.dob).toISOString().split('T')[0],  // Format Date
                customer.type_names,
                customer.acc_names || 'N/A',
                `ចន្លោះពេលកើតឡើងវិញ: ${customer.interval} ${customer.interval_type || 'N/A'}`,
                customer.payment >= customer.price ? 'បង់' :
                    customer.payment > 0 ? 'បានបង់ខ្លះ' : 'ជុំពាក់',
                customer.tax.toFixed(2),  // Format to 2 decimal places
                customer.price.toFixed(2),
                customer.payment.toFixed(2),
                customer.user_at || 'N/A'
            ];
        });

        // Add footer row with sums
        const footerRow = [
            'សរុប:',  // Label for "Total"
            '', '', '', '', '',
            totalTax.toFixed(2),
            totalPrice.toFixed(2),
            totalPayment.toFixed(2),
            ''
        ];

        // Combine header, data, and sum row
        const excelData = [headerRow, ...dataRows, footerRow];

        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Order_Purchase_Report");

        // Write Excel file
        XLSX.writeFile(wb, "Order_Purchase_Report.xlsx");
    };



    return (

        <div >
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0  sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">

                    <div className='grid xl:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-3 border-t-2 border-blue-500 bg-gray-200/50 py-6 px-2'>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">ទំនាក់ទំនង:</label>
                            <select
                                className='input_text  block'
                                id="unit_ID"
                                value={selectedcostTypes}
                                onChange={(e) => setSelectedcostTypes(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                {costTypes.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.type_names}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">ទំនាក់ទំនង:</label>
                            <select
                                className='input_text  block'
                                id="unit_ID"
                                value={selectAccounts}
                                onChange={(e) => setselectAccounts(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                {accounts?.map((items) => (
                                    <option key={items.id} value={items.id} disabled={items.status === 'off'}>
                                        {items.acc_names}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">កាលបរិច្ឆេទ:</label>
                            <select
                                className='input_text  font-NotoSansKhmer text-md block'
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
                        <div className='flex items-center space-x-4'>
                            <div className="space-y-2">
                                <label className='text-lg font-NotoSansKhmer' htmlFor="">ទាំងអស់:</label>
                                <select
                                    className='input_text w-[250px] font-NotoSansKhmer text-md block'
                                    value={filterAmountDi}
                                    onChange={(e) => setFilterAmountDi(e.target.value)}
                                >
                                    <option value="ទាំងអស់">ទាំងអស់</option>
                                    <option value="បង់">បង់</option>
                                    <option value="បានបង់ខ្លះ">បានបង់ខ្លះ</option>
                                    <option value="ជុំពាក់">ជុំពាក់</option>
                                </select>
                            </div>
                            <button onClick={ReFrest} className='bg-blue-500 p-2 rounded-full'>  <FiRefreshCcw className='text-xl text-white' /></button>
                        </div>
                    </div>

                    <div id='invoicesale' className='mt-6'>


                        <div className="flex justify-end my-6 print:hidden space-x-2">
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-1 px-4  py-2 ml-2 font-bold text-white bg-green-500 hover:bg-green-700"
                            >
                                <FaFileExcel /> <span>នាំចេញ Excel</span>
                            </button>
                            <button onClick={handlePrint} className="flex px-4 items-center gap-1  py-2 font-bold text-white bg-blue-500 hover:bg-blue-700" type="button">
                                <IoPrint /> <span>បោះពុម្ភ</span>
                            </button>
                        </div>
                        <div className="relative overflow-x-auto h-screen scrollbar-hidden">
                            <AnimatePresence>

                                <table className="min-w-full table-auto">
                                    <thead className="bg-blue-600/95 text-white">
                                        <tr className="font-NotoSansKhmer font-bold">
                                            <th className="  py-2">#</th>
                                            <th className="  py-2">កាលបរិច្ខេទ</th>
                                            <th className="  py-2">ប្រភេទនែការចំណាយ</th>
                                            <th className="  py-2">ប្រភេទគណនីចំណាយ</th>
                                            <th className="  py-2">ព័ត៌មានលម្អិតពីការបន្ត</th>
                                            <th className="  py-2">ស្ថានភាពការទូទាត់</th>
                                            <th className="  py-2">ពន្ធ</th>
                                            <th className="  py-2">ចំនួនសរុប</th>
                                            <th className="  py-2">ការទូទាត់ដល់ពេលតំណត់</th>
                                            <th className="  py-2">បន្ថែមដោយ</th>
                                            <th className='print:hidden'>
                                                សកម្មភាព
                                            </th>

                                        </tr>
                                    </thead>
                                    {filteredOrders.length === 0 ? (
                                        <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ?</p>
                                    ) : (
                                        <tbody>
                                            {filteredOrders.map((customer, index) => (
                                                <motion.tr key={customer.id}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={rowAnimation}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-sm font-NotoSansKhmer  hover:scale-y-110 duration-100">
                                                    <td className="  py-1">{index + 1}</td>
                                                    <td className="  py-1 whitespace-nowrap">
                                                        {new Date(customer.dob).toISOString().split('T')[0]}

                                                    </td>
                                                    <td className="whitespace-nowrap py-1">{customer.type_names}</td>
                                                    <td className="whitespace-nowrap py-1">{customer.acc_names || 'N/A'}</td>
                                                    <td className="whitespace-nowrap py-1">ចន្លោះពេលកើតឡើងវិញ​ : {customer.interval} {customer.interval_type || 'N/A'}</td>

                                                    <td className=" py-1">
                                                        {customer.payment >= customer.price ? (
                                                            <span className="text-green-400">បង់</span> // Fully Paid
                                                        ) : customer.payment > 0 && customer.payment < customer.price ? (
                                                            <span className="text-pink-400">បានបង់ខ្លះ</span> // Partially Paid
                                                        ) : customer.payment < customer.price ? (
                                                            <span className="text-red-400">ជុំពាក់</span> // Owing
                                                        ) : null}
                                                    </td>
                                                    <td className=" py-1">
                                                        {customer.tax.toLocaleString('en-US', {
                                                            style: 'decimal',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        $
                                                    </td>

                                                    <td className=" py-1">
                                                        {customer.price.toLocaleString('en-US', {
                                                            style: 'decimal',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        $
                                                    </td>
                                                    <td className=" py-1">
                                                        {customer.payment.toLocaleString('en-US', {
                                                            style: 'decimal',
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}{' '}
                                                        $
                                                    </td>
                                                    <td className=" py-1">{customer.user_at || 'N/A'}</td>

                                                    <td className='print:hidden'>
                                                        <Link
                                                            to={`/cost/${customer.id}`}
                                                            className="flex items-center gap-1 p-2 font-bold text-white bg-green-300 hover:bg-green-400"

                                                        >
                                                            <IoPrint />
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            ))}

                                        </tbody>

                                    )}
                                    <tr className="font-bold bg-gray-200">
                                        <td className="py-2 text-center" colSpan={6}>សរុប:</td>
                                        <td className="py-2 whitespace-nowrap">{totalTax.toLocaleString('en-US', { minimumFractionDigits: 2 })} $</td>
                                        <td className="py-2 whitespace-nowrap">{totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} $</td>
                                        <td className="py-2 whitespace-nowrap">{totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })} $</td>
                                        <td className="py-2 whitespace-nowrap" colSpan={2}></td>
                                    </tr>
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