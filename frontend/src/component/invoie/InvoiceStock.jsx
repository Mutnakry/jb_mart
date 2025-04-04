
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { API_URL } from '../../service/api';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';
import { RiFileExcel2Line } from "react-icons/ri";
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function InvoiceStock() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllOrder();
        getALLCustomer();
    }, []);

    const getAllOrder = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/invoice/in_stockproduct`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const [categorys, setCategorys] = useState([]);
    const [Brands, setBrands] = useState([]);
    const [Units, setUnits] = useState([]);
    const [selectedCategorys, setSelectedCategorys] = useState("ទាំងអស់"); // New state for customer filter
    const [selectedUnits, setSelectedUnits] = useState("ទាំងអស់"); // New state for customer filter
    const [selectedBrands, setSelectedBrands] = useState("ទាំងអស់"); // New state for customer filter

    const getALLCustomer = async () => {
        try {
            const respUnit = await axios.get(`${API_URL}/api/unit`);
            const respCategory = await axios.get(`${API_URL}/categories`);
            const respBrands = await axios.get(`${API_URL}/api/brands`);

            console.log('Category data:', respCategory.data); // Check if it's an array
            setCategorys(respCategory.data.categories);
            setBrands(respBrands.data.brands);
            setUnits(respUnit.data.unit);
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


    // Filter orders based on selected customer and date
    const filteredOrders = orders.filter(order => {
        const matchesBrans = selectedBrands === "ទាំងអស់" || String(order.brand_id) === String(selectedBrands);
        const matchesCategorys = selectedCategorys === "ទាំងអស់" || String(order.category_id) === String(selectedCategorys);
        const matchesUnits = selectedUnits === "ទាំងអស់" || String(order.unit_id) === String(selectedUnits);

        const matchesDate = filterByDate(order.create_at);
        return matchesBrans && matchesDate && matchesCategorys && matchesUnits;
    });


    const totalCostPrice = filteredOrders.reduce((sum, product) => sum + (product.cost_price * product.qty), 0);
    const totalExcludeTax = filteredOrders.reduce((sum, product) => sum + (product.exclude_tax * product.qty), 0);
    const totalIncludeTax = filteredOrders.reduce((sum, product) => sum + parseFloat(product.include_tax || 0), 0);
    const TotalQTY = filteredOrders.reduce((sum, product) => sum + parseFloat(product.qty || 0), 0);


    const handlePrint = () => {
        const printContents = document.getElementById('invoicesale').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    const exportToExcel = () => {
        // Prepare the data for export
        const wsData = filteredOrders.map((order, index) => ({
            "លេខរៀង": index + 1,
            "ឈ្មោះផលិតផល": order.pro_names,
            "ប្រភេទទំនិញ": order.cat_names || 'N/A',
            "ម៉ាលយីយោ": order.brand_names || 'N/A',
            "ប្រភេទផលិតផល": order.product_type || 'N/A',
            "បង្កើតនៅថ្ងៃទី": formatDateToKhmer(new Date(order.create_at)),
            "តម្លៃទិញចូលក្នុងមួយឯកតា": `${order.cost_price} $`,
            "តម្លៃលក់ចេញក្នុងមួយឯកតា": `${order.exclude_tax} $`,
            "ពន្ធ": `${order.include_tax} $`,
            "តម្លៃចំនេញ": `${order.profit} $`,
            "បច្ចុប្បន្នភាពស្តុក": `${order.qty} ${order.unit_names}`,
            "សរុបចំនួនស្តុក": `${order.stock} ${order.unit_names}`,
            "ចំនួនលក់សរុប sto - qt": `${(order.stock) - (order.qty)} ${order.unit_names}`,
            "តម្លៃស្ដុកបច្ចុប្បន្ន(ដោយថ្លៃទិញចូល)": `${(order.cost_price) * (order.qty)} $`,
            "តម្លៃស្ដុកបច្ចុប្បន្ន(ដោយថ្លៃលក់ចេញ)": `${(order.exclude_tax) * (order.qty)} $`,
            "សាច់ប្រាក់ចំណេញសក្ដានុពល": `${(order.profit) * (order.qty)} $`,
        }));

        // Create worksheet and workbook
        const ws = XLSX.utils.json_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');

        // Save to file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(data, `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };



    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };
    return (

        <div >
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0  sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">
                    <div className='grid md:grid-cols-4 grid-cols-1 gap-3 border-t-2 border-blue-500 bg-gray-200/50 py-6 px-2'>

                        <div className="col-span-1 space-y-2">
                            <label className="font-bold font-NotoSansKhmer">ឯកតា:* </label>
                            <select
                                className='input_text'
                                id="unit_ID"
                                value={selectedUnits}
                                onChange={(e) => setSelectedUnits(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                {Units?.map((items) => (
                                    <option key={items.id} value={items.id}>
                                        {items.names}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="font-bold font-NotoSansKhmer">ម៉ាកយីហោ:</label>
                            <select
                                className='input_text'
                                id="brand_ID"
                                value={selectedBrands}
                                onChange={(e) => setSelectedBrands(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>

                                {Brands?.map((items) => (
                                    <option key={items.id} value={items.id}>
                                        {items.brand_names}
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className="col-span-1 space-y-2">
                            <label className="font-bold font-NotoSansKhmer">ប្រភេទទំនេញ:</label>
                            <select
                                className='input_text'
                                value={selectedCategorys}
                                onChange={(e) => setSelectedCategorys(e.target.value)}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>

                                {categorys?.map((items) => (
                                    <option key={items.id} value={items.id}>
                                        {items.cat_names}
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
                    </div>



                    <div id='invoicesale' className=''>
                        <div className='grid xl:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-3  bg-gray-200/50 py-6 px-2'>

                            <div className="flex items-center h-24 bg-white border-t-2 border-red-500">
                                <div className='flex items-center gap-4 mx-5'>

                                    <div>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>{totalCostPrice.toFixed(2)} $</h3>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>ការបិទស្តុក (ដោយថ្លៃទិញចូល)</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center h-24 bg-white border-t-2 border-blue-600">
                                <div className='flex items-center gap-4 mx-5'>

                                    <div>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>{totalExcludeTax.toFixed(2)} $</h3>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>	ការបិទស្តុក (ដោយថ្លៃលក់ចេញ)</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center h-24 bg-white border-t-2 border-pink-600">
                                <div className='flex items-center gap-4 mx-5'>

                                    <div>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>{totalIncludeTax.toFixed(2)} $</h3>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>សរុបការចំណាយពន្ធ (ដោយថ្លៃទិញចូល)</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center h-24 bg-white border-t-2 border-gray-600">
                                <div className='flex items-center gap-4 mx-5'>

                                    <div>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>{(totalExcludeTax - totalCostPrice).toFixed(2)} $</h3>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>សាច់ប្រាក់ចំណេញសក្ដានុពល</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center h-24 bg-white border-t-2 border-green-500">
                                <div className='flex items-center gap-4 mx-5'>

                                    <div>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>
                                            {totalCostPrice !== 0
                                                ? (((totalExcludeTax - totalCostPrice) / totalCostPrice) * 100).toFixed(2) + ' %'
                                                : '0 %'}
                                        </h3>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>គម្រាតប្រាក់ចំណេញ %</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center h-24 bg-white border-t-2 border-pink-600">
                                <div className='flex items-center gap-4 mx-5'>

                                    <div>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>{TotalQTY}</h3>
                                        <h3 className='font-bold text-gray-600 font-NotoSansKhmer'>សរុបចំនួននៅស្តុក​ (បច្ចុប្បន្ន)</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end my-6 print:hidden space-x-5">
                            <button
                                onClick={exportToExcel}
                                className=" py-2 flex px-4 items-center space-x-2 bg-green-500 text-white hover:bg-green-600">
                                <RiFileExcel2Line />  <span> នាំចេញ Excel</span>
                            </button>

                            <button onClick={handlePrint} className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700" type="button">
                                <IoPrint /> <span>បោះពុម្ភ</span>
                            </button>
                        </div>
                        <div className="relative overflow-x-auto h-screen scrollbar-hidden">
                            <AnimatePresence>
                                <table className="min-w-full table-auto">
                                    <thead className="text-white bg-blue-600/95">
                                        <tr className="text-xs font-bold font-NotoSansKhmer">
                                            <th className=" py-2 ">លេខរៀង</th>
                                            <th className=" py-2 whitespace-nowrap">ឈ្មោះផលិតផល</th>
                                            <th className=" py-2 ">ប្រភេទទំនិញ</th>
                                            <th className=" py-2 ">ម៉ាលយីយោ</th>
                                            <th className=" py-2 ">បង្កើតនៅថ្ងៃទី</th>
                                            <th className=" py-2 ">តម្លៃទិញចូលក្នុងមួយឯកតា</th>
                                            <th className=" py-2 ">តម្លៃលក់ចេញក្នុងមួយឯកតា</th>
                                            <th className=" py-2 ">ពន្ធ</th>
                                            <th className=" py-2 ">តម្លៃចំនេញ</th>
                                            <th className=" py-2 ">បច្ចុប្បន្នភាពស្តុក</th>
                                            <th className=" py-2 ">សរុបចំនួនស្តុក</th>
                                            <th className=" py-2 ">ចំនួនលក់សរុប sto - qt</th>
                                            <th className=" py-2 ">	តម្លៃស្ដុកបច្ចុប្បន្ន(ដោយថ្លៃទិញចូល)</th>
                                            <th className=" py-2 ">តម្លៃស្ដុកបច្ចុប្បន្ន(ដោយថ្លៃលក់ចេញ)</th>
                                            <th className=" py-2 ">សាច់ប្រាក់ចំណេញសក្ដានុពល</th>
                                            <th className=" py-2 ">សកម្មភាព</th>
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
                                                    className="text-xs duration-100 font-NotoSansKhmer hover:scale-y-110">
                                                    <td className=" py-1 ">{index + 1}</td>
                                                    <td className='whitespace-nowrap'>
                                                    {product.pro_names}
                                                    </td>
                                                    <td className=" py-1 ">{product.cat_names || 'N/A'}</td>
                                                    <td className=" py-1">{product.brand_names || 'N/A'}</td>
                                                    <td className=" py-1 whitespace-nowrap">{formatDateToKhmer(new Date(product.create_at))}</td>
                                                    <td className=" py-1 whitespace-nowrap">{product.cost_price} $</td>
                                                    <td className=" py-1 whitespace-nowrap">{product.exclude_tax} $</td>
                                                    <td className=" py-1 whitespace-nowrap">{product.include_tax} $</td>
                                                    <td className=" py-1 whitespace-nowrap">{product.profit} $</td>
                                                    <td className=" py-1 whitespace-nowrap">{product.qty} {product.unit_names}</td>
                                                    <td className=" py-1 whitespace-nowrap">{product.stock} {product.unit_names}</td>
                                                    <td className=" py-1 whitespace-nowrap">{(product.stock) - (product.qty)} {product.unit_names}</td>
                                                    <td className=" py-1 whitespace-nowrap">{((product.cost_price) * (product.qty)).toFixed(2)} $</td>
                                                    <td className=" py-1 whitespace-nowrap">{((product.exclude_tax) * (product.qty)).toFixed(2)} $</td>
                                                    <td className=" py-1 whitespace-nowrap">{((product.profit) * (product.qty)).toFixed(2)} $</td>
                                                    <td className="flex  space-x-2">
                                                        <Link
                                                            to={`/product/${product.id}`}
                                                            className="flex items-center gap-1 p-2 font-bold text-white bg-green-300 hover:bg-green-400"

                                                        >
                                                            <IoPrint />
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    )}
                                </table>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default InvoiceStock