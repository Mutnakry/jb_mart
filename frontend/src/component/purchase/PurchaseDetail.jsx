import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../pagination/Pagination';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import {API_URL} from '../../service/api'



const Dashboard = () => {
    const [error, setError] = useState('');

    //// paginate and search data
    const [purchases, setPuchases] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        getAllPuchase();
    }, [page, limit, searchQuery]);

    const getAllPuchase = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/purchase/purchasedetail`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });
            setPuchases(response.data.purchase);
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.error || 'Error fetching categories data');
        } finally {
            setLoading(false);
        }
    };

    /// page total
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    //// search data
    const handleSearch = (event) => {
        if (setPage(0)) {
            alert('not found!')
        } else {
            setSearchQuery(event.target.value);
            setPage(1);
        }

    };




    /// show modal insert
    const [IsModalUpdateStatus, setIsModalUpdateStatus] = useState(false);
    const [selectedpurchasesId, setSelectedpurchasesId] = useState(null);
    const [status, setStatus] = useState('');

    // modal update 
    const openUpdateModal = cat => {
        setSelectedpurchasesId(cat.id);
        setStatus(cat.status);
        console.log(cat.status);
        setIsModalUpdateStatus(true);
    };
    // modal update 
    const UpdatePurchase = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            status: status,
        };
        try {
            // await axios.put(`http://localhost:6700/api/purchase/status/${selectedpurchasesId}`, values);
            await axios.put(`${API_URL}/api/purchase/status/96`, values);

            toast.success('កែប្រែស្ថានភាពទិញបានដោយជោគជ័យ', { autoClose: 3000 });
            console.log(status);
            getAllPuchase();
            setIsModalUpdateStatus(false);
            setSelectedpurchasesId(null);
        } catch (err) {
            console.error(err);
            toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
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
                <div className="flex items-center gap-2 ">
                    <p><FaClipboardList className="text-lg " /></p>
                    <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីប្រភេទទំនិញ</p>
                </div>
                <div className="flex justify-end">
                    <Link className="button_only_submit" to="/createpurchase">
                        + បង្កើតម៉ាកយីហោថ្មី
                    </Link>
                </div>

                <div className="flex justify-between items-center my-3">
                    <div className="flex flex-col gap-2 font-bold font-NotoSansKhmer">
                        <label htmlFor="">ច្រោះតាមចំនួន</label>
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="input_text w-[100px]">
                            {[25, 50, 100, 500].map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="input_text w-[300px]" placeholder="ស្វែងរកម៉ាកយីហោ..." />
                    </div>
                </div>
                <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                    <AnimatePresence>
                        <table className="min-w-full table-auto">
                            <thead className="bg-blue-600/95 text-white">
                                <tr className="font-NotoSansKhmer font-bold">
                                    <th className=" px-4 py-2">លេខរៀង</th>
                                    <th className=" px-4 py-2">កាលបរិច្ឆេទ</th>
                                    <th className=" px-4 py-2">ផលិតផល</th>
                                    <th className=" px-4 py-2">ថ្លៃទិញឯកតា</th>
                                    <th className=" px-4 py-2">តម្លៃលក់</th>
                                    <th className=" px-4 py-2">ស្ថានភាពទិញ</th>
                                    <th className=" px-4 py-2">ចំនួនក្នុងស្តុក</th>
                                    <th className=" px-4 py-2">សកម្មភាព</th>

                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : purchases.length === 0 ? ( // Change from purchases.length to purchases.length
                                <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                            ) : (
                                <tbody>
                                    {purchases.map((purchase, index) => (
                                        <motion.tr key={purchase.id}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={rowAnimation}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100">
                                            <td className="px-4 py-1">{index + 1}</td>
                                            <td className="px-4 py-1">{purchase.pay_date} $</td>
                                            <td className="px-4 py-1">{purchase.account_id}</td>
                                            <td className="px-4 py-1">{purchase.paymenttype_id} $</td>
                                            <td className="px-4 py-1">{purchase.amount_total} $</td>
                                            <td className="px-4 py-1">{purchase.amount_discount} $</td>
                                            <td className="px-4 py-1">{purchase.amount_pay} $</td>
                                            <td className="px-4  space-x-2 flex">
                                                <button
                                                    className='bg-red-50 rounded-full p-2 '
                                                >
                                                    <MdDelete className='text-red-500' />
                                                </button>
                                                <Link className="bg-blue-50 rounded-full p-2" to={`/purchase/${purchase.id}`}>
                                                    <FaPencilAlt className='text-blue-500' />
                                                </Link>
                                            </td>

                                        </motion.tr>
                                    ))}
                                </tbody>
                            )}

                        </table>
                    </AnimatePresence>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        limit={limit}
                        setLimit={setLimit}
                    />

                </div>
            </div>
            <AnimatePresence>
                {IsModalUpdateStatus && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative w-full bg-white shadow mt-20 dark:bg-gray-700 max-w-lg">
                            <div className="modal_title">
                                <h3 className="">កែប្រែផលិតផលមកដល់ស្តុក</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsModalUpdateStatus(false)} />
                            </div>
                            <div className="modal_form">
                                <form class="py-6" onSubmit={UpdatePurchase}>
                                    <div class="grid gap-4 mb-4 grid-cols-1">
                                        <div className="col-span-1 space-y-2">
                                            <label htmlFor="" className="font-bold font-NotoSansKhmer">ស្ថានភាព: *</label>
                                            <select
                                                required
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="input_text font-NotoSansKhmer"
                                            >
                                                <option value="completed">បានទទួល</option>
                                                <option value="active">កំពុងរងចាំ</option>
                                                <option value="pending">បានបញ្ជាទិញ</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>

                                        <button
                                            type="submit"
                                            className="button_only_submit "
                                        >
                                            រក្សាទុក្ខ
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
