


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { API_URL } from '../../service/api';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';

import { FaFileExcel } from 'react-icons/fa'; // Add this import
import * as XLSX from 'xlsx'; // Add this import

function Supplier() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Suppliers, setSuppliers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("ទាំងអស់"); // New state for customer filter
    const [filterAmountDi, setFilterAmountDi] = useState("ទាំងអស់");

    useEffect(() => {
        getAllOrder();
        getALLCustomer();
    }, []);

    const getAllOrder = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/invoice/supplier`);
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
            const response = await axios.get(`${API_URL}/api/supplier/1`);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching customers data', error);
        }
    };

    const [filterDate, setFilterDate] = useState("ទាំងអស់");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const filterByDate = (orderDate) => {
        const today = new Date();
        const orderDateObj = new Date(orderDate);

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
        const matchesCustomer = selectedCustomer === "ទាំងអស់" || order.supplier_id == selectedCustomer;
        const matchesDate = filterByDate(order.purchase_date);

        // Calculate remaining balance
        const remainingAmount = Number(order.total_amount) - (Number(order.amount_pay) + Number(order.amount_discount));
        const matchesPaymentStatus =
            filterAmountDi === "ទាំងអស់" ||
            (filterAmountDi === "ជំពាក់" && remainingAmount > 0) ||
            (filterAmountDi === "បង់រួច" && remainingAmount === 0);

        return matchesCustomer && matchesDate && matchesPaymentStatus;
    });


    const totalAmountRaw = filteredOrders.reduce(
        (total, order) => total + (Number(order.total_amount) || 0),
        0
    );
    const totalDiscountRaw = filteredOrders.reduce(
        (total, order) => total + (Number(order.amount_discount) || 0),
        0
    );
    const totalBalanceRaw = filteredOrders.reduce(
        (total, order) => total + (Number(order.amount_pay) || 0),
        0
    );

    const totalAmount = totalAmountRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const totalDiscount = totalDiscountRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    const totalBalance = totalBalanceRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    const remainingBalanceRaw = totalAmountRaw - totalBalanceRaw;
    const remainingBalance = remainingBalanceRaw.toLocaleString('en-US', { style: 'currency', currency: 'USD' });


    const totalTax = filteredOrders
        .reduce((total, order) => total + (Number(order.total_include_tax) || 0), 0)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    const totalQTY = filteredOrders
        .reduce((total, order) => total + (Number(order.total_qty) || 0), 0)


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


    // Add export function
    const exportToExcel1 = () => {
        // Define headers for the Excel file
        const headerRow = ['ល.រ', 'កាលបរិច្ឆេទ', 'អ្នកផ្គត់ផ្កង់', 'ចំនួន', 'ពន្ធ', 'បញ្ចុះតម្លៃចំនួន', 'ទឹកប្រាក់សរុប', 'ទឹកប្រាក់ដែលបានបង់', 'ទឹកប្រាក់នៅខ្វះ'];

        // Map through your filteredOrders and generate rows for each order
        const dataRows = filteredOrders.map((order, index) => {
            const remainingAmount = order.total_amount - (Number(order.amount_pay) + Number(order.amount_discount));

            return [
                index + 1,
                formatDateToKhmer(new Date(order.purchase_date)),
                order.business_names || order.supplier_name,
                `${order.total_qty || '0.00'}`,
                `${order.total_include_tax || '0.00'}`,
                `${order.amount_discount || '0.00'} $`,
                `${order.total_amount || '0.00'} $`,
                `${order.amount_pay || '0.00'} $`,
                `${remainingAmount || '0.00'} $`,

            ];
        });
        const excelData = [headerRow, ...dataRows];
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Supplier Report");
        XLSX.writeFile(wb, "Supplier_Report.xlsx");
    };


    const exportToExcel = () => {
        // Define headers for the Excel file
        const headerRow = ['ល.រ', 'កាលបរិច្ឆេទ', 'អ្នកផ្គត់ផ្កង់', 'ចំនួន', 'ពន្ធ', 'បញ្ចុះតម្លៃចំនួន', 'ទឹកប្រាក់សរុប', 'ទឹកប្រាក់ដែលបានបង់', 'ទឹកប្រាក់នៅខ្វះ'];

        // Initialize variables to store sums
        let totalAmount = 0;
        let totalPaid = 0;
        let totalRemaining = 0;
        let totalQty = 0;
        let totalIncludeTax = 0;
        let totalDiscount = 0;

        // Map through your filteredOrders and generate rows for each order
        const dataRows = filteredOrders.map((order, index) => {
            const remainingAmount = order.total_amount - (Number(order.amount_pay) + Number(order.amount_discount));

            // Add up the values for sums
            totalAmount += Number(order.total_amount || 0);
            totalPaid += Number(order.amount_pay || 0);
            totalRemaining += remainingAmount;
            totalQty += Number(order.total_qty || 0);
            totalIncludeTax += Number(order.total_include_tax || 0);
            totalDiscount += Number(order.amount_discount || 0);

            return [
                index + 1,
                formatDateToKhmer(new Date(order.purchase_date)),
                order.business_names || order.supplier_name,
                `${order.total_qty || '0.00'}`,
                `${order.total_include_tax || '0.00'}`,
                `${order.amount_discount || '0.00'} $`,
                `${order.total_amount || '0.00'} $`,
                `${order.amount_pay || '0.00'} $`,
                `${remainingAmount || '0.00'} $`
            ];
        });

        // Add footer row with sums
        const footerRow = [
            'សរុប:',  // Label for "Total"
            '', // Empty cell for Date
            '', // Empty cell for Supplier Name
            `${totalQty} ផលិតផល`, // Total Quantity
            `${totalIncludeTax} $`, // Total Include Tax
            `${totalDiscount} $`, // Total Discount
            `${totalAmount} $`, // Total Amount
            `${totalPaid} $`, // Total Paid
            `${totalRemaining.toFixed(2)} $` // Remaining Amount
        ];

        // Combine the header, data rows, and footer row
        const excelData = [headerRow, ...dataRows, footerRow];

        // Create Excel file
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Supplier Report");
        XLSX.writeFile(wb, "Supplier_Report.xlsx");
    };

    return (

        <div >
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
                                {item.full_names} {item.business_names}
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
                <div className="space-y-2">
                    <label className='text-lg font-NotoSansKhmer' htmlFor="">ទាំងអស់:</label>
                    <select
                        className='input_text w-[370px] font-NotoSansKhmer text-md block'
                        value={filterAmountDi}
                        onChange={(e) => setFilterAmountDi(e.target.value)}
                    >
                        <option value="ទាំងអស់">ទាំងអស់</option>
                        <option value="ជំពាក់">អ្កកជុំពាក់</option>
                        <option value="បង់រួច">អ្កកមិនបានជុំពាក់</option>
                    </select>

                </div>
            </div>

            <div id='invoicesale' className='mt-6'>

                {/* <div className=" text-md px-4"> */}
                <div className="px-6 pt-6 print:border-0 print:shadow-none hidden print:block">
                    <div className='space-y-1 flex justify-center'>
                        <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>
                    </div>
                    <div className='flex justify-between'>
                        {/* Purchase Information */}
                        <div>
                            <p>អ្នកផ្គត់ផ្កង់ : {selectedCustomer}
                            </p>
                            <p>កាលបរិច្ខេទ : <span className='font-NotoSansKhmer'>{filterDate}</span></p>

                        </div>

                    </div>

                </div>
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
                            <thead className="bg-blue-600/95 text-white dark:bg-slate-400">
                                <tr className="font-NotoSansKhmer font-bold">
                                    <th className=" px-4 py-2">#</th>
                                    <th className=" px-4 py-2">កាលបរិច្ឆេទ</th>
                                    <th className=" px-4 py-2">អ្នកផ្គត់ផ្កង់</th>
                                    <th className=" px-4 py-2">សរុបចំនួនដែលបានបន្ថែម</th>
                                    <th className=" px-4 py-2">ពន្ធ</th>
                                    <th className=" px-4 py-2">បញ្ចុះតម្លៃចំនួន</th>
                                    <th className=" px-4 py-2">ទឹកប្រាក់សរុបចំនួន</th>
                                    <th className=" px-4 py-2">បានបង់ទឹកប្រាក់សរុបចំនួន</th>
                                    <th className=" px-4 py-2">នៅនៅខ្វះទឹកប្រាក់ចំនួន</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : filteredOrders.length === 0 ? (
                                <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ </p>
                            ) : (
                                <tbody>
                                    {filteredOrders?.map((purchase, index) => {
                                        const remainingAmount = purchase.total_amount - (Number(purchase.amount_pay) + Number(purchase.amount_discount));
                                        return (
                                            <motion.tr key={purchase.id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className='text-sm'
                                                variants={rowAnimation}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <td >
                                                    {index + 1}
                                                </td>
                                                <td  >
                                                    {formatDateToKhmer(new Date(purchase.purchase_date))}
                                                </td>
                                                <td className="px-4 py-2">{purchase.business_names} {purchase.supplier_name}</td>
                                                <td className="px-4 py-2" >{purchase.total_qty}</td>
                                                <td className="px-4 py-2" >{purchase.total_include_tax} $</td>
                                                <td className="px-4 py-2" >{purchase.amount_discount} $</td>
                                                <td className="px-4 py-2" >{purchase.total_amount} $</td>
                                                <td className="px-4 py-2" >{purchase.amount_pay} $</td>
                                                <td className="px-4 py-2" >{remainingAmount.toFixed(2)} $</td>

                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            )}
                            <tfoot>
                                <tr className="font-bold bg-gray-200 h-20">
                                    <td colSpan='3' className="text-right px-4 py-2">សរុប:</td>
                                    <td className="px-4 py-2">{totalQTY} ផលិតផល</td>
                                    <td className="px-4 py-2">
                                        {totalTax}
                                    </td>
                                    <td className="px-4 py-2">
                                        {totalDiscount}
                                    </td>
                                    <td className="px-4 py-2">
                                        {totalAmount}
                                    </td>
                                    <td className="px-4 py-2">
                                        {totalBalance}
                                    </td>
                                    <td className="px-4 py-2">
                                        {remainingBalance}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </AnimatePresence>
                </div>
            </div>
        </div>

    );
}
export default Supplier;