
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {API_URL} from '../../service/api'



const AcountType = () => {

    const [type_names, setType_names] = useState('');
    const [error, setError] = useState('');

    //// paginate and search data
    const [cost_type, setCostType] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        getAllStudent();
    }, [page, limit, searchQuery]);

    // get all cost_type add paginate and search
    const getAllStudent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/cost_type`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });
            setCostType(response.data.cost_type);
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
    const [selectedcost_typeId, setSelectedcost_typeId] = useState(null);
    // modal insert
    const openInsertModal = () => {
        setIsInsertModalOpen(true);
    };
    // modal update 
    const openUpdateModal = cat => {
        setSelectedcost_typeId(cat.id);
        setType_names(cat.type_names);
        setIsUpdateModalOpen(true);
    };
    // modal update 
    const UpdateCostType = async e => {
        e.preventDefault();
        setError('');
        const values = {
            type_names: type_names,
        }
        try {
            await axios.put(`${API_URL}/api/cost_type/${selectedcost_typeId}`, values);
            toast.success('កែប្រែឈ្មោះប្រភេទចំណាយបានដោយជោគជ័យ', { autoClose: 3000 });
            getAllStudent();
            setIsUpdateModalOpen(false);
            setSelectedcost_typeId(null);
            setType_names('');
        } catch (err) {
            console.error(err);
            setType_names('');
            toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
        }
    };


    // modal delete
    const openDeleteModal = cat => {
        setSelectedcost_typeId(cat.id);
        setIsDeleteModalOpen(true);
    };

    // modale delete
    const deletecost_type = async () => {
        if (selectedcost_typeId) {
            try {
                await axios.delete(`${API_URL}/api/cost_type/${selectedcost_typeId}`);
                toast.success('លុបឈ្មោះប្រភេទចំណាយបានដោយជោគជ័យ', { autoClose: 3000 });
                getAllStudent();
                setIsDeleteModalOpen(false);
                setSelectedcost_typeId(null);
            } catch (err) {
                console.error(err);
                toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
            }
        }
    };

    // greate cost_type
    const Createcost_type = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            type_names: type_names,
        }
        try {
            const res = await axios.post(`${API_URL}/api/cost_type`, values);
            console.log(res.data);
            toast.success('បង្កើតឈ្មោះប្រភេទចំណាយបានដោយជោគជ័យ ', { autoClose: 3000 });
            setType_names('');
            getAllStudent();
            setIsInsertModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
        }
    };
    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };
    return (
        <div>
            <div className='border-2 p-4 border-gray-200 dark:border-gray-700'>
                <div className="flex items-center mb-3 gap-2 ">
                    <p><FaClipboardList className="text-lg " /></p>
                    <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីឈ្មោះប្រភេទចំណាយ</p>
                </div>
                <div className="flex justify-end">
                    <button className="button_only_submit" onClick={openInsertModal}>+ បង្កើតឈ្មោះថ្មី</button>
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
                            className="input_text w-[300px]" placeholder="ស្វែងរកឈ្មោះប្រភេទចំណាយ..." />
                    </div>
                </div>
                <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                <AnimatePresence>
                    <table className="min-w-full table-auto">
                        <thead className="bg-blue-600/95 text-white">
                            <tr className="font-NotoSansKhmer font-bold">
                                <th className=" px-4 py-2">លេខរៀង</th>
                                <th className=" px-4 py-2">ឈ្មោះប្រភេទចំណាយ</th>
                                <th className=" px-4 py-2">បង្កើត</th>
                                <th className=" px-4 py-2">សកម្មភាព</th>

                            </tr>
                        </thead>
                        {loading ? (
                            <p>កំប៉ុងស្វែងរក........</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : cost_type.length === 0 ? (
                            <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                        ) : (
                            <tbody>
                                {cost_type.map((customer, index) => (
                                     <motion.tr 
                                     key={customer.id}
                                    initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={rowAnimation}
                                        transition={{ duration: 0.3 }}
                                     className="text-sm font-NotoSansKhmer  hover:scale-y-110 duration-100">
                                        <td className=" px-4 py-1">{index + 1}</td>
                                        <td className="px-4 py-1">{customer.type_names}</td>
                                        <td className=" px-4 py-1">{customer.create_at}</td>

                                        <td className="px-4  space-x-2 flex">
                                            <button
                                                onClick={() => openDeleteModal(customer)}
                                                className='bg-red-50 rounded-full p-2 '
                                            >
                                                <MdDelete className='text-red-500' />
                                            </button>
                                            <button
                                                onClick={() => openUpdateModal(customer)}
                                                className='bg-blue-50 rounded-full p-2 '                        >
                                                <FaPencilAlt className='text-blue-500' />
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
                    <div className="modal_center max-w-sm">
                        <div className="modal_title">
                            <h3 className="">បង្កើតឈ្មោះប្រភេទចំណាយ</h3>
                            <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
                        </div>
                        <div className="modal_form">
                            <form class="" onSubmit={Createcost_type}>
                                <div className="">
                                    <div class="grid gap-4 mb-4 grid-cols-2">
                                        <div class="col-span-2">
                                            <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                            <input
                                                type="text"
                                                value={type_names}
                                                onChange={e => setType_names(e.target.value)}
                                                id="price"
                                                class="input_text "
                                                placeholder="ឈ្មោះប្រភេទចំណាយ" required
                                            />
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
                    <div className="modal_center max-w-sm">
                        <div className="modal_title">
                            <h3 className="">លុបប្រម៉ាក់យីយោ</h3>

                            <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
                        </div>
                        <div className="p-4 space-y-4">
                            <p className="text-sm ">
                                Are you sure you want to delete this cost_type? This action cannot be undone.
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
                                    onClick={deletecost_type}
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
                    <div className="modal_center max-w-sm">
                        <div className="modal_title">
                            <h3 className="">កែប្រែឈ្មោះប្រភេទចំណាយ</h3>
                            <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />

                        </div>
                        <div className="modal_form">
                            <form class="" onSubmit={UpdateCostType}>

                                <div class="grid gap-4 mb-4 grid-cols-1">
                                    <div class="col-span-2">
                                        <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                        <input
                                            type="text"
                                            value={type_names}
                                            onChange={e => setType_names(e.target.value)}
                                            id="price"
                                            class="input_text "
                                            placeholder="ឈ្មោះប្រភេទចំណាយ" required
                                        />
                                    </div>
                                </div>
                                <div className='flex items-end justify-end'>
                                    <button
                                        type="submit"
                                        className="button_only_submit"
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

export default AcountType;
