
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


const Dashboard = () => {
    const [error, setError] = useState('');

    //// paginate and search data
    const [purchases, setPuchases] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [userRol, setUserRol] = useState('');

    useEffect(() => {
        setUserRol(localStorage.getItem('user_rol') || '');
        getAllPuchase();
    }, [page, limit, searchQuery]);

    const getAllPuchase = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/purchase/puchase`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });

            console.log(response.data); // Debugging: Check the response structure

            if (response.data && Array.isArray(response.data.purchase)) {
                setPuchases(response.data.purchase);
                setTotalPages(response.data.totalPages || 1); // Ensure totalPages has a fallback
                setError(null);
            } else {
                setError('Invalid data structure received from the API');
            }
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
        setSelectedpurchasesId(cat.purchasedetail_id);
        setStatus(cat.status);
        setIsModalUpdateStatus(true);
    };



    // const today = new Date().toISOString().split('T')[0];
    const today = new Date();
    const [IsModalDelete, setIsModalDelete] = useState(false);
    const [createDate, setCreateDate] = useState('');

    // modal update 
    const openDeletePurchase = cat => {
        setSelectedpurchasesId(cat.purchasedetail_id);
        // setCreateDate(cat.create_at);
        setCreateDate(cat.purchase_date);
        setIsModalDelete(true);
    };


    const deletePurchase = async () => {
        if (selectedpurchasesId) {
            const createDateObj = new Date(createDate);
            const expiryDate = new Date(createDateObj);
            expiryDate.setDate(createDateObj.getDate() + 45);

            // Compare today's date with expiryDate
            if (today < expiryDate) {
                toast.error('មិនអាចលុបបានទេក្នុងរយៈពេល 45 ថ្ងៃនៃការបង្កើត!', { autoClose: 3000 });
                // setIsModalDelete(false); // Close the modal
                // setSelectedpurchasesId(null)
            } else {
                try {
                    // Proceed with deleting the purchase if it's more than 30 days
                    await axios.delete(`${API_URL}/api/purchase/${selectedpurchasesId}`);
                    toast.success('Successfully deleted!', { autoClose: 3000 });
                    setIsModalDelete(false); // Close the modal
                    getAllPuchase();
                } catch (err) {
                    console.error(err);
                    toast.error('An error occurred. Please try again!', { autoClose: 3000 });
                }
            }
        }
    };



    // modal update 
    const UpdatePurchase = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            status: status,
        };
        try {
            await axios.put(`${API_URL}/api/purchase/status/${selectedpurchasesId}`, values);
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
                    <p className="font-bold font-NotoSansKhmer ">តារាងបញ្ជីទំនិញ</p>
                </div>
                <div className="flex justify-end">
                    {(userRol === 'superadmin' || userRol === 'admin') ? (
                        <Link className="button_only_submit" to="/createpurchase">
                            + បង្កើតទំនិញថ្មី
                        </Link>
                    ) : (
                        <span className="cursor-not-allowed button_only_submit">
                            + បង្កើតទំនិញថ្មី
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between my-3">
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
                            className="input_text w-[300px]" placeholder="ស្វែងរកទំនិញ....." />
                    </div>
                </div>
                <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                    <AnimatePresence>
                        <table className="min-w-full table-auto">
                            <thead className="text-white bg-blue-600/95 text-sm">
                                <tr className="font-bold font-NotoSansKhmer">
                                    <th className="px-4 py-2 ">លេខរៀង</th>
                                    <th className="px-4 py-2 ">កាលបរិច្ឆេទ</th>
                                    <th className="px-4 py-2 ">អ្នកផ្គត់ផ្កង់</th>
                                    <th className="px-4 py-2 ">ចំនួនដែលបានបន្ថែម</th>
                                    <th className="px-4 py-2 ">ស្ថានភាពទិញ</th>
                                    <th className="px-4 py-2 ">ពន្ធ</th>
                                    <th className="px-4 py-2 ">បញ្ចុះតម្លៃ</th>
                                    <th className="px-4 py-2 ">សរុប</th>
                                    <th className="px-4 py-2 ">បានបង់សរុប</th>
                                    <th className="px-4 py-2 ">ប្រាក់នៅជុំពាក់</th>
                                    <th className="px-4 py-2 ">បន្ថែមដោយ</th>
                                    <th className="px-4 py-2 ">សកម្មភាព</th>

                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : purchases.length === 0 ? (
                                <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                            ) : (
                                <tbody>
                                    {purchases?.map((purchase, index) => (
                                        <motion.tr key={purchase.id}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={rowAnimation}
                                            transition={{ duration: 0.3 }}
                                            className="text-xs duration-100 font-NotoSansKhmer hover:scale-y-110">
                                            <td className="px-4 py-1">{index + 1}</td>
                                            <td className="px-4 py-1 whitespace-nowrap">{formatDateToKhmer(new Date(purchase.purchase_date))}</td>
                                            <td className="px-4 py-1 whitespace-nowrap">{purchase.business_names} {purchase.supplier_name}</td>
                                            <td className="px-4 py-1">{purchase.total_qty}</td>
                                            <td className="px-4 py-1 text-center whitespace-nowrap">
                                                {(userRol === 'superadmin' || userRol === 'admin') ? (
                                                    <div>
                                                        {purchase.status === 'completed' ? (
                                                            <span className='px-1 text-xs text-white bg-green-400 opacity-80 cursor-not-allowed rounded'>
                                                                បានទទួល
                                                            </span>
                                                        ) : (
                                                            <button onClick={() => openUpdateModal(purchase)}>
                                                                {purchase.status === 'active' ? (
                                                                    <span className='px-1 text-xs text-white bg-red-500 rounded '>
                                                                        កំពុងរងចាំ
                                                                    </span>
                                                                ) : purchase.status === 'pending' ? (
                                                                    <span className='px-1 text-xs text-white bg-yellow-500 rounded'>
                                                                        បានបញ្ជាទិញ
                                                                    </span>
                                                                ) : purchase.status === 'completed' ? (
                                                                    <span className='px-1 text-xs text-white bg-green-500 rounded'>
                                                                        បានទទួល
                                                                    </span>
                                                                ) : (
                                                                    <span className='px-1 text-xs text-white bg-gray-500 rounded '>
                                                                        មិនមានស្ថានភាព
                                                                    </span>
                                                                )}
                                                            </button>
                                                        )}

                                                    </div>

                                                ) : (
                                                    <button className='opacity-50 cursor-not-allowed'>
                                                        {purchase.status === 'active' ? (
                                                            <span className='px-1 text-xs text-white bg-red-500 '>
                                                                កំពុងរងចាំ
                                                            </span>
                                                        ) : purchase.status === 'pending' ? (
                                                            <span className='px-1 text-xs text-white bg-yellow-500 rounded'>
                                                                បានបញ្ជាទិញ
                                                            </span>
                                                        ) : purchase.status === 'completed' ? (
                                                            <span className='px-1 text-xs text-white bg-green-500 rounded'>
                                                                បានទទួល
                                                            </span>
                                                        ) : (
                                                            <span className='px-1 text-xs text-white bg-gray-500 rounded'>
                                                                មិនមានស្ថានភាព
                                                            </span>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">{purchase.total_include_tax} $</td>
                                            <td className="px-4 py-1 text-center">{purchase.amount_discount} $</td>
                                            <td className="px-4 py-1">{purchase.total_amount} $</td>
                                            <td className="px-4 py-1 text-center">{purchase.amount_pay} $</td>
                                            <td className="px-4 py-1 text-center">{((purchase.total_amount) - (purchase.amount_pay)).toFixed(2)} $</td>
                                            <td className="px-4 py-1 text-center">{purchase.user_at || 'Unknown'}</td>
                                            {(userRol === 'superadmin' || userRol === 'admin') ? (
                                                <td className="flex px-4 space-x-2">
                                                    <button
                                                        className='p-2 bg-red-500 '
                                                        onClick={() => openDeletePurchase(purchase)}
                                                    >
                                                        <MdDelete className='text-white' />
                                                    </button>
                                                    {userRol === 'superadmin' && (
                                                        <Link className="p-2 bg-blue-500" to={`/purchase/${purchase.purchasedetail_id}`}>
                                                            <FaPencilAlt className='text-white' />
                                                        </Link>
                                                    )}

                                                    {purchase.status === 'completed' ? (
                                                        <span className="p-2 bg-blue-500 opacity-50 cursor-not-allowed">
                                                            <FaPencilAlt className='text-white' />
                                                        </span>
                                                    ) : (
                                                        <Link className="p-2 bg-blue-500" to={`/purchase/${purchase.purchasedetail_id}`}>
                                                            <FaPencilAlt className='text-white' />
                                                        </Link>
                                                    )}

                                                    <Link
                                                        to={`/createpurchase/${purchase.purchasedetail_id}`}
                                                        className="flex items-center gap-1 p-2 font-bold text-white bg-green-500 hover:bg-green-400"

                                                    >
                                                        <IoPrint />
                                                    </Link>
                                                </td>
                                            ) : (
                                                <td className="flex px-4 space-x-2">
                                                    <button
                                                        className='p-2 bg-red-500 opacity-50 cursor-not-allowed'
                                                    >
                                                        <MdDelete className='text-white' />
                                                    </button>
                                                    <span className="p-2 bg-blue-500 opacity-50 cursor-not-allowed ">
                                                        <FaPencilAlt className='text-white' />
                                                    </span>

                                                    <Link
                                                        to={`/createpurchase/${purchase.purchasedetail_id}`}
                                                        className="flex items-center gap-1 p-2 font-bold text-white bg-green-500 hover:bg-green-400"
                                                    >
                                                        <IoPrint />
                                                    </Link>
                                                </td>
                                            )}
                                        </motion.tr>

                                    ))}
                                </tbody>
                            )}

                            <motion.tr
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={rowAnimation}
                                transition={{ duration: 0.3 }}
                                className='bg-gray-300'>
                                <td colSpan="4" className="h-20 font-bold text-center">សរុប :</td>
                                <td>
                                    {purchases.filter(purchase => purchase.status === 'active').length > 0 && (
                                        <span className="text-red-500">
                                            កំពុងរងចាំ: {purchases.filter(purchase => purchase.status === 'active').length}
                                        </span>
                                    )}
                                    <br />
                                    {purchases.filter(purchase => purchase.status === 'pending').length > 0 && (
                                        <span className="text-yellow-500">
                                            បានបញ្ជាទិញ: {purchases.filter(purchase => purchase.status === 'pending').length}
                                        </span>
                                    )}
                                    <br />
                                    {purchases.filter(purchase => purchase.status === 'completed').length > 0 && (
                                        <span className="text-green-500">
                                            បានទទួល: {purchases.filter(purchase => purchase.status === 'completed').length}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-1 font-bold">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.total_include_tax) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td className="px-4 py-1 font-bold">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.amount_discount) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>

                                <td className="px-4 py-1 font-bold">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.total_amount) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>

                                <td className="px-4 py-1 font-bold">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.amount_pay) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td className="px-4 py-1 font-bold">
                                    {purchases
                                        .reduce((total, customer) => total + ((Number(customer.total_amount) - (Number(customer.amount_pay))) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td colSpan="3"></td>
                            </motion.tr>
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
            {/* update ststus */}
            <AnimatePresence>
                {IsModalUpdateStatus && (
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="relative w-full max-w-lg mt-20 bg-white shadow dark:bg-gray-700">
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
                        <div className="max-w-sm modal_center">
                            <div className="modal_title">
                                <h3 className="">លុបទំនិញ</h3>
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
    );
};

export default Dashboard;
