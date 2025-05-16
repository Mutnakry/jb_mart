
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaRegThumbsUp, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from '../../service/api'


const SupplierList = () => {
    const [isTypwsupplier, setIsTypwsupplier] = useState("");
    const [customeNames, setCustomeNames] = useState(null);
    const [halfcustomeNames, setHalfSupplierName] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [businessName, setBussinessName] = useState(null);
    const [businessPhone, setBussinessPhone] = useState(null);
    const [supplierId, setSupplierId] = useState(null);
    const [email, setEmail] = useState(null);
    const [description, setDescription] = useState(null);
    const [error, setError] = useState('');
    //// paginate and search data
    const [suppliers, setsupplier] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [userLoginNames, setUserLoginNames] = useState('');
    const [userRol, setUserRol] = useState('');

    useEffect(() => {
        setUserRol(localStorage.getItem('user_rol') || '');
        setUserLoginNames(localStorage.getItem('user_names') || '');
        GetAllsupplier();

    }, [page, limit, searchQuery]);


    // get all supplier add paginate and search
    const GetAllsupplier = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/supplier`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });
            setsupplier(response.data.supplier);
            console.log(response.data)
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (error) {
            setError('Error fetching categories data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setIsTypwsupplier(event.target.value);
        setCustomeNames("");
        setBussinessName("");
        // cleardata();
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
    const [selectedsupplierId, setSelectedsupplierId] = useState(null);
    // modal insert
    const openInsertModal = () => {
        setIsInsertModalOpen(true);
    };
    // Clear Data 
    const cleardata = async () => {
        setIsTypwsupplier("");
        setCustomeNames("");
        setHalfSupplierName("");
        setPhoneNumber("");
        setBussinessName("");
        setBussinessPhone("");
        setSupplierId("");
        setEmail("");
        setDescription("");
    }
    // modal update 
    const openUpdateModal = cat => {
        setSelectedsupplierId(cat.id);
        setIsTypwsupplier(cat.contect_type);
        setCustomeNames(cat.full_names);
        setHalfSupplierName(cat.half_names);
        setPhoneNumber(cat.mobile_phone);
        setBussinessName(cat.business_names);
        setBussinessPhone(cat.contect_phone);
        setEmail(cat.email);
        setDescription(cat.description);
        setIsUpdateModalOpen(true);
    };
    // modal update 
    const Updatesupplier = async e => {
        e.preventDefault();
        setError('');
        setError('');
        const values = {
            contect_type: isTypwsupplier  || null,
            contect_phone: businessPhone  || null,
            mobile_phone: phoneNumber  || null,
            business_names: businessName  || null,
            full_names: customeNames  || null,
            half_names: halfcustomeNames  || null,
            description: description || null,
            email: email  || null,
            user_at: userLoginNames
        };

        console.log(values)
        try {
            await axios.put(`${API_URL}/api/supplier/${selectedsupplierId}`, values);
            toast.success('កែប្រែអតិជនបានដោយជោគជ័យ', { autoClose: 3000 });
            GetAllsupplier();
            setIsUpdateModalOpen(false);
            setSelectedsupplierId(null);
            cleardata();
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
        setSelectedsupplierId(cat.id);
        setIsDeleteModalOpen(true);
    };
    //   delete data
    const deletesupplier = async () => {
        if (selectedsupplierId) {
            try {
                await axios.delete(`${API_URL}/api/supplier/${selectedsupplierId}`);
                toast.success('លុបអតិជនបានដោយជោគជ័យ', { autoClose: 3000 });
                GetAllsupplier();
                setIsDeleteModalOpen(false);
                setSelectedsupplierId(null);
            } catch (err) {
                console.error(err);
                toast.error('ឈ្មោះនេះនេះមិនអាចលុបបានទេព្រោះមាននៅក្នុងរបាយកាណ៍ហើយ !', { autoClose: 3000 });
                // console.error(err);
                // const errorMessage = err.response?.data?.message || 'សូមលោកព្យាយាមម្ដងទៀត !';
                // toast.error(errorMessage, { autoClose: 3000 });
            }
        }
    };




    // greate supplier
    const createsupplier = async (e) => {
        e.preventDefault();
        setError('');

        const values = {
            contect_type: isTypwsupplier || null,
            contect_phone: businessPhone || null,
            mobile_phone: phoneNumber || null,
            business_names: businessName || null,
            full_names: customeNames || null,
            half_names: halfcustomeNames || null,
            description: description || null,
            email: email || null,
            user_at: userLoginNames
        };
        console.log(values)
        try {
            const { data } = await axios.post(`${API_URL}/api/supplier`, values);
            console.log(data);
            toast.success('បង្កើតអតិជនបានដោយជោគជ័យ ', { autoClose: 3000 });

            // Call function to refresh supplier list
            GetAllsupplier();
            setIsInsertModalOpen(false);
            cleardata();
        } catch (err) {
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
        <div>
            <div className="flex items-center gap-2 mb-3 ">
                <p><FaRegThumbsUp className="text-lg " /></p>
                <p className="font-bold font-NotoSansKhmer ">តារាងបញ្ជីអ្នកផ្គត់ផ្គង</p>
            </div>
            <div className="flex justify-end">
                {(userRol === 'superadmin' || userRol === 'admin') ? (
                    <button className="button_only_submit" onClick={openInsertModal}>+ បង្កើតអ្នកផ្គត់ផ្គង់</button>
                ) : (
                    <button className="cursor-not-allowed button_only_submit opacity-60">+ បង្កើតអ្នកផ្គត់ផ្គង់</button>
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
                        className="input_text w-[300px]" placeholder="ស្វែងរកឈ្មោះអជីវកម្ម និង អ្នកផ្គត់ផ្គង់......." />
                </div>
            </div>
            <div className="relative h-screen overflow-x-auto scrollbar-hidden">
                <AnimatePresence>
                    <table className="min-w-full table-auto">
                        <thead className="text-white bg-blue-600/95">
                            <tr className="font-bold font-NotoSansKhmer">
                                <th className="px-4 py-2">លេខរៀង</th>
                                <th className="px-4 py-2">ឈ្មោះអជីវកម្ម</th>
                                <th className="px-4 py-2">ឈ្មោះអ្នកផ្គត់ផ្គង់</th>
                                <th className="px-4 py-2">ឈ្មោះកាត់</th>
                                <th className="px-4 py-2">អ៊ីម៉ែល</th>
                                <th className="px-4 py-2">លេខទូរស័ព្ទ</th>
                                <th className="px-4 py-2">លេខសម្គាល់ទំនាក់ទំនង</th>
                                <th className="px-4 py-2">អាស័យដ្ឋាន</th>
                                <th className="px-4 py-2">បានបន្ថែមដោយ</th>
                                <th className="px-4 py-2 text-center">សកម្មភាព</th>
                            </tr>
                        </thead>

                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : suppliers.length === 0 ? (
                            <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                        ) : (
                            <tbody>
                                {suppliers.map((supplier, index) => (
                                    <motion.tr
                                        key={supplier.id}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={rowAnimation}
                                        transition={{ duration: 0.3 }}
                                        className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110">
                                        <td className="px-4 py-1">{index + 1}</td>
                                        <td className="px-4 py-1">{supplier.business_names}</td>
                                        <td className="px-4 py-1">{supplier.full_names}</td>
                                        <td className="px-4 py-1">{supplier.half_names}</td>
                                        <td className="px-4 py-1">{supplier.email || 'N/A'}</td>
                                        <td className="px-4 py-1">{supplier.mobile_phone || 'N/A'}</td>
                                        <td className="px-4 py-1">{supplier.contect_phone || 'N/A'}</td>
                                        <td className="px-4 py-1">{supplier.description || 'N/A'}</td>
                                        <td className="px-4 py-1">{supplier.user_at || 'Unknown'}</td>
                                        {(userRol === 'superadmin' || userRol === 'admin') ? (
                                            <td className="flex px-4 space-x-2">
                                                <>
                                                    <button
                                                        onClick={() => openUpdateModal(supplier)}
                                                        className="flex justify-center p-2 text-xs text-white bg-blue-500"
                                                    >
                                                        <FaPencilAlt className="text-white " />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(supplier)}
                                                        className="flex p-2 text-xs text-white bg-red-500"
                                                    >
                                                        <MdDelete className="text-white" />                                                     </button>
                                                </>
                                            </td>
                                        ) : (
                                            <td className="flex px-4 space-x-2">
                                                <>
                                                    <button
                                                        className="flex p-2 text-xs text-white bg-blue-500 cursor-not-allowed opacity-60"
                                                    >
                                                        <FaPencilAlt className="text-white" />
                                                    </button>
                                                    <button
                                                        className="flex justify-center p-2 text-xs text-white bg-red-500 cursor-not-allowed opacity-60"
                                                    >
                                                        <MdDelete className="text-white" />
                                                    </button>
                                                </>
                                            </td>
                                        )}
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
                                <h3 className="">អ្នកផ្គត់ផ្គង</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
                            </div>
                            <div className="modal_form">
                                <form onSubmit={createsupplier}>
                                    <div className="my-2">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="supplierType" className="font-bold font-NotoSansKhmer">
                                            ប្រភេទអ្នកកផ្គត់ផ្គង: *
                                            </label>
                                            <select
                                                id="supplierType"
                                                required
                                                onChange={handleChange}
                                                className="input_text w-[300px] font-NotoSansKhmer"
                                                value={isTypwsupplier}
                                            >
                                                <option value="">ជ្រើសរើស</option>
                                                <option value="ផ្ទាល់ខ្លួន" className="font-bold">ផ្ទាល់ខ្លួន</option>
                                                <option value="អជីវកម្ម" className="font-bold">អជីវកម្ម</option>
                                            </select>
                                        </div>
                                    </div>
                                    {isTypwsupplier === 'ផ្ទាល់ខ្លួន' && (
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="customeNames" className="font-bold font-NotoSansKhmer">អ្នកផ្គត់ផ្គង់</label>
                                                <input
                                                    type="text"
                                                    id="customeNames"
                                                    required
                                                    value={customeNames}
                                                    onChange={(e) => setCustomeNames(e.target.value)}
                                                    className="input_text w-[300px]"
                                                    placeholder="ឈ្មោះអតិជន"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-center w-full gap-3">
                                        {isTypwsupplier === "ផ្ទាល់ខ្លួន" && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="halfcustomeNames" className="font-bold font-NotoSansKhmer">អ្នកផ្គត់ផ្គង(ឈ្មោះកាត់)</label>
                                                    <input
                                                        type="text"
                                                        id="halfcustomeNames"
                                                        value={halfcustomeNames}
                                                        onChange={(e) => setHalfSupplierName(e.target.value)}
                                                        className="input_text"
                                                        placeholder="ឈ្មោះអតិជន"
                                                    />
                                                </div>
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="phoneNumber" className="font-bold font-NotoSansKhmer">លេខទូរស័ព្ទ: *</label>
                                                    <input
                                                        type="text"
                                                        id="phoneNumber"
                                                        required
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="input_text"
                                                        placeholder="លេខទូរស័ព្ទ"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {isTypwsupplier === "អជីវកម្ម" && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="businessName" className="font-bold font-NotoSansKhmer">ឈ្មោះអជីវកម្ម: *</label>
                                                    <input
                                                        type="text"
                                                        id="businessName"
                                                        required
                                                        value={businessName}
                                                        onChange={(e) => setBussinessName(e.target.value)}
                                                        className="input_text"
                                                        placeholder="ឈ្មោះអជីវកម្ម"
                                                    />
                                                </div>
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="businessPhone" className="font-bold font-NotoSansKhmer">លេខទូរស័ព្ទ: *</label>
                                                    <input
                                                        type="text"
                                                        id="businessPhone"
                                                        required
                                                        value={businessPhone}
                                                        onChange={(e) => setBussinessPhone(e.target.value)}
                                                        className="input_text"
                                                        placeholder="លេខទូរស័ព្ទ"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className="col-span-1 gap-2">
                                                <label htmlFor="supplierID" className="font-bold font-NotoSansKhmer">លេខសម្គាល់ទំនាក់ទំនង</label>
                                                <input
                                                    type="text"
                                                    id="supplierID"
                                                    value={supplierId}
                                                    onChange={(e) => setSupplierId(e.target.value)}
                                                    className="input_text"
                                                    placeholder="លេខសម្គាល់ទំនាក់ទំនង"
                                                />
                                            </div>
                                            <div className="col-span-1 gap-2">
                                                <label htmlFor="email" className="font-bold font-NotoSansKhmer">អ៊ីម៉ែល</label>
                                                <input
                                                    type="text"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="input_text"
                                                    placeholder="អ៊ីម៉ែល"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 gap-3 mt-3">
                                        <label htmlFor="description" className="font-bold font-NotoSansKhmer">ពិពណ៌នា</label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
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
                                <h3 className="">លុបអ្នកផ្គត់ផ្គង</h3>

                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-sm ">
                                    តើអ្នកប្រាកដថាចង់លុបអ្នកផ្គត់ផ្គង់នេះទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
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
                                        onClick={deletesupplier}
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
                                <h3 className="">កែប្រែអតិជន</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />

                            </div>
                            <div className="modal_form">
                                <form onSubmit={Updatesupplier}>
                                    <div className="my-2">
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="supplierType" className="font-bold font-NotoSansKhmer">
                                                ប្រភេទអតិជន: *
                                            </label>
                                            <select
                                                id="supplierType"
                                                required
                                                onChange={handleChange}
                                                className="input_text w-[300px] font-NotoSansKhmer"
                                                value={isTypwsupplier}
                                            >
                                                <option value="">ជ្រើសរើស</option>
                                                <option value="ផ្ទាល់ខ្លួន" className="font-bold">ផ្ទាល់ខ្លួន</option>
                                                <option value="អជីវកម្ម" className="font-bold">អជីវកម្ម</option>
                                            </select>
                                        </div>
                                    </div>
                                    {isTypwsupplier === 'ផ្ទាល់ខ្លួន' && (
                                        <div>
                                            <div className="flex flex-col gap-2">
                                                <label htmlFor="customeNames" className="font-bold font-NotoSansKhmer">ឈ្មោះអតិជន</label>
                                                <input
                                                    type="text"
                                                    id="customeNames"
                                                    required
                                                    value={customeNames}
                                                    onChange={(e) => setCustomeNames(e.target.value)}
                                                    className="input_text w-[300px]"
                                                    placeholder="ឈ្មោះអតិជន"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap items-center w-full gap-3">
                                        {isTypwsupplier === "ផ្ទាល់ខ្លួន" && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="halfcustomeNames" className="font-bold font-NotoSansKhmer">ឈ្មោះអតិជន(ឈ្មោះកាត់)</label>
                                                    <input
                                                        type="text"
                                                        id="halfcustomeNames"
                                                        value={halfcustomeNames}
                                                        onChange={(e) => setHalfSupplierName(e.target.value)}
                                                        className="input_text"
                                                        placeholder="ឈ្មោះអតិជន"
                                                    />
                                                </div>
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="phoneNumber" className="font-bold font-NotoSansKhmer">លេខទូរស័ព្ទ: *</label>
                                                    <input
                                                        type="text"
                                                        id="phoneNumber"
                                                        required
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="input_text"
                                                        placeholder="លេខទូរស័ព្ទ"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {isTypwsupplier === "អជីវកម្ម" && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="businessName" className="font-bold font-NotoSansKhmer">ឈ្មោះអជីវកម្ម: *</label>
                                                    <input
                                                        type="text"
                                                        id="businessName"
                                                        required
                                                        value={businessName}
                                                        onChange={(e) => setBussinessName(e.target.value)}
                                                        className="input_text"
                                                        placeholder="ឈ្មោះអជីវកម្ម"
                                                    />
                                                </div>
                                                <div className="col-span-1 gap-2">
                                                    <label htmlFor="businessPhone" className="font-bold font-NotoSansKhmer">លេខទូរស័ព្ទ: *</label>
                                                    <input
                                                        type="text"
                                                        id="businessPhone"
                                                        required
                                                        value={businessPhone}
                                                        onChange={(e) => setBussinessPhone(e.target.value)}
                                                        className="input_text"
                                                        placeholder="លេខទូរស័ព្ទ"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className='grid grid-cols-2 gap-3'>
                                            <div className="col-span-1 gap-2">
                                                <label htmlFor="supplierID" className="font-bold font-NotoSansKhmer">លេខសម្គាល់ទំនាក់ទំនង</label>
                                                <input
                                                    type="text"
                                                    id="supplierID"
                                                    value={supplierId}
                                                    onChange={(e) => setSupplierId(e.target.value)}
                                                    className="input_text"
                                                    placeholder="លេខសម្គាល់ទំនាក់ទំនង"
                                                />
                                            </div>
                                            <div className="col-span-1 gap-2">
                                                <label htmlFor="email" className="font-bold font-NotoSansKhmer">អ៊ីម៉ែល</label>
                                                <input
                                                    type="text"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="input_text"
                                                    placeholder="អ៊ីម៉ែល"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 gap-3 mt-3">
                                        <label htmlFor="description" className="font-bold font-NotoSansKhmer">ពិពណ៌នា</label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
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

export default SupplierList;
