


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
    const [selectedCustomer, setSelectedCustomer] = useState("ទាំងអស់");
    const [selectedProducts, setSelectedProducts] = useState("ទាំងអស់");

    const [filterAmountDi, setFilterAmountDi] = useState("ទាំងអស់");


    useEffect(() => {
        getAllOrder();
        getALLCustomer();
    }, []);

    const getAllOrder = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/invoice/purchase`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const [Products, setProducts] = useState([]);
    const [Suppliers, setSuppliers] = useState([]);

    const getALLCustomer = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/supplier/1`);
            const responeProduct = await axios.get(`${API_URL}/api/product/all`);
            setSuppliers(response.data);
            setProducts(responeProduct.data);
        } catch (error) {
            console.error('Error fetching customers data', error);
        }
    };

    const [filterDate, setFilterDate] = useState("ទាំងអស់");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const filterByDate = (purchase_date) => {
        const today = new Date();
        const orderDateObj = new Date(purchase_date);

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
        const matchesProduct = selectedProducts === "ទាំងអស់" || order.product_id == selectedProducts;
        const matchesDate = filterByDate(order.purchase_date);
        // Calculate remaining balance
        const remainingAmount = Number(order.total_amount) - (Number(order.amount_pay) + Number(order.amount_discount));
        const matchesPaymentStatus =
            filterAmountDi === "ទាំងអស់" ||
            (filterAmountDi === "ជំពាក់" && remainingAmount > 0) ||
            (filterAmountDi === "បង់រួច" && remainingAmount === 0);

        return matchesCustomer && matchesDate && matchesPaymentStatus && matchesProduct;
    });


    const totalIncludeTax = filteredOrders
        .reduce((total, purchase) => total + (Number(purchase.total_include_tax) || 0), 0)
        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';

    const amountDiscount = filteredOrders
        .reduce((total, purchase) => total + (Number(purchase.amount_discount) || 0), 0)
        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';

    const amountPay = filteredOrders
        .reduce((total, purchase) => total + (Number(purchase.amount_pay) || 0), 0)
        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';

    const balanceDue = filteredOrders
        .reduce((total, purchase) => total + ((Number(purchase.total_amount) || 0) - (Number(purchase.amount_pay) || 0)), 0)
        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';

    const totalAmount = filteredOrders
        .reduce((total, purchase) => total + (Number(purchase.total_amount) || 0), 0)
        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';

    const ReFrest = () => {
        setFilterDate("");
        setSelectedCustomer("ទាំងអស់");
        setFilterAmountDi("ទាំងអស់");
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
            "លេខរៀង", "កាលបរិច្ឆេទ", "អ្នកផ្គត់ផ្កង់", "ពន្ធ",
            "បញ្ចុះតម្លៃ", "ទឹកប្រាក់សរុបចំនួន ($)", "បានបង់ទឹកប្រាក់សរុបចំនួន", "នៅនៅខ្វះទឹកប្រាក់ចំនួន"
        ];
    
        // Initialize total variables
        let totalAmount = 0;
        let totalPaid = 0;
        let totalRemaining = 0;
        let totalIncludeTax = 0;
        let totalDiscount = 0;
    
        // Extract data from filteredOrders
        const dataRows = filteredOrders.map((purchase, index) => {
            const remainingAmount = purchase.total_amount - (Number(purchase.amount_pay) + Number(purchase.amount_discount));
    
            // Accumulate totals
            totalAmount += Number(purchase.total_amount || 0);
            totalPaid += Number(purchase.amount_pay || 0);
            totalRemaining += remainingAmount;
            totalIncludeTax += Number(purchase.total_include_tax || 0);
            totalDiscount += Number(purchase.amount_discount || 0);
    
            return [
                index + 1,
                formatDateToKhmer(new Date(purchase.purchase_date)),
                `${purchase.business_names} ${purchase.full_names}`,
                purchase.total_include_tax,
                purchase.amount_discount,
                purchase.total_amount,
                purchase.amount_pay,
                remainingAmount.toFixed(2)
            ];
        });
    
        // Add footer row with sums
        const footerRow = [
            'សរុប:',  // Label for "Total"
            '', // Empty cell for Date
            '', // Empty cell for Supplier Name
            `${totalIncludeTax.toFixed(2)} $`, // Total Include Tax
            `${totalDiscount.toFixed(2)} $`, // Total Discount
            `${totalAmount.toFixed(2)} $`, // Total Amount
            `${totalPaid.toFixed(2)} $`, // Total Paid
            `${totalRemaining.toFixed(2)} $` // Remaining Amount
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
            <div className='py-12 print:py-0 print:px-0 px-4 sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">

                    <div className='grid xl:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-3 border-t-2 border-blue-500 bg-gray-200/50 py-6 px-2'>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">ទំនាក់ទំនង:</label>
                            <select
                                className='input_text  block'
                                id="unit_ID"
                                value={selectedProducts}
                                onChange={(e) => setSelectedProducts(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                {Products.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.pro_names}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">ទំនាក់ទំនង:</label>
                            <select
                                className='input_text  block'
                                id="unit_ID"
                                value={selectedCustomer}
                                onChange={(e) => setSelectedCustomer(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                {Suppliers.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.business_names} {item.full_names}
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
                                    <option value="ជំពាក់">អ្កកជុំពាក់</option>
                                    <option value="បង់រួច">អ្កកមិនបានជុំពាក់</option>
                                </select>

                            </div>
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
                                    <thead className="p-2 text-white bg-blue-600/90 text-sm">
                                        <tr className="font-bold font-NotoSansKhmer">
                                            <th className="px-4 py-2">#</th>
                                            <th className="px-4 py-2">កាលបរិច្ឆេទ</th>
                                            <th className="px-4 py-2">អ្នកផ្គត់ផ្កង់</th>
                                            <th className="px-4 py-2">ពន្ធ</th>
                                            <th className="px-4 py-2">បញ្ចុះតម្លៃ</th>
                                            <th className="px-4 py-2">ទឹកប្រាក់សរុបចំនួន</th>
                                            <th className="px-4 py-2">បានបង់ទឹកប្រាក់សរុបចំនួន</th>
                                            <th className="px-4 py-2">នៅនៅខ្វះទឹកប្រាក់ចំនួន</th>
                                            <th className="px-4 py-2 print:hidden">សកម្មភាព</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {error && <p className="text-red-500">{error}</p>}
                                            {filteredOrders.length === 0 && !loading && <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ!</p>}
                                            {filteredOrders.map((purchase, index) => {
                                                const remainingAmount = purchase.total_amount - (Number(purchase.amount_pay) + Number(purchase.amount_discount));
                                                return (
                                                    <motion.tr key={purchase.id}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
                                                        transition={{ duration: 0.3 }}
                                                        className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110 whitespace-nowrap">
                                                        <td className="px-4 py-1">{index + 1}</td>
                                                        <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.purchase_date))}</td>
                                                        <td className="px-4 py-1">{purchase.business_names} {purchase.full_names}</td>
                                                        <td className="px-4 py-2">{purchase.total_include_tax} $</td>
                                                        <td className="px-4 py-1 ">{purchase.amount_discount} $</td>
                                                        <td className="px-4 py-1">{purchase.total_amount} $</td>
                                                        <td className="px-4 py-1">{purchase.amount_pay} $</td>
                                                        <td className="px-4 py-1">
                                                            {remainingAmount.toFixed(2)} $
                                                        </td>
                                                        <td className='print:hidden px-4 py-1'>
                                                            <Link className="flex p-2  w-6 text-xs text-white bg-blue-500" to={`/OrderPurchase/${purchase.purchasedetail_id}`}>
                                                                <FaRegEye />
                                                            </Link>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}

                                        </AnimatePresence>
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-bold h-16 bg-gray-200">
                                            <td colSpan='3' className="text-right px-4 py-2">សរុប:</td>
                                            <td className="px-4 py-2">
                                                {totalIncludeTax}
                                            </td>
                                            <td className="px-4 py-2">{amountDiscount}</td>
                                            <td className="px-4 py-2">
                                                {totalAmount}
                                            </td>
                                            <td className="px-4 py-2">

                                                {amountPay}
                                            </td>
                                            <td colSpan='2' className="px-4 py-2">
                                                {balanceDue}
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