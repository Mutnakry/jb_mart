
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
import {API_URL} from '../../service/api'


const Dashboard = () => {
    const [error, setError] = useState('');

    //// paginate and search data
    const [purchases, setPuchases] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);

    useEffect(() => {
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


    const countStatuses = purchases.reduce(
        (acc, purchase) => {
            if (Number(purchase.amount_pay) === 0) {
                acc.noPayment++;
            } else if (Number(purchase.total_amount) === (Number(purchase.amount_pay) + Number(purchase.amount_discount))) {
                acc.fullyPaid++;
            } else if (purchase.amount_pay > 0) {
                acc.partiallyPaid++;
            } else {
                acc.noStatus++;
            }
            return acc;
        },
        { noPayment: 0, fullyPaid: 0, partiallyPaid: 0, noStatus: 0 }
    );

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
                                    <th className=" px-4 py-2">អ្នកផ្គត់ផ្កង់</th>
                                    <th className=" px-4 py-2">ឈ្មោះផលិតផល</th>
                                    <th className=" px-4 py-2">ចំនួនដែលបានបន្ថែម</th>
                                    <th className=" px-4 py-2">សរុបចំនួនដែលបានបន្ថែម</th>
                                    <th className=" px-4 py-2">ស្ថានភាពទិញ</th>
                                    <th className=" px-4 py-2">ពន្ធ</th>
                                    <th className=" px-4 py-2">បញ្ចុះតម្លៃចំនួន</th>
                                    <th className=" px-4 py-2">ទឹកប្រាក់សរុបចំនួន</th>
                                    <th className=" px-4 py-2">បានបង់ទឹកប្រាក់សរុបចំនួន</th>
                                    <th className=" px-4 py-2">នៅនៅខ្វះទឹកប្រាក់ចំនួន</th>
                                    <th className=" px-4 py-2">សកម្មភាព</th>

                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : purchases.length === 0 ? (
                                <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                            ) : (
                                <tbody>
                                    {purchases?.map((purchase, index) => {
                                        const remainingAmount = purchase.total_amount - (Number(purchase.amount_pay) + Number(purchase.amount_discount));
                                        return (
                                            <motion.tr key={purchase.id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={rowAnimation}
                                                transition={{ duration: 0.3 }}
                                                className={`text-sm font-NotoSansKhmer ${remainingAmount > 0 ? 'bg-red-200' : ''}`}
                                            >
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    {index + 1}
                                                </td>
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >
                                                    {formatDateToKhmer(new Date(purchase.purchase_date))}
                                                </td>
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>{purchase.business_names} {purchase.supplier_name}</td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} dangerouslySetInnerHTML={{ __html: purchase.product_names }}></td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} dangerouslySetInnerHTML={{ __html: purchase.grou_qty }}></td>
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >{purchase.total_qty}</td>
                                                <td className={`px-4 py-1 ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    <p >
                                                        {Number(purchase.amount_pay) === 0 ? (
                                                            <span className='text-red-600'>ជុំពាក់</span> // No payment made
                                                        ) : Number(purchase.total_amount) === (Number(purchase.amount_pay) + Number(purchase.amount_discount)) ? (
                                                            <span className='text-green-400'>បង់រួចរាល់</span>
                                                        ) : purchase.amount_pay > 0 ? (
                                                            <span className='text-indigo-600'>បានបង់ខ្លះ</span>
                                                        ) : (
                                                            <span>មិនមានស្ថានភាព</span>
                                                        )}
                                                    </p>
                                                </td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >{purchase.total_include_tax} $</td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >{purchase.amount_discount} $</td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >{purchase.total_amount} $</td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >{purchase.amount_pay} $</td>
                                                <td className={`px-4 py-1 text-center ${remainingAmount > 0 ? 'bg-red-200' : ''}`} >{remainingAmount.toFixed(2)} $</td>
                                                <td className={` ${remainingAmount > 0 ? 'bg-red-200' : ''}`}>
                                                    <Link
                                                        to={`/createpurchase/${purchase.purchasedetail_id}`}
                                                        className="flex items-center gap-1 p-2 w-10 font-bold text-white bg-green-300 hover:bg-green-400"
                                                    >
                                                        <IoPrint />
                                                    </Link>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            )}
                            <motion.tr
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={rowAnimation}
                                transition={{ duration: 0.3 }}
                                className='bg-gray-300'>
                                <td colSpan="6" className="font-bold text-center h-20">សរុប :</td>
                                <td>
                                    <span className='text-red-500'> ជុំពាក់{countStatuses.noPayment}</span><br />
                                    <span className='text-green-600'>បង់រួចរាល់{countStatuses.fullyPaid}</span><br />
                                    <span className='text-purple-600'>បានបង់ខ្លះ{countStatuses.partiallyPaid}</span>

                                </td>
                                <td className="font-bold px-4 py-1">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.total_include_tax) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td className="font-bold px-4 py-1">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.amount_discount) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>

                                <td className="font-bold px-4 py-1">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.total_amount) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>

                                <td className="font-bold px-4 py-1">
                                    {purchases
                                        .reduce((total, customer) => total + (Number(customer.amount_pay) || 0), 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td className="font-bold px-4 py-1">
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
        </div>
    );
};

export default Dashboard;
