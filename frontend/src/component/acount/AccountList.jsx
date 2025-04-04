
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaCcApplePay, FaPencilAlt, FaMoneyBillAlt, FaBookOpen, FaPowerOff } from "react-icons/fa";
import { MdDelete, MdClose, MdOutlineMoneyOff  } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import {API_URL} from '../../service/api'

const Account = () => {
    const [acc_names, setAcc_names] = useState('');
    const [bank_id, setBank_id] = useState('');
    const [acc_num, setAcc_num] = useState('');
    const [balance, setBalance] = useState(0);
    const [description, setdescription] = useState('');
    const [error, setError] = useState('');
    const [userLoginNames, setUserLoginNames] = useState('');

    //// paginate and search data
    const [accountTypeBank, setAccountTypeBank] = useState([]);
    const [account, setAccount] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [payAmount, setPayAmount] = useState(0);
    const [account_ID, setAccount_ID] = useState('');
    const [paydescription, setPayescription] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_rol') || '');
        getAllStudent();
        GetBacktype();
    }, [page, limit, searchQuery]);

    //// get all bank type
    const GetBacktype = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/bank`);
            setAccountTypeBank(response.data.bank);
            console.log(response.data)
        } catch (error) {
            setError('Error fetching categories data');
        }
    };

    // get all account add paginate and search
    const getAllStudent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/account`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });
            setAccount(response.data.account);
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
    const [selectedaccountId, setSelectedaccountId] = useState(null);
    // modal insert
    const openInsertModal = () => {
        setIsInsertModalOpen(true);
    };


    // modal Update Status
    const [isMoneyUpdateStatus, setIsMoneyUpdateStatus] = useState(false);
    const [status, setStatus] = useState('on')

    const openMoneyUpdateStatus = cat => {
        setSelectedaccountId(cat.id);
        setStatus(cat.status);
        setIsMoneyUpdateStatus(true);
    };

    // modal transfer money
    const [isMoneyTransfer, setIsMoneyTransfer] = useState(false);

    const openMoneyTransfer = cat => {
        setSelectedaccountId(cat.id);
        setAcc_names(cat.acc_names);
        setAcc_num(cat.acc_num);
        setBalance(cat.balance);
        setBank_id(cat.bank_id);
        setdescription(cat.description);
        setIsMoneyTransfer(true);
    };

    // modal transfer money
    const [isInputMoneyTransfer, setIsInputMoneyTransfer] = useState(false);

    const openInputMoneyTransfer = cat => {
        setSelectedaccountId(cat.id);
        setAcc_names(cat.acc_names);
        setAcc_num(cat.acc_num);
        setBalance(cat.balance);
        setBank_id(cat.bank_id);
        setIsInputMoneyTransfer(true);
    };
    // modal update 
    const openUpdateModal = cat => {
        setSelectedaccountId(cat.id);
        setAcc_names(cat.acc_names);
        setAcc_num(cat.acc_num);
        setBalance(cat.balance);
        setBank_id(cat.bank_id);
        setdescription(cat.description);
        setIsUpdateModalOpen(true);
    };
    // modal update 
    const UpdateAccount = async e => {
        e.preventDefault();
        setError('');
        const values = {
            acc_names: acc_names,
            bank_id: bank_id,
            acc_num: acc_num,
            balance: balance,
            description: description,
            user_at: userLoginNames
        }
        try {
            await axios.put(`${API_URL}/api/account/${selectedaccountId}`, values);
            toast.success('កែប្រែគណនីបានដោយជោគជ័យ', { autoClose: 3000 });
            getAllStudent();
            setIsUpdateModalOpen(false);
            setSelectedaccountId(null);
            setAcc_names('');
            setAcc_num("");
            setBalance("");
            setBank_id("");
            setdescription('');
        } catch (err) {
            console.error(err);
            toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
        }
        finally {
            setLoading(false);
        }
    };

    // modal update statis បិទ បើក
    const HandUpdateStatus = async e => {
        e.preventDefault();
        setError('');
        const values = {
            status: status,
            user_at: userLoginNames
        }
        try {
            await axios.put(`${API_URL}/api/account/update_status/${selectedaccountId}`, values);
            toast.success('កែប្រែគណនីបានដោយជោគជ័យ', { autoClose: 3000 });
            getAllStudent();
            setIsMoneyUpdateStatus(false);
            setSelectedaccountId(null);
            setStatus("");
        } catch (err) {
            console.error(err);
            toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
        }
    };


    // modal delete
    const openDeleteModal = cat => {
        setSelectedaccountId(cat.id);
        setIsDeleteModalOpen(true);
    };

    // modale delete
    const deleteaccount = async () => {
        if (selectedaccountId) {
            try {
                await axios.delete(`${API_URL}/api/account/${selectedaccountId}`);
                toast.success('លុបគណនីបានដោយជោគជ័យ', { autoClose: 3000 });
                getAllStudent();
                setIsDeleteModalOpen(false);
                setSelectedaccountId(null);
            } catch (err) {
                console.error(err);
                toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
            }
        }
    };

    // greate account
    const Createaccount = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            acc_names: acc_names,
            bank_id: bank_id,
            acc_num: acc_num,
            balance: balance,
            description: description,
            user_at: userLoginNames
        }
        try {
            const res = await axios.post(`${API_URL}/api/account`, values);
            console.log(res.data);
            toast.success('បង្កើតគណនីបានដោយជោគជ័យ ', { autoClose: 3000 });
            setAcc_names('');
            setAcc_num("");
            setBalance("");
            setBank_id("");
            setdescription('');
            getAllStudent();
            setIsInsertModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
        }
    };


    //  HandTransterMoney
    const HandTransterMoney = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        if (!account_ID || !selectedaccountId || !payAmount) {
            toast.error('សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់', { autoClose: 3000 });
            setLoading(false);
            return;
        }

        if (payAmount > balance) {
            toast.error('ចំនួនទឹកប្រាក់ទូទាត់មិនអាចលើសពីសមតុល្យបានទេ', { autoClose: 3000 });
            setErrorMessage('ចំនួនទឹកប្រាក់ទូទាត់មិនអាចលើសពីសមតុល្យបានទេ។');
            setLoading(false);
            return;
        }

        const values = {
            account_in: account_ID,
            account_out: selectedaccountId,
            detail_balance: payAmount,
            description: paydescription
        };

        try {
            const response = await axios.post(`${API_URL}/api/account/paymentdetail`, values);
            if (response.status === 201) {
                toast.success('ផ្ទេរប្រាក់បានដោយជោគជ័យ', { autoClose: 3000 });
                setIsMoneyTransfer(false);
                setSelectedaccountId(null);
                setPayAmount(0);
                setPayAmount('');
                getAllStudent();
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.error) {
                toast.error(err.response.data.error, { autoClose: 3000 });
            } else {
                toast.error('សូមព្យាយាមម្តងទៀត!', { autoClose: 3000 });
            }
        } finally {
            setLoading(false);
        }
    };

    //  HandTransterMoney
    const HandInputTransterMoney = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const values = {
            account_in: selectedaccountId,
            account_out: null,
            detail_balance: payAmount,
            description: paydescription
        };
        console.log(values)

        try {
            const response = await axios.post(`${API_URL}/api/account/inputmoney`, values);
            if (response.status === 201) {
                toast.success('ផ្ទេរប្រាក់បានដោយជោគជ័យ', { autoClose: 3000 });
                setIsInputMoneyTransfer(false);
                setSelectedaccountId(null);
                setPayAmount(0);
                setPayAmount('');
                getAllStudent();
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data.error) {
                toast.error(err.response.data.error, { autoClose: 3000 });
            } else {
                toast.error('សូមព្យាយាមម្តងទៀត!', { autoClose: 3000 });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = parseFloat(e.target.value);

        if (value > balance) {
            setErrorMessage('ចំនួនទឹកប្រាក់ទូទាត់មិនអាចលើសពីសមតុល្យបានទេ។');
            setPayAmount(0)
        } else {
            setErrorMessage('');
        }

        setPayAmount(value);
    };

    const rowAnimation = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };
    return (
        <div>
            <div className="flex items-center mb-3 gap-2 ">
                <p><FaCcApplePay className="text-lg " /></p>
                <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីគណនី</p>
            </div>
            <div className="flex justify-end">
                <button className="button_only_submit" onClick={openInsertModal}>+ បង្កើតគណនីថ្មី</button>
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
                        className="input_text w-[300px]" placeholder="ស្វែងរកគណនី..." />
                </div>
            </div>
            <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                <AnimatePresence>
                    <table className="min-w-full table-auto">
                        <thead className="bg-blue-600/95 text-white">
                            <tr className="font-NotoSansKhmer font-bold">
                                <th className=" px-4 py-2">លេខរៀង</th>
                                <th className=" px-4 py-2">ឈ្មោះគណនី</th>
                                <th className=" px-4 py-2">ប្រភេទគណនី</th>
                                <th className=" px-4 py-2">លេខគណនី</th>
                                <th className=" px-4 py-2">គណនី</th>
                                <th className=" px-4 py-2">សមតុល្យសាច់ប្រាក់</th>
                                <th className=" px-4 py-2">ព័ត៌មានលម្អិតគណនី</th>
                                <th className=" px-4 py-2">បានបន្ថែមដោយ</th>
                                <th className=" px-4 py-2 text-center">សកម្មភាព</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : account.length === 0 ? (
                            <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                        ) : (
                            <tbody>
                                {account.map((customer, index) => (
                                    <motion.tr
                                        key={customer.id}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={rowAnimation}
                                        transition={{ duration: 0.3 }}
                                        className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100">
                                        <td className=" px-4 py-1">{index + 1}</td>
                                        <td className="px-4 py-1">{customer.acc_names}</td>
                                        <td className="px-4 py-1">{customer.bank_names}</td>
                                        <td className="px-4 py-1">{customer.acc_num}</td>
                                        <td className=" px-4 py-1 whitespace-nowrap">
                                            {customer.status === 'on' ? (
                                                <span className='bg-green-500 py-1 px-4 rounded-lg font-NotoSansKhmer text-md hover:bg-green-300 dark:bg-green-300 text-white'>បើល</span>
                                            ) : (
                                                <span className='bg-red-500 py-1 px-4 rounded-lg hover:bg-red-300 text-white dark:bg-red-300'>កំពុងបិទ</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-1">{customer.balance} $</td>
                                        <td className=" px-4 py-1">{customer.description || 'N/A'}</td>
                                        <td className="px-4 py-1">{customer.user_at}</td>

                                        <td className="px-4  space-x-2 flex">
                                            {customer.status === 'off' ? (
                                                <td className="px-4 space-x-2 flex">
                                                    <button
                                                        className='bg-gray-200 p-2 flex text-xs cursor-not-allowed text-white'                        >
                                                        <FaPencilAlt className='text-blue-500 mr-2' /> កែសម្រួល
                                                    </button>
                                                    <button
                                                        className='bg-gray-200 p-2 flex text-xs cursor-not-allowed text-white'                        >
                                                        <MdOutlineMoneyOff className='text-sm mr-2' />ផ្ទេរប្រាក់
                                                    </button>
                                                    <button
                                                        className='p-2 bg-gray-200 cursor-not-allowed flex text-xs text-white'                        >
                                                        <FaMoneyBillAlt className='text-sm mr-2' />ដាក់ប្រាក់
                                                    </button>
                                                    <button
                                                        className='bg-gray-200 p-2 flex text-xs cursor-not-allowed text-white'                        >
                                                        <FaBookOpen className='text-sm mr-2' />សៀវភៅគណនី
                                                    </button>
                                                    <button
                                                        onClick={() => openMoneyUpdateStatus(customer)}
                                                        className='bg-red-300 p-2 flex text-xs text-white'
                                                    >
                                                        <FaPowerOff className='text-red-500 mr-2' /> បើក
                                                    </button>

                                                </td>
                                            ) : (
                                                <td className="px-4  space-x-2 flex">
                                                    <button
                                                        onClick={() => openUpdateModal(customer)}
                                                        className='bg-blue-300 p-2 flex text-xs text-white'                        >
                                                        <FaPencilAlt className='text-blue-500 mr-2' /> កែសម្រួល
                                                    </button>
                                                    <button
                                                        onClick={() => openMoneyTransfer(customer)}
                                                        className='bg-green-500 p-2 flex text-xs text-white'                        >
                                                        <MdOutlineMoneyOff className='text-sm mr-2' />ផ្ទេរប្រាក់
                                                    </button>
                                                    <button
                                                        onClick={() => openInputMoneyTransfer(customer)}
                                                        className='p-2 bg-lime-300 flex text-xs text-white'                        >
                                                        <FaMoneyBillAlt className='text-sm mr-2' />ដាក់ប្រាក់
                                                    </button>
                                                   
                                                    <Link
                                                    to={`/accountdetail/${customer.id}`}
                                                        className='bg-yellow-300 p-2 flex text-xs text-white'                        >
                                                        <FaBookOpen className='text-sm mr-2' />សៀវភៅគណនី
                                                    </Link>
                                                    <button
                                                        onClick={() => openMoneyUpdateStatus(customer)}
                                                        className='bg-red-300 p-2  flex text-xs text-white'
                                                    >
                                                        <FaPowerOff className='text-red-500 mr-2' /> បិទ
                                                    </button>

                                                </td>

                                            )}
                                        </td>
                                        <td>
                                            {(userLoginNames === 'superadmin' || userLoginNames === 'admin') ? (
                                                <button
                                                    onClick={() => openDeleteModal(customer)}
                                                    className='bg-red-300 p-2 flex text-xs text-white'
                                                >
                                                    <MdDelete  className='text-red-500 mr-2' /> លុប
                                                </button>
                                            ) : null}
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

            </div >

            {/* Insert Modal */}
            < AnimatePresence >
                {isInsertModalOpen && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal_center max-w-xl">
                            <div className="modal_title">
                                <h3 className="">ឈ្មោះគណនី</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={Createaccount}>
                                    <div className="">
                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                                <input
                                                    type="text"
                                                    value={acc_names}
                                                    onChange={e => setAcc_names(e.target.value)}
                                                    id="price"
                                                    className="input_text "
                                                    placeholder="ឈ្មោះ" required
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ប្រភេទគណនី: *</label>
                                                <select
                                                    className='input_text'
                                                    id="bank"
                                                    value={bank_id}
                                                    required
                                                    onChange={e => setBank_id(e.target.value)}
                                                >
                                                    <option value="" className='text-white'>ជ្រើសរើសប្រភេទគណនី</option>
                                                    {accountTypeBank?.map((accountBank) => (
                                                        <option key={accountBank.id} value={accountBank.id}>
                                                            {accountBank.bank_names}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">លេខគណនី:*</label>
                                                <input
                                                    type="number"
                                                    value={acc_num}
                                                    onChange={e => setAcc_num(e.target.value)}
                                                    id="price"
                                                    className="input_text "
                                                    placeholder="លេខគណនី" required
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">សមតុល្យបើក</label>
                                                <input
                                                    type="number"
                                                    value={balance}
                                                    min={0}
                                                    onChange={e => setBalance(e.target.value)}
                                                    id="acc_names"
                                                    defaultValue={0}
                                                    className="input_text "
                                                />
                                            </div>
                                            <div class="col-span-2">
                                                <label className="font-NotoSansKhmer font-bold">ចំណាំ</label>
                                                <textarea id="description"
                                                    rows="4"
                                                    value={description}
                                                    onChange={e => setdescription(e.target.value)}
                                                    class="input_text"
                                                    placeholder="ចំណាំ">
                                                </textarea>
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
            </AnimatePresence >

            {/* Delete Modal */}
            < AnimatePresence >
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
                                <h3 className="">លុបប្រគណនី</h3>

                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsDeleteModalOpen(false)} />
                            </div>
                            <div className="p-4 space-y-4">
                                <p className="text-sm ">
                                    Are you sure you want to delete this account? This action cannot be undone.
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
                                        onClick={deleteaccount}
                                    >
                                        លុប
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
            {/* Update Modal */}
            < AnimatePresence >
                {isUpdateModalOpen && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal_center max-w-xl">
                            <div className="modal_title">
                                <h3 className="">កែប្រែគណនី</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />

                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={UpdateAccount}>
                                    <div className="">
                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                                <input
                                                    type="text"
                                                    value={acc_names}
                                                    onChange={e => setAcc_names(e.target.value)}
                                                    id="price"
                                                    className="input_text "
                                                    placeholder="ឈ្មោះ" required
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ប្រភេទគណនី: *</label>
                                                <select
                                                    className='input_text'
                                                    id="bank"
                                                    value={bank_id}
                                                    required
                                                    onChange={e => setBank_id(e.target.value)}
                                                >
                                                    <option value="" className='text-white'>ជ្រើសរើសប្រភេទគណនី</option>
                                                    {accountTypeBank?.map((accountBank) => (
                                                        <option key={accountBank.id} value={accountBank.id}>
                                                            {accountBank.bank_names}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">លេខគណនី:*</label>
                                                <input
                                                    type="number"
                                                    value={acc_num}
                                                    onChange={e => setAcc_num(e.target.value)}
                                                    id="price"
                                                    className="input_text "
                                                    placeholder="លេខគណនី" required
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">សមតុល្យបើក</label>
                                                <input
                                                    type="number"
                                                    value={balance}
                                                    min={0}
                                                    onChange={e => setBalance(e.target.value)}
                                                    id="acc_names"
                                                    defaultValue={0}
                                                    className="input_text "
                                                />
                                            </div>
                                            <div class="col-span-2">
                                                <label className="font-NotoSansKhmer font-bold">ចំណាំ</label>
                                                <textarea id="description"
                                                    rows="4"
                                                    value={description}
                                                    onChange={e => setdescription(e.target.value)}
                                                    class="input_text"
                                                    placeholder="ចំណាំ">
                                                </textarea>
                                            </div>
                                        </div>
                                        <div className='flex justify-end'>
                                            <button
                                                type="submit"

                                                className={`button_only_submit font-NotoSansKhmer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}

                                                disabled={loading}
                                            >
                                               {loading ? 'កំពុងរក្សា...' : 'រក្សាទុក'}
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence >

            {/* Modal update Status បើក បិទ*/}
            < AnimatePresence >
                {isMoneyUpdateStatus && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal_center max-w-sm">
                            <div className="modal_title">
                                <h3 className="">ប្រគណនី</h3>

                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsMoneyUpdateStatus(false)} />
                            </div>
                            <div className="p-4 space-y-4">

                                <div className="modal_form">
                                    <form class="" onSubmit={HandUpdateStatus}>
                                        <div className="">
                                            <div class="grid gap-4 mb-4 grid-cols-1">
                                                <div class="col-span-1 font-NotoSansKhmer text-xl space-y-2">
                                                    <label className="font-NotoSansKhmer font-bold">គណនីកំពុង<span value={status}>បិទ</span></label>
                                                    <select
                                                        className='input_text font-NotoSansKhmer text-xl'
                                                        id="bank"
                                                        value={status}
                                                        required
                                                        onChange={e => setStatus(e.target.value)}
                                                    >
                                                        <option value="on">គណនីកំពុងបើក</option>
                                                        <option value="off">គណនីកំពុងបិទ</option>

                                                    </select>
                                                </div>
                                            </div>
                                            <div className='flex justify-end'>
                                                <button
                                                    type="submit"
                                                    className="button_only_submit font-NotoSansKhmer text-xl"
                                                >
                                                    រក្សាទុក្ខ
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Money transfer */}
            < AnimatePresence >
                {isMoneyTransfer && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal_center max-w-2xl">
                            <div className="modal_title">
                                <h3 className="">ផ្ទេរប្រាក់ទៅគណនី</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsMoneyTransfer(false)} />

                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={HandTransterMoney}>
                                    <div className="">
                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div className='space-y-2  border-t-2 border-green-600 p-2 rounded-md shadow'>
                                                <div className='text-xl font-NotoSansKhmer text-center text-green-500'>
                                                    <h2>ព័ត៌មានលម្អិតគណនីដែរផ្ទេ</h2>
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                                    <input
                                                        type="text"
                                                        value={acc_names}
                                                        readOnly
                                                        onChange={e => setAcc_names(e.target.value)}
                                                        id="price"
                                                        className="input_text bg-gray-200 font-NotoSansKhmer text-sm"
                                                        placeholder="ឈ្មោះ" required
                                                    />
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">លេខគណនី:*</label>
                                                    <input
                                                        type="number"
                                                        value={acc_num}
                                                        readOnly
                                                        onChange={e => setAcc_num(e.target.value)}
                                                        id="price"
                                                        className="input_text bg-gray-200 text-sm"
                                                        placeholder="លេខគណនី" required
                                                    />
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">សមតុល្យបើក</label>
                                                    <input
                                                        type="number"
                                                        value={balance}
                                                        readOnly
                                                        min={0}
                                                        onChange={e => setBalance(e.target.value)}
                                                        id="acc_names"
                                                        defaultValue={0}
                                                        className="input_text bg-gray-200 font-NotoSansKhmer text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className='space-y-2  border-t-2 border-red-600 p-2 rounded-md shadow'>
                                                <div className='text-xl font-NotoSansKhmer text-center text-red-500'>
                                                    <h2>ព័ត៌មានលម្អិតគណនីដែរទទួល</h2>
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">ជ្រើសរើសប្រភេទគណនីផ្ទេទៅ: *</label>
                                                    <select
                                                        className='input_text font-NotoSansKhmer text-sm'
                                                        id="bank"
                                                        value={account_ID}
                                                        required
                                                        onChange={e => setAccount_ID(e.target.value)}
                                                    >
                                                        <option value="">គណនី</option>
                                                        {account
                                                            ?.filter((acc) => acc.id !== selectedaccountId)
                                                            .map((acc) => (
                                                                <option
                                                                    key={acc.id}
                                                                    value={acc.id}
                                                                    disabled={acc.status === 'off'}
                                                                >
                                                                    {acc.acc_names}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">សមតុល្យបើក</label>
                                                    <input
                                                        type="number"
                                                        value={payAmount}
                                                        min={0}
                                                        placeholder='0.00$'
                                                        onChange={handleInputChange}
                                                        id="acc_names"
                                                        className="input_text font-NotoSansKhmer text-sm"
                                                    />
                                                    {errorMessage && (
                                                        <p style={{ color: 'red', fontSize: '12px' }}>{errorMessage}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div class="col-span-2">
                                                <label className="font-NotoSansKhmer font-bold">ចំណាំ</label>
                                                <textarea id="description"
                                                    rows="4"
                                                    value={paydescription}
                                                    onChange={e => setPayescription(e.target.value)}
                                                    class="input_text"
                                                    placeholder="ចំណាំ">
                                                </textarea>
                                            </div>
                                        </div>
                                        <div className='flex justify-end'>
                                            <button
                                                type="submit"
                                                className="button_only_submit font-NotoSansKhmer text-xl"
                                            >
                                                រក្សាទុក្ខ
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </motion.div >
                )}
            </AnimatePresence >

            {/*imput Money transfer​ ដាក់ប្រាក់ */}
            < AnimatePresence >
                {isInputMoneyTransfer && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal_center max-w-2xl">
                            <div className="modal_title">
                                <h3 className="">ដាក់ប្រាក់ទៅគណនី</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInputMoneyTransfer(false)} />

                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={HandInputTransterMoney}>
                                    <div className="">
                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div className='space-y-2  border-t-2 border-green-600 p-2 rounded-md shadow'>
                                                <div className='text-xl font-NotoSansKhmer text-center text-green-500'>
                                                    <h2>ព័ត៌មានលម្អិតគណនី</h2>
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                                    <input
                                                        type="text"
                                                        value={acc_names}
                                                        readOnly
                                                        onChange={e => setAcc_names(e.target.value)}
                                                        id="price"
                                                        className="input_text bg-gray-200 font-NotoSansKhmer text-sm"
                                                        placeholder="ឈ្មោះ" required
                                                    />
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">លេខគណនី:*</label>
                                                    <input
                                                        type="number"
                                                        value={acc_num}
                                                        readOnly
                                                        onChange={e => setAcc_num(e.target.value)}
                                                        id="price"
                                                        className="input_text bg-gray-200 text-sm"
                                                        placeholder="លេខគណនី" required
                                                    />
                                                </div>
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">សមតុល្យបើក</label>
                                                    <input
                                                        type="number"
                                                        value={balance}
                                                        readOnly
                                                        min={0}
                                                        onChange={e => setBalance(e.target.value)}
                                                        id="acc_names"
                                                        defaultValue={0}
                                                        className="input_text bg-gray-200 font-NotoSansKhmer text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className='space-y-2  border-t-2 border-red-600 p-2 rounded-md shadow'>
                                                {/* <div className='text-xl font-NotoSansKhmer text-center text-red-500'>
                                                    <h2>ព័ត៌មានលម្អិតគណនីដែរទទួល</h2>
                                                </div> */}
                                                {/* <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">ជ្រើសរើសប្រភេទគណនីផ្ទេទៅ: *</label>
                                                    <select
                                                        className='input_text font-NotoSansKhmer text-sm'
                                                        id="bank"
                                                        value={account_ID}
                                                        required
                                                        onChange={e => setAccount_ID(e.target.value)}
                                                    >
                                                        <option value="">គណនី</option>
                                                        {account
                                                            ?.filter((acc) => acc.id !== selectedaccountId)
                                                            .map((acc) => (
                                                                <option
                                                                    key={acc.id}
                                                                    value={acc.id}
                                                                >
                                                                    {acc.acc_names}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div> */}
                                                <div class="col-span-1">
                                                    <label className="font-NotoSansKhmer font-bold">សមតុល្យបើក</label>
                                                    <input
                                                        type="number"
                                                        value={payAmount}
                                                        min={1}
                                                        placeholder='0.00$'
                                                        onChange={handleInputChange}
                                                        id="acc_names"
                                                        className="input_text font-NotoSansKhmer text-sm"
                                                    />

                                                </div>
                                            </div>
                                            <div class="col-span-2">
                                                <label className="font-NotoSansKhmer font-bold">ចំណាំ</label>
                                                <textarea id="description"
                                                    rows="4"
                                                    value={paydescription}
                                                    onChange={e => setPayescription(e.target.value)}
                                                    class="input_text"
                                                    placeholder="ចំណាំ">
                                                </textarea>
                                            </div>
                                        </div>
                                        <div className='flex justify-end'>
                                            <button
                                                type="submit"
                                                className="button_only_submit font-NotoSansKhmer text-xl"
                                            >
                                                រក្សាទុក្ខ
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </motion.div >
                )}
            </AnimatePresence >
        </div >
    );
};

export default Account;
