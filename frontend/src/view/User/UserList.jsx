
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaClipboardList, FaPencilAlt, FaPowerOff } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../component/Navbar';
import { Link } from 'react-router-dom';
import {API_URL} from '../../service/api'

const UserList = () => {
    const [userLoginNames, setUserLoginNames] = useState('');
    const [error, setError] = useState('');

    //// paginate and search data
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        getUser();

    }, []);


    //// get all bank type
    const getUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth`);
            setUsers(response.data);
            console.log(response.data)
        } catch (error) {
            setError('Error fetching categories data');
        }
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
        setPage(1);
    };

    // modal delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedcustomerId, setSelectedcustomerId] = useState(null);
    const openDeleteModal = cat => {
        setSelectedcustomerId(cat.id);
        setIsDeleteModalOpen(true);
    };
    //   delete data
    const deletecustomer = async () => {
        if (selectedcustomerId) {
            try {
                await axios.delete(`${API_URL}/api/customer/${selectedcustomerId}`);
                toast.success('លុបអតិជនបានដោយជោគជ័យ', { autoClose: 3000 });
                getUser();
                setIsDeleteModalOpen(false);
                setSelectedcustomerId(null);
            } catch (err) {
                console.error(err);
                toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
            }
        }
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
                <div className=' Div_bar'>
                    <div className="flex items-center mb-3 gap-2 ">
                        <p><FaClipboardList className="text-lg " /></p>
                        <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីអតិជន</p>
                    </div>
                    <div className="flex justify-end">
                        <Link to={'/createuser'} className="button_only_submit" >+ បង្កើតអតិជនថ្មី</Link>
                    </div>
                    <div className="flex justify-between items-center my-3">
                        <div>
                            <input type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                className="input_text w-[300px]" placeholder="ស្វែងរកឈ្មោះអ្នកប្រើប្រាស......." />
                        </div>
                    </div>
                    <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                        <AnimatePresence>
                            <table className="min-w-full table-auto">
                                <thead className="bg-blue-600/95 text-white">
                                    <tr className="font-NotoSansKhmer font-bold">
                                        <th className="px-4 py-2">លេខរៀង</th>
                                        <th className="px-4 py-2">ឈ្មោះអ្នកប្រើប្រាស</th>
                                        <th className="px-4 py-2">អ៊ីម៉ែល</th>
                                        <th className="px-4 py-2">លេខសម្ងាត់</th>
                                        <th className="px-4 py-2">តួនាទីអ្នកប្រើប្រាស់</th>
                                        <th className="px-4 py-2 text-center">សកម្មភាព</th>
                                    </tr>
                                </thead>

                                {loading ? (
                                    <p>Loading...</p>
                                ) : error ? (
                                    <p>{error}</p>
                                ) : (
                                    <tbody>
                                        {users
                                            .filter((customer) =>
                                                customer.user_names.toLowerCase().includes(searchQuery)
                                            )
                                            .map((customer, index) => (
                                                <motion.tr
                                                    key={customer.id}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={rowAnimation}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100"
                                                >
                                                    <td className="px-4 py-4">{index + 1}</td>
                                                    <td className="px-4 py-1">{customer.user_names}</td>
                                                    <td className="px-4 py-1">{customer.user_email}</td>
                                                    <td className="px-4 py-1 text-center">* * * * * * * * * * *</td>
                                                    <td className="px-4 py-1">{customer.user_rol}</td>
                                                    <td className="px-4 space-x-2 flex">
                                                        {customer.user_names !== userLoginNames && (
                                                            <>
                                                                <Link
                                                                to={`/user/${customer.id}`}
                                                                    className="bg-blue-300 p-2 flex text-xs text-white"
                                                                >
                                                                    <FaPencilAlt className="text-blue-500 mr-2" /> កែសម្រួល
                                                                </Link>
                                                                <button
                                                                    onClick={() => openDeleteModal(customer)}
                                                                    className="bg-red-300 p-2 flex text-xs text-white"
                                                                >
                                                                    <MdDelete className="text-red-500 mr-2" /> លុប
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                    </tbody>

                                )}
                            </table>
                        </AnimatePresence>


                    </div>

                    {/* Insert Modal */}
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
                                        <h3 className="">លុបប្រអតិជន</h3>

                                        <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <p className="text-sm ">
                                        តើអ្នកប្រាកដថាចង់លុបអ្នកប្រើប្រាស់នេះទេ?
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
                                                onClick={deletecustomer}
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
        </div>
    );
};

export default UserList