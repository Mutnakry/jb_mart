
// export default Dashboard;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { IoPrint } from 'react-icons/io5';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { Link } from 'react-router-dom';
import { API_URL } from '../../service/api';
import Navbar from '../Navbar';

const Dashboard = () => {
    const [DiscountProducts, setDiscountProducts] = useState([]);
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userRol, setUserRol] = useState('');
    const [IsModalDelete, setIsModalDelete] = useState(false);
    const [selectedpurchasesId, setSelectedpurchasesId] = useState(null);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    useEffect(() => {
        setUserRol(localStorage.getItem('user_rol') || '');
        getAllPurchase();
    }, []);

    const getAllPurchase = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/product_discount`);
            setDiscountProducts(response.data);
            setFilteredDetails(response.data); // Set initially all
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.error || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const openDeletePurchase = (cat) => {
        setSelectedpurchasesId(cat.product_discount_detail_id);
        setSelectedStartDate(cat.date_start);
        setIsModalDelete(true);
    };

    const deletePurchase = async () => {
        if (selectedpurchasesId) {
            const createDateObj = new Date(selectedStartDate);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            createDateObj.setHours(0, 0, 0, 0);

            if (createDateObj <= todayDate) {
                toast.error(
                    <div>
                        មិនអាចលុបបានទេ! <br />
                        {selectedStartDate} <br />
                        កាលបរិច្ឆេទបញ្ចុះតម្លៃចាប់ផ្តើមហើយ
                    </div>,
                    { autoClose: 3000 }
                );
                return;
            }

            try {
                await axios.delete(`${API_URL}/api/product_discount/${selectedpurchasesId}`);
                toast.success('បានលុបដោយជោគជ័យ!', { autoClose: 3000 });
                setIsModalDelete(false);
                getAllPurchase();
            } catch (err) {
                console.error(err);
                toast.error('ឈ្មោះនេះនេះមិនអាចលុបបានទេ!', { autoClose: 3000 });
            }
        }
    };

    const handleFilter = () => {
        if (!startDate || !endDate) {
            toast.error('សូមជ្រើសរើសថ្ងៃចាប់ផ្ដើម និងថ្ងៃបញ្ចប់', { autoClose: 3000 });
            return;
        }

        const selectedStart = new Date(startDate);
        const selectedEnd = new Date(endDate);

        const results = DiscountProducts.filter(product => {
            const productStart = new Date(product.date_start);
            const productEnd = new Date(product.date_end);
            return productStart <= selectedEnd && productEnd >= selectedStart;
        });

        setFilteredDetails(results);
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setFilteredDetails(DiscountProducts);
    };

    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };

    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
                <div className='Div_bar bg-white'>
                    <div className='border p-4 border-gray-200 dark:border-gray-700'>
                        <div>
                            <p><FaClipboardList className="text-lg" /></p>
                            <p className="font-NotoSansKhmer font-bold">តារាងបញ្ជីប្រភេទទំនិញ</p>
                        </div>

                        <div className="flex justify-end">
                            {(userRol === 'superadmin' || userRol === 'admin') ? (
                                <Link className="button_only_submit" to="/create_discount_product">
                                    + បង្កើតផលិតផលថ្មី
                                </Link>
                            ) : (
                                <span className="button_only_submit cursor-not-allowed">
                                    + បង្កើតផលិតផលថ្មី
                                </span>
                            )}
                        </div>

                        <div className="my-4 print:hidden">
                            <div className="md:flex items-end gap-4">
                                <div>
                                    <label htmlFor="startDate">ថ្ងៃទីចាប់ផ្ដើម</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        className="input_text"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate">ថ្ងៃទីបញ្ចប់</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className="input_text"
                                        value={endDate}
                                        min={startDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <button
                                    onClick={handleFilter}
                                    className="px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                                >
                                    ទាញយក
                                </button>
                                <button
                                    onClick={resetFilters}
                                    className="px-8 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                                >
                                    បង្ហាញទាំងអស់
                                </button>
                            </div>

                            {startDate && endDate && (
                                <p className="text-sm text-gray-600 mt-2">
                                    បង្ហាញលទ្ធផលពី <strong>{startDate}</strong> ដល់ <strong>{endDate}</strong>
                                </p>
                            )}
                        </div>

                        <div className="relative overflow-x-auto h-screen scrollbar-hidden">
                            <AnimatePresence>
                                <table className="min-w-full table-auto">
                                    <thead className="bg-blue-600/95 text-white">
                                        <tr className="font-NotoSansKhmer font-bold">
                                            <th className="px-4 py-2">លេខរៀង</th>
                                            <th className="px-4 py-2">ឈ្មោះ</th>
                                            <th className="px-4 py-2">ឈ្មោះផលិតផល</th>
                                            <th className="px-4 py-2">ថ្ងៃចាប់ផ្ដើម</th>
                                            <th className="px-4 py-2">ថ្ងៃបញ្ចប់</th>
                                            <th className="px-4 py-2">សរុបបញ្ចុះតម្លៃ</th>
                                            <th className="px-4 py-2">បន្ថែមដោយ</th>
                                            <th className="px-4 py-2">សកម្មភាព</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {filteredDetails.map((purchase, index) => (
                                            <motion.tr
                                                key={purchase.id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={rowAnimation}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100"
                                            >
                                                <td className="px-4 py-1">{index + 1}</td>
                                                <td className="px-4 py-1">{purchase.detail_name}</td>
                                                <td className="px-4 py-1">{purchase.pro_names}</td>
                                                <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.date_start))}</td>
                                                <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.date_end))}</td>
                                                <td className="px-4 py-1">{purchase.total_discount} $</td>
                                                <td className="px-4 py-1 text-center">{purchase.user_at || 'Unknown'}</td>
                                                <td className="px-4 py-1 space-x-2 flex">
                                                    {new Date() <= new Date(purchase.date_start) && (
                                                        <button className="bg-red-300 p-2" onClick={() => openDeletePurchase(purchase)}>
                                                            <MdDelete className="text-red-500" />
                                                        </button>
                                                    )}
                                                    {new Date() < new Date(purchase.date_start) && (
                                                        <Link
                                                            to={`/create_discount_product/${purchase.product_discount_detail_id}`}
                                                            className="flex items-center gap-1 p-2 font-bold bg-blue-400 text-white"
                                                        >
                                                            <FaPencilAlt />
                                                        </Link>
                                                    )}
                                                   
                                                    <Link
                                                        to={`/discount_product/${purchase.product_discount_detail_id}`}
                                                        className="p-2 bg-green-600 text-white hover:bg-green-400"
                                                    >
                                                        <IoPrint />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                         */}
                                        {filteredDetails.map((purchase, index) => {
                                            const startDate = new Date(purchase.date_start);
                                            startDate.setHours(0, 0, 0, 0); // Normalize to ignore time

                                            const allowDelete = today <= startDate; // allow delete if today is same or before start
                                            const allowEdit = today < startDate;    // allow edit only if today is strictly before start

                                            return (
                                                <motion.tr
                                                    key={purchase.id}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={rowAnimation}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100"
                                                >
                                                    <td className="px-4 py-1">{index + 1}</td>
                                                    <td className="px-4 py-1">{purchase.detail_name}</td>
                                                    <td className="px-4 py-1">{purchase.pro_names}</td>
                                                    <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.date_start))}</td>
                                                    <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.date_end))}</td>
                                                    <td className="px-4 py-1">{purchase.total_discount} $</td>
                                                    <td className="px-4 py-1 text-center">{purchase.user_at || 'Unknown'}</td>
                                                    <td className="px-4 py-1 space-x-2 flex">
                                                        {/* {allowDelete && (
                                                            <button className="bg-red-300 p-2" onClick={() => openDeletePurchase(purchase)}>
                                                                <MdDelete className="text-red-500" />
                                                            </button>
                                                        )} */}

                                                        {allowEdit && (
                                                            <Link
                                                                to={`/create_discount_product/${purchase.product_discount_detail_id}`}
                                                                className="flex items-center gap-1 p-2 font-bold bg-blue-400 text-white"
                                                            >
                                                                <FaPencilAlt />
                                                            </Link>
                                                        )}
                                                        {new Date() >= new Date(purchase.date_start) && (
                                                            <div className='flex space-x-2'>
                                                                <button
                                                                    className="bg-red-300 p-2 cursor-not-allowed opacity-50"
                                                                    disabled
                                                                >
                                                                    <MdDelete className="text-red-500" />
                                                                </button>
                                                                <button
                                                                    className="flex items-center gap-1 p-2 font-bold bg-blue-400 text-white cursor-not-allowed opacity-50"
                                                                    disabled
                                                                >
                                                                    <FaPencilAlt />
                                                                </button>
                                                            </div>
                                                        )}

                                                        <Link
                                                            to={`/discount_product/${purchase.product_discount_detail_id}`}
                                                            className="p-2 bg-green-600 text-white hover:bg-green-400"
                                                        >
                                                            <IoPrint />
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}

                                    </tbody>
                                </table>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Delete Modal */}
                <AnimatePresence>
                    {IsModalDelete && (
                        <motion.div
                            className="modal"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="modal_center max-w-sm">
                                <div className="modal_title">
                                    <h3>លុបទំនិញ {selectedStartDate}</h3>
                                    <MdClose className="text-2xl cursor-pointer" onClick={() => setIsModalDelete(false)} />
                                </div>
                                <div className="p-4 space-y-4">
                                    <p className="text-md">
                                        តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <button className="button_only_close" onClick={() => setIsModalDelete(false)}>
                                            មិនលុប
                                        </button>
                                        <button className="button_only_submit" onClick={deletePurchase}>
                                            លុប
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;
