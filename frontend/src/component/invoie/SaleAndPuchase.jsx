

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../service/api';
import { IoPrint } from 'react-icons/io5';

import Navbar from '../Navbar';

function SaleAndPuchase() {
    const [purchases, setPurchases] = useState([]);
    const [orderDetail, setOrderDetail] = useState([]);
    const [orderReturn, setOrderReturn] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        getAllPurchase();
    }, []);

    const getAllPurchase = async () => {
        setLoading(true);
        setError(null);
        try {
            const responsePurchase = await axios.get(`${API_URL}/api/invoice/sum_purchase`);
            const responseOrderDetail = await axios.get(`${API_URL}/api/invoice/orderdetail`);
            const responseOrderReturn = await axios.get(`${API_URL}/api/invoice/orderreturn`);
            setPurchases(responsePurchase.data);
            setOrderDetail(responseOrderDetail.data)
            setOrderReturn(responseOrderReturn.data)
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Function to filter purchases based on selected date range

    const filterPurchases = () => {
        const today = new Date();
        return purchases.filter((purchase) => {
            const payDate = new Date(purchase.pay_date);

            switch (filterDate) {
                case 'today':
                    return payDate.toDateString() === today.toDateString();
                case 'yesterday':
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);
                    return payDate.toDateString() === yesterday.toDateString();
                case 'last7days':
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    return payDate >= sevenDaysAgo && payDate <= today;
                case 'last30days':
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    return payDate >= thirtyDaysAgo && payDate <= today;
                case 'thisMonth':
                    return (
                        payDate.getMonth() === today.getMonth() &&
                        payDate.getFullYear() === today.getFullYear()
                    );
                case 'lastMonth':
                    const lastMonth = new Date();
                    lastMonth.setMonth(today.getMonth() - 1);
                    return (
                        payDate.getMonth() === lastMonth.getMonth() &&
                        payDate.getFullYear() === lastMonth.getFullYear()
                    );
                case 'last3Months':
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(today.getMonth() - 3);
                    return payDate >= threeMonthsAgo && payDate <= today;
                case 'thisYear':
                    return payDate.getFullYear() === today.getFullYear();
                case 'lastYear':
                    return payDate.getFullYear() === today.getFullYear() - 1;
                default:
                    return true; // No filter applied
            }
        });
    };


    const filterOrderDetail = () => {
        const today = new Date();
        return orderDetail.filter((order) => {
            const payDate = new Date(order.create_at);



            switch (filterDate) {
                case 'today':
                    return payDate.toDateString() === today.toDateString();
                case 'yesterday':
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);
                    return payDate.toDateString() === yesterday.toDateString();
                case 'last7days':
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    return payDate >= sevenDaysAgo && payDate <= today;
                case 'last30days':
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    return payDate >= thirtyDaysAgo && payDate <= today;
                case 'thisMonth':
                    return (
                        payDate.getMonth() === today.getMonth() &&
                        payDate.getFullYear() === today.getFullYear()
                    );
                case 'lastMonth':
                    const lastMonth = new Date();
                    lastMonth.setMonth(today.getMonth() - 1);
                    return (
                        payDate.getMonth() === lastMonth.getMonth() &&
                        payDate.getFullYear() === lastMonth.getFullYear()
                    );
                case 'last3Months':
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(today.getMonth() - 3);
                    return payDate >= threeMonthsAgo && payDate <= today;
                case 'thisYear':
                    return payDate.getFullYear() === today.getFullYear();
                case 'lastYear':
                    return payDate.getFullYear() === today.getFullYear() - 1;
                default:
                    return true; // No filter applied
            }
        });
    };

    const filterOrderReturn = () => {
        const today = new Date();
        return orderReturn.filter((order) => {
            const payDate = new Date(order.created_at);



            switch (filterDate) {
                case 'today':
                    return payDate.toDateString() === today.toDateString();
                case 'yesterday':
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);
                    return payDate.toDateString() === yesterday.toDateString();
                case 'last7days':
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    return payDate >= sevenDaysAgo && payDate <= today;
                case 'last30days':
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    return payDate >= thirtyDaysAgo && payDate <= today;
                case 'thisMonth':
                    return (
                        payDate.getMonth() === today.getMonth() &&
                        payDate.getFullYear() === today.getFullYear()
                    );
                case 'lastMonth':
                    const lastMonth = new Date();
                    lastMonth.setMonth(today.getMonth() - 1);
                    return (
                        payDate.getMonth() === lastMonth.getMonth() &&
                        payDate.getFullYear() === lastMonth.getFullYear()
                    );
                case 'last3Months':
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(today.getMonth() - 3);
                    return payDate >= threeMonthsAgo && payDate <= today;
                case 'thisYear':
                    return payDate.getFullYear() === today.getFullYear();
                case 'lastYear':
                    return payDate.getFullYear() === today.getFullYear() - 1;
                default:
                    return true; // No filter applied
            }
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handlePrintSale = () => {
        const printContents = document.getElementById('invoicesale').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    const handlePrintOrder = () => {
        const printContents = document.getElementById('invoiceorder').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    const handlePrintReturn = () => {
        const printContents = document.getElementById('invoicereturn').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    // Apply the filter
    const filteredPurchases = filterPurchases();
    const filteredOrder = filterOrderDetail();
    const filteredOrderReturn = filterOrderReturn();


    // Calculate total amount based on filtered data usnt purchase
    const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount_total), 0);
    const Totalamountdiscount = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount_discount), 0);
    const TotalAmountPayMent = filteredPurchases.reduce((sum, purchase) => sum + parseFloat(purchase.amount_pay), 0);
    const TotalamountDi = totalAmount - TotalAmountPayMent;



    ////  Calculate total amount based on filtered data usning order detail
    const ordertotalAmount = filteredOrder.reduce((sum, purchase) => sum + parseFloat(purchase.total_amount_dola), 0);
    const ordertotalAmountUSD = filteredOrder
        .filter(order => order.type_currency === 'usd')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const ordertotalAmountKHR = filteredOrder
        .filter(order => order.type_currency === 'khr')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const ordertotalAmountBTh = filteredOrder
        .filter(order => order.type_currency === 'thb')
        .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const ordertotalAmounDiscount = filteredOrder.reduce((sum, purchase) => sum + parseFloat(purchase.discount), 0);


    const ordertotalPamentUSD = filteredOrder
        .filter(order => order.type_currency === 'usd')
        .reduce((sum, order) => sum + parseFloat(order.balance_amount), 0);
    const ordertotalPaymentKHR = filteredOrder
        .filter(order => order.type_currency === 'khr')
        .reduce((sum, order) => sum + parseFloat(order.balance_amount), 0);
    const ordertotalPamentBTh = filteredOrder
        .filter(order => order.type_currency === 'thb')
        .reduce((sum, order) => sum + parseFloat(order.balance_amount), 0);

    const orderTotalamountDiUSD = ordertotalAmountUSD - ordertotalPamentUSD;
    const orderTotalamountDiKHR = ordertotalAmountKHR - ordertotalPaymentKHR;
    const orderTotalamountDiTHB = ordertotalAmountBTh - ordertotalPamentBTh;

    //// customer return product
    const Cu_returnRateTOUSD = filteredOrderReturn.reduce((sum, purchase) => sum + parseFloat(purchase.balance_usd), 0);
    const Cu_returnamount_USD = filteredOrderReturn
        .filter(order => order.type_currency === 'usd')
        .reduce((sum, order) => sum + parseFloat(order.balance), 0);
    const Cu_returnamount_THB = filteredOrderReturn
        .filter(order => order.type_currency === 'thb')
        .reduce((sum, order) => sum + parseFloat(order.balance), 0);
    const Cu_returnamount_KHR = filteredOrderReturn
        .filter(order => order.type_currency === 'khr')
        .reduce((sum, order) => sum + parseFloat(order.balance), 0);




    return (
        <div>
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0 px-4 sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">
                    <div className=' items-center gap-2 pb-5 print:hidden'>
                        <p className='text-xl font-bold font-NotoSansKhmer'>របាយការណ៍ ទិញ & លក់</p>

                        <div className='flex justify-end'>
                            <select className='input_text w-[370px] font-NotoSansKhmer text-md' value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                                <option value="">ទាងអស់</option>
                                <option value="today">ថ្ងៃនេះ</option>
                                <option value="yesterday">ម្សិលមិញ</option>
                                <option value="last7days">7 ថ្ងៃចុងក្រោយ</option>
                                <option value="last30days">30 ថ្ងៃចុងក្រោយ</option>
                                <option value="thisMonth">ខែនេះ</option>
                                <option value="lastMonth">1 ខែចុងក្រោយ</option>
                                <option value="last3Months">3 ខែចុងក្រោយ</option>
                                <option value="thisYear">ឆ្នាំនេះ</option>
                                <option value="lastYear">ឆ្នាំមុន</option>

                            </select>
                        </div>
                    </div>
                    <div className='grid md:grid-cols-2 grid-cols-1 print:grid-cols-1 gap-4'>
                        <div className='bg-slate-200 print:bg-white print:drop-shadow-none rounded p-4 drop-shadow' id='invoicesale'>
                            <div className='bg-blue-600/50 py-2 px-8'>
                                <p className='text-xl'>ការទិញ</p>
                            </div>
                            <div className=" text-lg font-bold">
                                <table>
                                    <tr>
                                        <td className='text-center  print:text-start'>ទិញសរុប</td>
                                        <td className='text-center print:text-start'>{totalAmount.toFixed(2)} $</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>ទិញបញ្ចុះតម្លៃសរុប</td>
                                        <td className='text-center print:text-start'>{Totalamountdiscount.toFixed(2)} $</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>ប្រាក់បានបង់សរុប</td>
                                        <td className='text-center print:text-start'>{TotalAmountPayMent.toFixed(2)} $</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>ទិញជំពាក់</td>
                                        <td className='text-center print:text-start'>{TotalamountDi.toFixed(2)} $</td>
                                    </tr>
                                </table>

                            </div>

                            <div className="flex justify-end my-6 print:hidden">
                                <button
                                    className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                    onClick={handlePrintSale}
                                    type="button"
                                >
                                    <IoPrint />
                                </button>
                            </div>
                        </div>
                        <div className='bg-slate-200 print:bg-white print:drop-shadow-none rounded p-4 drop-shadow' id='invoiceorder'>
                            <div className='bg-blue-600/50 py-2 px-8'>
                                <p className='text-xl'>ការលក់</p>
                            </div>
                            <div className=" text-lg font-bold">
                                <table>
                                    <tr>
                                        <td className='text-center print:text-start'>លក់សរុបទាំងអស់ជាដុល្លា</td>
                                        <td className='text-center print:text-start'>{ordertotalAmount.toFixed(2)} $</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>លក់សរុប</td>
                                        <td className='text-center print:text-start'>
                                            <span> {ordertotalAmountUSD.toFixed(2)} $</span><br />
                                            <span>{ordertotalAmountKHR.toFixed(2)} រៀល</span><br />
                                            <span>{ordertotalAmountBTh.toFixed(2)} បាត</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>លក់បញ្ចុះសរុប</td>
                                        <td className='text-center print:text-start'>{ordertotalAmounDiscount.toFixed(2)} $</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>លក់ប្រាក់បានបង់សរុប</td>
                                        <td className='text-center print:text-start'>
                                            <span> {ordertotalPamentUSD.toFixed(2)} $</span><br />
                                            <span>{ordertotalPaymentKHR.toFixed(2)} រៀល</span><br />
                                            <span>{ordertotalPamentBTh.toFixed(2)} បាត</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start' >លក់ប្រាក់ជុំពាក់</td>
                                        <td className='text-center print:text-start'>
                                            <span> {orderTotalamountDiUSD.toFixed(2)} $</span><br />
                                            <span>{orderTotalamountDiKHR.toFixed(2)} រៀល</span><br />
                                            <span>{orderTotalamountDiTHB.toFixed(2)} បាត</span>
                                        </td>
                                    </tr>
                                </table>

                            </div>
                            <div className="flex justify-end pt-3 print:hidden">
                                <button
                                    className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                    onClick={handlePrintOrder}
                                    type="button"
                                >
                                    <IoPrint />
                                </button>
                            </div>
                        </div>
                        <div className='bg-slate-200 print:bg-white print:drop-shadow-none rounded p-4 drop-shadow' id='invoicereturn'>
                            <div className='bg-blue-600/50 py-2 px-8'>
                                <p className='text-xl'>ទិញប្តូរយកវិញ</p>
                            </div>
                            <div className="text-lg font-bold">
                                <table>
                                    <tr>
                                        <td className='text-center print:text-start'>សរុបទាំងអស់ជាដុល្លា</td>
                                        <td className='text-center print:text-start'>{Cu_returnRateTOUSD.toFixed(2)} $</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center print:text-start'>សរុប</td>
                                        <td className='text-center print:text-start'>
                                            <span> {Cu_returnamount_USD.toFixed(2)} $</span><br />
                                            <span>{Cu_returnamount_KHR.toFixed(2)} រៀល</span><br />
                                            <span>{Cu_returnamount_THB.toFixed(2)} បាត</span>
                                        </td>
                                    </tr>
                                </table>

                            </div>
                            <div className="flex justify-end my-6 print:hidden">
                                <button
                                    className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                    onClick={handlePrintReturn}
                                    type="button"
                                >
                                    <IoPrint />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end my-6 print:hidden">
                        <button
                            className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                            onClick={handlePrint}
                            type="button"
                        >
                            <IoPrint /> <span>បោះពុម្ភ</span>
                        </button>
                    </div>

                    {filteredPurchases.length === 0 && <p className="mt-4 text-center print:text-start">No data found</p>}
                </div>
            </div>
        </div>
    );
}

export default SaleAndPuchase;
