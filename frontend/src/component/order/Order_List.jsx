import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { API_URL } from '../../service/api';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';
import { IoPrint } from 'react-icons/io5';
import { FaPencilAlt } from "react-icons/fa";

function Order_List() {
    const [orders, setOrders] = useState([]);  // Correct the state name to `orders`
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAllOrder();
    }, []);

    const getAllOrder = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/repay`);
            setOrders(response.data); // Correct the state usage here
            setLoading(false);  // Set loading to false after fetching data
        } catch (error) {
            console.error('Error fetching products:', error);
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };

    return (
        <div>
            <div className=''>
                <div className='flex items-center gap-2 pb-5'>
                    <p className='text-3xl font-bold font-NotoSansKhmer'>របាយកាណ៍លក់ </p>

                </div>
                <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                    <AnimatePresence>
                        <table className="min-w-full table-auto">
                            <thead className="text-white bg-blue-600/95">
                                <tr className="font-bold font-NotoSansKhmer">
                                    <th className="px-4 py-2 ">#</th>
                                    <th className="px-4 py-2 ">កាលបរិច្ឆេទ</th>
                                    <th className="px-4 py-2 ">អតិជន</th>
                                    <th className="px-4 py-2 ">ចំនួន</th>
                                    <th className="px-4 py-2 ">ចំនួនទឺកប្រាក់សរុប</th>
                                    <th className="px-4 py-2 ">ចំនួនទឺកប្រាក់សរុបជា ($)</th>
                                    <th className="px-4 py-2 ">ទឺកប្រាក់ដែលបានបង់</th>
                                    <th className="px-4 py-2 ">នៅនៅខ្វះទឺកប្រាក់</th>
                                    <th className="px-4 py-2 ">បញ្ចុះតម្លៃ</th>
                                    <th className="px-4 py-2 ">ពណ៍នា</th>
                                    <th className="px-4 py-2 ">បន្ថែមដោយ</th>
                                    <th className="px-4 py-2 ">សកម្មភាព</th>
                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : orders.length === 0 ? (
                                <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ</p>
                            ) : (
                                <tbody>
                                    {orders?.map((order, index) => {
                                        // Calculate the remaining amount
                                        const remainingAmount = (Number(order?.total_amount) || 0) - (Number(order?.balance_amount) || 0);

                                        // Conditionally apply bg-red-300 if the remaining amount is negative
                                        const rowClass = remainingAmount < 0 ? 'bg-red-200' : '';

                                        return (
                                            <motion.tr
                                                key={order.order_detail_id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={rowAnimation}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110">

                                                <td className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{index + 1}</td>
                                                <td className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{formatDateToKhmer(new Date(order.date_order))}</td>
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{order.full_names || order.business_names}</td>
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{order.totalqty} {order.unit_names}</td>

                                                <td className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    {order.type_currency === "usd" ? (
                                                        <div>
                                                            <span>{order.total_amount} $</span>
                                                        </div>
                                                    ) : order.type_currency === "khr" ? (
                                                        <div>
                                                            <span>{order.total_amount} រៀល</span>
                                                        </div>
                                                    ) : order.type_currency === "thb" ? (
                                                        <div>
                                                            <span>{order.total_amount} បាត</span>
                                                        </div>
                                                    ) : null}
                                                </td>

                                                <td  className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{order.total_amount_dola} $</td>

                                                <td  className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    {order.type_currency === "usd" ? (
                                                        <div>
                                                            <span>{order.balance_amount} $</span>
                                                        </div>
                                                    ) : order.type_currency === "khr" ? (
                                                        <div>
                                                            <span>{order.balance_amount} រៀល</span>
                                                        </div>
                                                    ) : order.type_currency === "thb" ? (
                                                        <div>
                                                            <span>{order.balance_amount} បាត</span>
                                                        </div>
                                                    ) : null}
                                                </td>

                                                <td  className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    {order.type_currency === "usd" ? (
                                                        <div>
                                                            <span>{remainingAmount} $</span>
                                                        </div>
                                                    ) : order.type_currency === "khr" ? (
                                                        <div>
                                                            <span>{remainingAmount} រៀល</span>
                                                        </div>
                                                    ) : order.type_currency === "thb" ? (
                                                        <div>
                                                            <span>{remainingAmount} បាត</span>
                                                        </div>
                                                    ) : null}
                                                </td>

                                                <td  className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{order.totalDiscount || '0.00'} $</td>
                                                <td  className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{order.description}</td>
                                                <td  className={`px-4 py-1 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{order.user_at || 'Unknown'}</td>

                                                <td  className={`px-4 py-1 flex space-x-2 whitespace-nowrap ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    <span className="p-2 text-white bg-green-500 hover:bg-green-400">
                                                        <IoPrint />
                                                    </span>

                                                    <Link
                                                        to={`/order-Repay/${order.order_detail_id}`}
                                                        className="flex items-center gap-1 p-2 font-bold text-white bg-blue-500"
                                                        // onClick={() => openModalPrintPage(customer)}
                                                    >
                                                        <FaPencilAlt className="text-white" />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}

                                </tbody>
                            )}
                        </table>
                    </AnimatePresence>

                </div>
            </div>
        </div>
        // </div >
    );
}

export default Order_List;
