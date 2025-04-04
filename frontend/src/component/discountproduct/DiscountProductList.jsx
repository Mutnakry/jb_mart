
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../pagination/Pagination';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { IoPrint } from 'react-icons/io5';
import { API_URL } from '../../service/api'
import Navbar from '../Navbar'


const Dashboard = () => {
    const [error, setError] = useState('');
    const [DiscountProducts, setDiscountProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [userRol, setUserRol] = useState('');

    useEffect(() => {
        setUserRol(localStorage.getItem('user_rol') || '');
        getAllPuchase();
    }, []);

    const getAllPuchase = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/product_discount`);

            console.log(response.data);
            setDiscountProducts(response.data)
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.error || 'Error fetching categories data');
        } finally {
            setLoading(false);
        }
    };

    // const today = new Date().toISOString().split('T')[0];
    const valueTotay = new Date().toISOString().split('T')[0];
    const today = new Date();
    const [IsModalDelete, setIsModalDelete] = useState(false);
    const [selectedpurchasesId, setSelectedpurchasesId] = useState(null);
    const [startDate, setStartDate] = useState('');

    // modal update 
    const openDeletePurchase = cat => {
        setSelectedpurchasesId(cat.id);
        setStartDate(cat.date_start);
        setIsModalDelete(true);
    };

    const deletePurchase = async () => {
        if (selectedpurchasesId) {
            const createDateObj = new Date(startDate);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0); // Reset time to compare only dates
            createDateObj.setHours(0, 0, 0, 0); // Ensure `startDate` is also reset to date only

            // Prevent deletion if `createDateObj` is today or in the past
            if (createDateObj <= todayDate) {
                toast.error(
                    <div>
                        មិនអាចលុបបានទេ! <br />
                        {startDate} <br />
                        កាលបរិច្ឆេទបញ្ចុះតម្លៃចាប់ផ្តើមហើយ
                    </div>,
                    { autoClose: 3000 }
                );
                return;
            }

            try {
                // Proceed with deleting the purchase if it's allowed
                await axios.delete(`${API_URL}/api/product_discount១/${selectedpurchasesId}`);
                toast.success('Successfully deleted!', { autoClose: 3000 });
                setIsModalDelete(false); // Close the modal
                getAllPuchase();
            } catch (err) {
                console.error(err);
                toast.error('សូមព្យាយាមម្តងទៀត!', { autoClose: 3000 });
            }
        }
    };

    const [filteredDetails, setFilteredDetails] = useState([]);
    // const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const handleFilter = () => {
        if (!startDate || !endDate) {
            toast.error('សូមជ្រើសរើសថ្ងៃចាប់ផ្តើម និងថ្ងៃបញ្ចប់', { autoClose: 3000 });
            return;
        }

        const filteredProducts = DiscountProducts.filter(product => {
            const productStartDate = new Date(product.date_start);
            const productEndDate = new Date(product.date_end);
            const selectedStartDate = new Date(startDate);
            const selectedEndDate = new Date(endDate);

            // Check if the product's date range overlaps with the selected range
            return (
                productStartDate <= selectedEndDate && productEndDate >= selectedStartDate
            );
        });

        setFilteredDetails(filteredProducts); // Update the filtered results
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
                <div className=' Div_bar bg-white'>
                    <div className='border p-4 border-gray-200 dark:border-gray-700'>
                        <div >
                            <p><FaClipboardList className="text-lg " /></p>
                            <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីប្រភេទទំនិញ</p>
                        </div>
                        <div className="flex justify-end">
                            {(userRol === 'superadmin' || userRol === 'admin') ? (
                                <Link className="button_only_submit" to="/create_discount_product">
                                    + បង្កើតម៉ាកយីហោថ្មី
                                </Link>
                            ) : (
                                <span className="button_only_submit cursor-not-allowed">
                                    + បង្កើតម៉ាកយីហោថ្មី
                                </span>
                            )}
                        </div>

                        <div className="md:flex justify-between items-center my-3">

                            {/* <div>
                                <input type="text"
                                    className="input_text w-[300px]" placeholder="ស្វែងរកម៉ាកយីហោ..." />
                            </div> */}

                            <div className="my-4 print:hidden flex justify-between">

                                <div className="md:flex justify-center space-x-2 space-y-2">
                                    <div className="space-y-2">
                                        <label htmlFor="startDate">ថ្ងៃទីចាប់ផ្ដើម</label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            className="input_text"
                                            value={startDate || valueTotay}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="endDate">ថ្ងៃទីបញ្ខប់</label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            className="input_text"
                                            min={startDate}
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-end space-x-4">
                                        <button
                                            onClick={handleFilter}
                                            className={`px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
                                            disabled={loading}
                                        >
                                            {loading ? 'ទាញយក...' : 'ទាញយក'}
                                        </button>
                                        <button
                                            onClick={() => setFilteredDetails(DiscountProducts)}
                                            className="px-8 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                                        >
                                            បង្ហាញទាំងអស់
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                            <AnimatePresence>
                                <table className="min-w-full table-auto">
                                    <thead className="bg-blue-600/95 text-white">
                                        <tr className="font-NotoSansKhmer font-bold">
                                            <th className=" px-4 py-2">លេខរៀង</th>
                                            <th className=" px-4 py-2">ឈ្មោះ</th>
                                            <th className=" px-4 py-2">ឈ្មោះផលិតផល</th>
                                            <th className=" px-4 py-2">ថ្ងៃចាប់ផ្ដើម</th>
                                            <th className=" px-4 py-2">ថ្ងៃចាប់បញ្ចប់</th>
                                            <th className=" px-4 py-2">សរុបបញ្ចុះតម្លៃ</th>
                                            <th className=" px-4 py-2">បន្ថែមដោយ</th>
                                            <th className=" px-4 py-2">សកម្មភាព</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(filteredDetails.length > 0 ? filteredDetails : DiscountProducts).map((purchase, index) => (
                                            <motion.tr key={purchase.id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={rowAnimation}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100">
                                                <td className="px-4 py-1">{index + 1}</td>
                                                <td className="px-4 py-1">{purchase.detail_name}</td>
                                                <td className="px-4 py-1">{purchase.pro_names}</td>
                                                <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.date_start))}</td>
                                                <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.date_end))}</td>
                                                <td className="px-4 py-1">{purchase.total_discount} $</td>
                                                <td className="px-4 py-1 text-center">{purchase.user_at || 'Unknown'}</td>
                                                <td className="px-4 space-x-2 flex">
                                                    <button
                                                        className='bg-red-300 p-2 '
                                                        onClick={() => openDeletePurchase(purchase)}
                                                    >
                                                        <MdDelete className='text-red-500' />
                                                    </button>
                                                    <Link
                                                        to={`/create_discount_product/${purchase.product_discount_detail_id}`}
                                                        className="flex items-center gap-1 p-2 font-bold bg-blue-400 text-white"
                                                    >
                                                        <FaPencilAlt />
                                                    </Link>
                                                    <Link
                                                        to={`/createpurchase/${purchase.id}`}
                                                        className="flex items-center gap-1 p-2 font-bold text-white bg-green-300 hover:bg-green-400"
                                                    >
                                                        <IoPrint />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>

                                </table>
                            </AnimatePresence>

                        </div>
                    </div>
                </div>
                {/* dlete purchase */}

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
                                    <h3 className="">លុបទំនិញ {startDate}</h3>
                                    <MdClose className='text-2xl cursor-pointer' onClick={() => setIsModalDelete(false)} />
                                </div>
                                <div className="p-4 space-y-4">
                                    <p className="text-md ">
                                        តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            className="button_only_close"
                                            onClick={() => setIsModalDelete(false)}
                                        >
                                            មិនលុប
                                        </button>
                                        <button
                                            type="button"
                                            className="button_only_submit"
                                            onClick={deletePurchase}
                                        >
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
