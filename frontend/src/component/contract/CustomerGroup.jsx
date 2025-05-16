
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaLayerGroup, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {API_URL} from '../../service/api'

const CustomerGroup = () => {
    const [group_Names, setGroup_Names] = useState("");
    const [discount, setDiscount] = useState("");
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState('');
    const [userLoginNames, setUserLoginNames] = useState('');

    //// paginate and search data
    const [group_customer, setGroup_customer] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        getAllGroupCustomer();
    }, [page, limit, searchQuery]);

    // get all group_customer add paginate and search
    const getAllGroupCustomer = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/group_customer`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });
            setGroup_customer(response.data.group_customer);
            console.log(response.data)
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (error) {
            setError('Error fetching categories data');
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
    const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedgroup_customerId, setSelectedgroup_customerId] = useState(null);
    // modal insert
    const openInsertModal = () => {
        setIsInsertModalOpen(true);
    };
    // modal update 
    const openUpdateModal = cat => {
        setSelectedgroup_customerId(cat.id);
        setGroup_Names(cat.group_names);
        setDetail(cat.detail);
        setDiscount(cat.discount);
        setIsUpdateModalOpen(true);
    };
    // modal update 
    const UpdateGroup_Customer = async e => {
        e.preventDefault();
        setError('');
        const values = {
            group_names: group_Names,
            discount: discount,
            detail: detail,
            user_at: userLoginNames
        }
        try {
            await axios.put(`${API_URL}/api/group_customer/${selectedgroup_customerId}`, values);
            toast.success('កែប្រែក្រុមបានដោយជោគជ័យ', { autoClose: 3000 });
            getAllGroupCustomer();
            setIsUpdateModalOpen(false);
            setSelectedgroup_customerId(null);
            setDetail('');
            setDiscount("");
            setGroup_Names("");
        } catch (err) {
            // console.error(err);
            // toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
            console.error(err);
            const errorMessage = err.response?.data?.message || 'សូមលោកព្យាយាមម្ដងទៀត !';
            toast.error(errorMessage, { autoClose: 3000 });
        }
    };


    // modal delete
    const openDeleteModal = cat => {
        setSelectedgroup_customerId(cat.id);
        setIsDeleteModalOpen(true);
    };

    // modale delete
    const deletegroup_customer = async () => {
        if (selectedgroup_customerId) {
            try {
                await axios.delete(`${API_URL}/api/group_customer/${selectedgroup_customerId}`);
                toast.success('លុបក្រុមបានដោយជោគជ័យ', { autoClose: 3000 });
                getAllGroupCustomer();
                setIsDeleteModalOpen(false);
                setSelectedgroup_customerId(null);
            } catch (err) {
                console.error(err);
                toast.error('ឈ្មោះនេះនេះមិនអាចលុបបានទេ !', { autoClose: 3000 });
            }
        }
    };

    // greate group_customer
    const Creategroup_customer = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            group_names: group_Names,
            discount: discount,
            detail: detail,
            user_at: userLoginNames
        }
        try {
            const res = await axios.post(`${API_URL}/api/group_customer`, values);
            console.log(res.data);
            toast.success('បង្កើតក្រុមបានដោយជោគជ័យ ', { autoClose: 3000 });
            setDetail('');
            setDiscount("");
            setGroup_Names("");
            getAllGroupCustomer();
            setIsInsertModalOpen(false);
        } catch (err) {
            // console.error(err);
            // toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
            console.error(err);
            const errorMessage = err.response?.data?.message || 'សូមលោកព្យាយាមម្ដងទៀត !';
            toast.error(errorMessage, { autoClose: 3000 });
        }
    };

    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };
    return (
        <div className='p-4 border'>
            <div className="flex items-center gap-2 mb-3 ">
                <p><FaLayerGroup className="text-lg " /></p>
                <p className="font-bold font-NotoSansKhmer ">តារាងបញ្ជីក្រុម</p>
            </div>
            <div className="flex justify-end">
                <button className="button_only_submit" onClick={openInsertModal}>+ បង្កើតក្រុមថ្មី</button>
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
                        className="input_text w-[300px]" placeholder="ស្វែងរកក្រុម..." />
                </div>
            </div>
            <div className="relative h-screen overflow-x-auto scrollbar-hidden">
                <AnimatePresence>
                    <table className="min-w-full table-auto">
                        <thead className="text-white bg-blue-600/95">
                            <tr className="font-bold font-NotoSansKhmer">
                                <th className="px-4 py-2 ">លេខរៀង</th>
                                <th className="px-4 py-2 ">ឈ្មោះក្រុម</th>
                                <th className="px-4 py-2 ">បញ្ចុំតម្លៃថេរ</th>
                                <th className="px-4 py-2 ">ព័ត៌មានលម្អិតក្រុម</th>
                                <th className="px-4 py-2 ">បានបន្ថែមដោយ</th>
                                <th className="px-4 py-2 text-center ">សកម្មភាព</th>

                            </tr>
                        </thead>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : group_customer.length === 0 ? (
                            <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                        ) : (
                            <tbody>
                                {group_customer.map((customer, index) => (
                                    <motion.tr
                                        key={customer.id}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={rowAnimation}
                                        transition={{ duration: 0.3 }}
                                        className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110">
                                        <td className="px-4 py-1 ">{index + 1}</td>
                                        <td className="px-4 py-1">{customer.group_names}</td>
                                        <td className="px-4 py-1">{customer.discount} $</td>
                                        <td className="px-4 py-1">{customer.detail || 'N/A'}</td>
                                        <td className="px-4 py-1">{customer.user_at}</td>
                                        <td className="flex px-4 space-x-2">
                                            <button
                                                onClick={() => openUpdateModal(customer)}
                                                className='flex p-2 text-xs text-white bg-blue-500'                        >
                                                <FaPencilAlt className='text-white' />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(customer)}
                                                className='flex p-2 text-xs text-white bg-red-500'
                                            >
                                                <MdDelete className='text-white' /> 
                                            </button>
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

            {/* Insert Modal */}
            <AnimatePresence>
                {isInsertModalOpen && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="max-w-2xl modal_center">
                            <div className="modal_title">
                                <h3 className="">អតិជន</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={Creategroup_customer}>
                                    <div className='grid grid-cols-2 gap-3'>

                                        <div className="col-span-1 gap-2">
                                            <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                                ឈ្មោះក្រុម
                                            </label>
                                            <input
                                                type="text"

                                                value={group_Names}
                                                onChange={(e) => setGroup_Names(e.target.value)}
                                                className="input_text"
                                                required
                                                placeholder="ឈ្មោះក្រុម"
                                            />
                                        </div>
                                        <div className="col-span-1 gap-2">
                                            <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                                បញ្ចុំតម្លៃជាថេរ
                                            </label>
                                            <input
                                                type="number"
                                                id="email"
                                                required
                                                value={discount}
                                                onChange={(e) => setDiscount(e.target.value)}
                                                className="input_text"
                                                placeholder="0.00$"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 gap-3 mt-3">
                                        <label htmlFor="description" className="font-bold font-NotoSansKhmer">
                                            ពិពណ៌នា
                                        </label>
                                        <textarea
                                            id="description"
                                            value={detail}
                                            onChange={(e) => setDetail(e.target.value)}
                                            className="w-full py-5 input_text"
                                            placeholder="ពិពណ៌នា"
                                        />
                                    </div>
                                    <div className="flex justify-end my-3">
                                        <button type="submit" className="button_only_submit">រក្សាទុក</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Delete Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="max-w-sm modal_center">
                            <div className="modal_title">
                                <h3 className="">លុបប្រក្រុម</h3>

                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-sm ">
                                តើអ្នកប្រាកដថាចង់លុប ក្រុមអតិជន នេះទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
                                </p>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        className="button_only_close"
                                        onClick={() => setIsDeleteModalOpen(false)}
                                    >
                                        មិនលុប
                                    </button>
                                    <button
                                        type="button"
                                        className="button_only_submit"
                                        onClick={deletegroup_customer}
                                    >
                                        លុប
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Update Modal */}
            <AnimatePresence>
                {isUpdateModalOpen && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="max-w-xl modal_center">
                            <div className="modal_title">
                                <h3 className="">កែប្រែក្រុម</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />

                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={UpdateGroup_Customer}>

                                    <div className='grid grid-cols-2 gap-3'>

                                        <div className="col-span-1 gap-2">
                                            <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                                ឈ្មោះក្រុម
                                            </label>
                                            <input
                                                type="text"

                                                value={group_Names}
                                                onChange={(e) => setGroup_Names(e.target.value)}
                                                className="input_text"
                                                required
                                                placeholder="ឈ្មោះក្រុម"
                                            />
                                        </div>
                                        <div className="col-span-1 gap-2">
                                            <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                                បញ្ចុំតម្លៃជាថេរ
                                            </label>
                                            <input
                                                type="number"
                                                id="email"
                                                required
                                                value={discount}
                                                onChange={(e) => setDiscount(e.target.value)}
                                                className="input_text"
                                                placeholder="0.00$"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 gap-3 mt-3">
                                        <label htmlFor="description" className="font-bold font-NotoSansKhmer">
                                            ពិពណ៌នា
                                        </label>
                                        <textarea
                                            id="description"
                                            value={detail}
                                            onChange={(e) => setDetail(e.target.value)}
                                            className="w-full py-5 input_text"
                                            placeholder="ពិពណ៌នា"
                                        />
                                    </div>
                                    <div className="flex justify-end my-3">
                                        <button type="submit" className="button_only_submit">រក្សាទុក</button>
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

export default CustomerGroup;
