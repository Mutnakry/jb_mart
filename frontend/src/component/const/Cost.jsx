import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Pagination from '../pagination/Pagination';
import { FaClipboardList, FaPencilAlt } from "react-icons/fa";
import { MdDelete, MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { IoPrint } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { API_URL } from '../../service/api'

const Cost = () => {

    const [costType, setCustType] = useState('');
    const [account, setAccount] = useState(null);
    const [tax, setTax] = useState(0);
    const [price, setPrice] = useState('');
    const [payment, setPayment] = useState(0);
    const [DOB, setDOB] = useState('');
    const [interval, setInterval] = useState(1);
    const [interval_type, setInterval_Type] = useState('ថ្ងៃ');
    const [description, setdescription] = useState(null);
    const [error, setError] = useState('');
    const [userLoginNames, setUserLoginNames] = useState('');
    const today = new Date().toISOString().split('T')[0];



    //// paginate and search data
    const [AccountNames, setGetAccountNames] = useState([]);
    const [CostTypeName, setCostTypeName] = useState([]);
    const [cost, setStudent] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        getAllStudent();
        GetAccountNames();
        GetCostTypeNames();
        fetchCurrentShift();
    }, [page, limit, searchQuery]);

    const [opening_id, setopeningID] = useState(null);

    const fetchCurrentShift = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/opencash/active`);
            console.log(response.data);
            // Adjust based on response structure
            if (response.data && response.data.shift && response.data.opening_balance) {
                setopeningID(response.data.id);
            } else {
                setopeningID(null);
            }
        } catch (error) {
            console.error("Error fetching shift:", error);
            setopeningID(null);
        }
    };

    // get all cost add paginate and search
    const getAllStudent = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/cost`, {
                params: {
                    page,
                    limit,
                    search_query: searchQuery
                }
            });
            setStudent(response.data.cost);
            console.log(response.data)
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (error) {
            setError('Error fetching categories data');
        } finally {
            setLoading(false);
        }
    };

    //// get all Account Names
    const GetAccountNames = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/account`);
            setGetAccountNames(response.data.account);
            console.log(response.data)
        } catch (error) {
            setError('Error fetching categories data');
        }
    };
    //// get all Cost Type
    const GetCostTypeNames = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/cost_type`);
            setCostTypeName(response.data.cost_type);
            console.log(response.data)
        } catch (error) {
            setError('Error fetching categories data');
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
    const [selectedcostId, setSelectedcostId] = useState(null);
    // modal insert
    const openInsertModal = () => {
        setIsInsertModalOpen(true);
    };
    // modal update 
    const openUpdateModal = cat => {
        setSelectedcostId(cat.id);
        setdescription(cat.description);
        setPrice(cat.price);
        setCustType(cat.cost_type_id);
        setPayment(cat.payment);
        setDOB(cat.dob);
        setInterval(cat.interval);
        setAccount(cat.account_id);
        setInterval_Type(cat.interval_type);
        setTax(cat.tax);
        setIsUpdateModalOpen(true);
    };


    const ClearData = () => {
        setPrice('');
        setdescription('');
        setCustType('');
        setPayment('');
        setDOB('');
        setInterval('');
        setAccount('');
        setTax('');
        setInterval_Type('');
    }
    // modal update 
    const UpdateTeacher = async e => {
        e.preventDefault();
        setError('');
        const values = {
            cost_type_id: costType,
            account_id: account,
            tax: tax,
            price: price,
            payment: payment,
            dob: DOB,
            description: description,
            interval: interval,
            interval_type: interval_type,
            user_at: userLoginNames
        }
        if (payment > (price + tax)) {
            toast.error('ចំនួនសរុបរួមបញ្ចូលពន្ធមិនអាចធំជាង ចំនួនសរុប​​​ និង ពន្ធបានទេ!', { autoClose: 3000 });
            return;
        }
        try {
            await axios.put(`${API_URL}/api/cost/${selectedcostId}`, values);
            toast.success('កែប្រែចំណាយបានដោយជោគជ័យ', { autoClose: 3000 });
            getAllStudent();
            setIsUpdateModalOpen(false);
            setSelectedcostId(null);
            ClearData();

        } catch (err) {
            console.error(err);
            ClearData();
            setInterval_Type('');
            toast.error('សូមលោកព្យាយាមម្ដងទៀត!', { autoClose: 3000 });
        }
    };

    // modal delete
    const openDeleteModal = cat => {
        setSelectedcostId(cat.id);
        setIsDeleteModalOpen(true);
    };

    // modale delete
    const deletecost = async () => {
        if (selectedcostId) {
            try {
                await axios.delete(`${API_URL}/api/cost/${selectedcostId}`);
                toast.success('លុបម៉ាក់យីយោបានដោយជោគជ័យ', { autoClose: 3000 });
                getAllStudent();
                setIsDeleteModalOpen(false);
                setSelectedcostId(null);
            } catch (err) {
                console.error(err);
                toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
            }
        }
    };

    // greate cost
    const Createcost = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            cost_type_id: costType,
            account_id: account,
            opening_id:opening_id,
            tax: tax,
            price: price,
            payment: payment,
            dob: DOB || today,
            description: description,
            interval: interval,
            interval_type: interval_type,
            user_at: userLoginNames
        }

        if (payment > (price + tax)) {
            toast.error('ចំនួនសរុបរួមបញ្ចូលពន្ធមិនអាចធំជាង ចំនួនសរុប​​​ និង ពន្ធបានទេ!', { autoClose: 3000 });
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/api/cost`, values);
            console.log(res.data);
            toast.success('បង្កើតចំណាយបានដោយជោគជ័យ ', { autoClose: 3000 });
            ClearData();
            setIsInsertModalOpen(false);
            getAllStudent();
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div >
            <div className='border-2 p-4 border-gray-200 dark:border-gray-700 print:hidden'>
                <div className="flex items-center mb-3 gap-2 ">
                    <p><FaClipboardList className="text-lg " /></p>
                    <p className="font-NotoSansKhmer font-bold ">តារាងបញ្ជីចំណាយ</p>
                </div>
                <div className="flex justify-end">
                    <button className="button_only_submit" onClick={openInsertModal}>+ បង្កើតចំណាយថ្មី</button>
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
                            className="input_text w-[300px]" placeholder="ស្វែងរកចំណាយ..." />
                    </div>
                </div>
                <div class="relative overflow-x-auto h-screen scrollbar-hidden">
                    <AnimatePresence>
                        <table className="min-w-full table-auto">
                            <thead className="bg-blue-600/95 text-white">
                                <tr className="font-NotoSansKhmer font-bold">
                                    <th className=" px-4 py-2">លេខរៀង</th>
                                    <th className=" px-4 py-2">កាលបរិច្ខេទ</th>
                                    <th className=" px-4 py-2">ប្រភេទនែការចំណាយ</th>
                                    <th className=" px-4 py-2">ប្រភេទគណនីចំណាយ</th>
                                    <th className=" px-4 py-2">ព័ត៌មានលម្អិតពីការបន្ត</th>
                                    <th className=" px-4 py-2">ស្ថានភាពការទូទាត់</th>
                                    <th className=" px-4 py-2">ពន្ធ</th>
                                    <th className=" px-4 py-2">ចំនួនសរុប</th>
                                    <th className=" px-4 py-2">ការទូទាត់ដល់ពេលតំណត់</th>
                                    <th className=" px-4 py-2">ការណិពណ័នា</th>
                                    <th className=" px-4 py-2">បន្ថែមដោយ</th>
                                    <th className=" px-4 py-2">សកម្មភាព</th>

                                </tr>
                            </thead>
                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p>{error}</p>
                            ) : cost.length === 0 ? (
                                <p className="text-start py-4 px-10 text-red-500">រកមិនឃើញប្រភេទ ? {searchQuery}</p>
                            ) : (
                                <tbody>
                                    {cost.map((customer, index) => (
                                        <motion.tr key={customer.id}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={rowAnimation}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm font-NotoSansKhmer  hover:scale-y-110 duration-100">
                                            <td className=" px-4 py-1">{index + 1}</td>
                                            <td>
                                                {new Date(customer.dob).toISOString().split('T')[0]}

                                            </td>
                                            <td className="px-4 py-1">{customer.type_names}</td>
                                            <td className="px-4 py-1">{customer.acc_names || 'N/A'}</td>
                                            <td className="px-4 py-1">ចន្លោះពេលកើតឡើងវិញ​ : {customer.interval} {customer.interval_type || 'N/A'}</td>

                                            <td className="px-4 py-1">
                                                {customer.payment >= customer.price ? (
                                                    <span className="text-green-400">បង់</span> // Fully Paid
                                                ) : customer.payment > 0 && customer.payment < customer.price ? (
                                                    <span className="text-pink-400">បានបង់ខ្លះ</span> // Partially Paid
                                                ) : customer.payment < customer.price ? (
                                                    <span className="text-red-400">ជុំពាក់</span> // Owing
                                                ) : null}
                                            </td>
                                            <td className="px-4 py-1">
                                                {customer.tax.toLocaleString('en-US', {
                                                    style: 'decimal',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}{' '}
                                                $
                                            </td>

                                            <td className="px-4 py-1">
                                                {customer.price.toLocaleString('en-US', {
                                                    style: 'decimal',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}{' '}
                                                $
                                            </td>
                                            <td className="px-4 py-1">
                                                {customer.payment.toLocaleString('en-US', {
                                                    style: 'decimal',
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}{' '}
                                                $
                                            </td>
                                            {/* <td className="px-4 py-1">{customer.tax.toFixed(2)} $</td>
                                            <td className="px-4 py-1">{customer.price.toFixed(2)} $</td>
                                            <td className="px-4 py-1">{customer.payment.toFixed(2)} $</td> */}
                                            <td className=" px-4 py-1">{customer.description || 'N/A'}</td>
                                            <td className="px-4 py-1">{customer.user_at || 'N/A'}</td>


                                            <td className="px-4  space-x-2 flex">
                                                <button
                                                    onClick={() => openDeleteModal(customer)}
                                                    className='bg-red-50 p-2 hover:bg-red-400'
                                                >
                                                    <MdDelete className='text-red-500' />
                                                </button>
                                                <button
                                                    onClick={() => openUpdateModal(customer)}
                                                    className='bg-blue-200  p-2  hover:bg-blue-400'                        >
                                                    <FaPencilAlt className='text-blue-500' />
                                                </button>
                                                <Link
                                                    to={`/cost/${customer.id}`}
                                                    className="flex items-center gap-1 p-2 font-bold text-white bg-green-300 hover:bg-green-400"

                                                >
                                                    <IoPrint />
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    ))}

                                </tbody>
                            )}

                            {/* Sum */}
                            <motion.tr
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={rowAnimation}
                                transition={{ duration: 0.3 }}
                                className='bg-gray-300'>
                                <td colSpan="5" className="font-bold text-center h-20">សរុប :</td>
                                <td>
                                    {cost.reduce((total, customer) => customer.payment >= customer.price ? total + 1 : total, 0) > 0 && (
                                        <span className="text-green-400">
                                            បង់: {(cost.reduce((total, customer) => customer.payment >= customer.price ? total + 1 : total, 0))}
                                        </span>
                                    )}
                                    <br />
                                    {cost.reduce((total, customer) => customer.payment > 0 && customer.payment < customer.price ? total + 1 : total, 0) > 0 && (
                                        <span className="text-pink-400">
                                            បានបង់ខ្លះ: {(cost.reduce((total, customer) => customer.payment > 0 && customer.payment < customer.price ? total + 1 : total, 0))}
                                        </span>
                                    )}
                                    <br />
                                    {cost.reduce((total, customer) => customer.payment === 0 ? total + 1 : total, 0) > 0 && (
                                        <span className="text-red-400">
                                            ជុំពាក់: {(cost.reduce((total, customer) => customer.payment === 0 ? total + 1 : total, 0))}
                                        </span>
                                    )}
                                </td>
                                {/* <td className="font-bold px-4 py-1">
                                    {(cost.reduce((total, customer) => total + customer.tax, 0)).toFixed(2)} $
                                </td> */}
                                <td className="font-bold px-4 py-1">
                                    {cost
                                        .reduce((total, customer) => total + customer.tax, 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td className="font-bold px-4 py-1">
                                    {cost
                                        .reduce((total, customer) => total + customer.price, 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                                <td className="font-bold px-4 py-1">
                                    {cost
                                        .reduce((total, customer) => total + customer.payment, 0)
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
                        <div className="modal_center max-w-2xl">
                            <div className="modal_title">
                                <h3 className="">ឈ្មោះម៉ាក់យីយោ</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsInsertModalOpen(false)} />
                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={Createcost}>
                                    <div className="">
                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ប្រភេទនៃការចំណាយ: *</label>
                                                <select
                                                    className='input_text'
                                                    id="bank"
                                                    value={costType}
                                                    required
                                                    onChange={e => setCustType(e.target.value)}
                                                >
                                                    <option value="" >សូមជ្រើសរើស</option>
                                                    {CostTypeName?.map((items) => (
                                                        <option key={items.id} value={items.id}>
                                                            {items.type_names}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ពន្ធ</label>
                                                <input
                                                    type="number"
                                                    value={tax}
                                                    defaultValue={0}
                                                    onChange={e => setTax(e.target.value)}
                                                    id="price"
                                                    class="input_text "
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ចំនួនសរុប: *</label>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    id="price"
                                                    class="input_text "
                                                    placeholder="ចំនួនសរុប"
                                                    required
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">កាលបរិច្ខេទ: *</label>
                                                <input
                                                    type="date"
                                                    value={DOB || today}
                                                    onChange={e => setDOB(e.target.value)}
                                                    min={today}
                                                    id="price"
                                                    class="input_text "
                                                    required
                                                />
                                            </div>
                                            <div className='grid grid-cols-12'>
                                                <div className="col-span-8">
                                                    <label className="font-NotoSansKhmer font-bold">ចន្លោះពេលកើតឡើងវិញ: *</label>
                                                    <input
                                                        type="number"
                                                        value={interval}
                                                        onChange={e => setInterval(e.target.value)}
                                                        id="price"
                                                        className="input_text w-full"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <label className="font-NotoSansKhmer font-bold"><br /></label>
                                                    <select
                                                        className='input_text'
                                                        id="bank"
                                                        value={interval_type}
                                                        onChange={e => setInterval_Type(e.target.value)}
                                                    >
                                                        <option value='ថ្ងៃ'>ថ្ងៃ</option>
                                                        <option value='ខែ'>ខែ</option>
                                                        <option value='ឆ្នាំ'>ឆ្នាំ</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='my-6 border-b-4 p-4'>
                                            <h3 className='font-NotoSansKhmer font-bold'>បន្ថែមការទូទាត់</h3>
                                        </div>

                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ចំនួនសរុបរួមបញ្ចូលពន្ធ</label>
                                                <input
                                                    type="number"
                                                    value={payment}
                                                    onChange={e => setPayment(e.target.value)}
                                                    id="price"
                                                    class="input_text "
                                                    placeholder="0.00 $"
                                                />
                                            </div>
                                            <div class="col-span-2 ">
                                                <label className="font-NotoSansKhmer font-bold">គណនីទូទាត់</label>
                                                <select
                                                    className='input_text'
                                                    id="bank"
                                                    value={account}
                                                    onChange={e => setAccount(e.target.value)}
                                                >
                                                    <option>មិនមាន</option>
                                                    {AccountNames?.map((items) => (
                                                        <option key={items.id} value={items.id}>
                                                            {items.acc_names}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                            <div class="col-span-2">
                                                <label className="font-NotoSansKhmer font-bold">ការណិពណ័នា</label>
                                                <textarea id="description"
                                                    rows="2"
                                                    value={description}
                                                    onChange={e => setdescription(e.target.value)}
                                                    class="input_text"
                                                    placeholder="ការណិពណ័នា">
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
                                    Are you sure you want to delete this cost? This action cannot be undone.
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
                                        onClick={deletecost}
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
                        <div className="modal_center max-w-2xl">
                            <div className="modal_title">
                                <h3 className="">កែប្រែម៉ាក់យីយោ</h3>
                                <MdClose className='text-2xl cursor-pointer' onClick={() => setIsUpdateModalOpen(false)} />

                            </div>
                            <div className="modal_form">
                                <form class="" onSubmit={UpdateTeacher}>
                                    <div className="">
                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ប្រភេទនៃការចំណាយ: *</label>
                                                <select
                                                    className='input_text'
                                                    id="bank"
                                                    value={costType}
                                                    required
                                                    onChange={e => setCustType(e.target.value)}
                                                >
                                                    <option value="" >សូមជ្រើសរើស</option>
                                                    {CostTypeName?.map((items) => (
                                                        <option key={items.id} value={items.id}>
                                                            {items.type_names}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ពន្ធ</label>
                                                <input
                                                    type="number"
                                                    value={tax}
                                                    defaultValue={0}
                                                    onChange={e => setTax(e.target.value)}
                                                    id="price"
                                                    class="input_text "
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ចំនួនសរុប: *</label>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    id="price"
                                                    class="input_text "
                                                    placeholder="ចំនួនសរុប"
                                                    required
                                                />
                                            </div>
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">កាលបរិច្ខេទ: *</label>
                                                <input
                                                    type="date"
                                                    value={DOB}
                                                    onChange={e => setDOB(e.target.value)}

                                                    id="price"
                                                    class="input_text "

                                                />
                                            </div>
                                            <div className='grid grid-cols-12'>
                                                <div className="col-span-8">
                                                    <label className="font-NotoSansKhmer font-bold">ចន្លោះពេលកើតឡើងវិញ: *</label>
                                                    <input
                                                        type="number"
                                                        value={interval}
                                                        onChange={e => setInterval(e.target.value)}
                                                        id="price"
                                                        className="input_text w-full"
                                                        required
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <label className="font-NotoSansKhmer font-bold"><br /></label>
                                                    <select
                                                        className='input_text'
                                                        id="bank"
                                                        value={interval_type}
                                                        onChange={e => setInterval_Type(e.target.value)}
                                                    >
                                                        <option value='ថ្ងៃ'>ថ្ងៃ</option>
                                                        <option value='ខែ'>ខែ</option>
                                                        <option value='ឆ្នាំ'>ឆ្នាំ</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='my-6 border-b-4 p-4'>
                                            <h3 className='font-NotoSansKhmer font-bold'>បន្ថែមការទូទាត់</h3>
                                        </div>

                                        <div class="grid gap-4 mb-4 grid-cols-2">
                                            <div class="col-span-1">
                                                <label className="font-NotoSansKhmer font-bold">ចំនួនសរុបរួមបញ្ចូលពន្ធ</label>
                                                <input
                                                    type="number"
                                                    value={payment}
                                                    onChange={e => setPayment(e.target.value)}
                                                    id="price"
                                                    class="input_text "
                                                    placeholder="0.00 $"
                                                />
                                            </div>
                                            <div class="col-span-2 ">
                                                <label className="font-NotoSansKhmer font-bold">គណនីទូទាត់</label>
                                                <select
                                                    className='input_text'
                                                    id="bank"
                                                    value={account}
                                                    onChange={e => setAccount(e.target.value)}
                                                >
                                                    <option>មិនមាន</option>
                                                    {AccountNames?.map((items) => (
                                                        <option key={items.id} value={items.id}>
                                                            {items.acc_names}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                            <div class="col-span-2">
                                                <label className="font-NotoSansKhmer font-bold">ការណិពណ័នា</label>
                                                <textarea id="description"
                                                    rows="2"
                                                    value={description}
                                                    onChange={e => setdescription(e.target.value)}
                                                    class="input_text"
                                                    placeholder="ការណិពណ័នា">
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
            </AnimatePresence>
        </div>
    );
};

export default Cost;
