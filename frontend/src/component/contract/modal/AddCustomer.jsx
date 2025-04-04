import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import {API_URL} from '../../../service/api'

function AddCustomer({ setIsModalCustomer }) {

    const [isTypwCustomer, setIsTypwCustomer] = useState("");
    const [customeNames, setCustomeNames] = useState(null);
    const [halfcustomeNames, setHalfSupplierName] = useState(null);
    const [groupCustomer, setGroupCustomer] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [businessName, setBussinessName] = useState(null);
    const [businessPhone, setBussinessPhone] = useState(null);
    const [supplierId, setSupplierId] = useState(null);
    const [email, setEmail] = useState(null);
    const [description, setDescription] = useState(null);
    const [userLoginNames, setUserLoginNames] = useState('');
    const [error, setError] = useState('');

    const [group_Customer, setGroup_Customer] = useState([]);

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        getGroup_Customer();
    }, []);

    const getGroup_Customer = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/group_customer`);
            setGroup_Customer(response.data.group_customer);
        } catch (error) {
            setError('Error fetching categories data');
        }
    };

    const handleChange = (event) => {
        setIsTypwCustomer(event.target.value);
        setCustomeNames("");
        setBussinessName("");
    };

    const cleardata = () => {
        setIsTypwCustomer("");
        setCustomeNames("");
        setHalfSupplierName("");
        setGroupCustomer("");
        setPhoneNumber("");
        setBussinessName("");
        setBussinessPhone("");
        setSupplierId("");
        setEmail("");
        setDescription("");
    };

    // greate customer
    const createCustomer = async (e) => {
        e.preventDefault();
        setError('');

        const values = {
            contect_type: isTypwCustomer,
            group_id: groupCustomer,
            contect_phone: businessPhone,
            mobile_phone: phoneNumber,
            business_names: businessName,
            full_names: customeNames,
            half_names: halfcustomeNames,
            description: description,
            email: email,
            user_at: userLoginNames
        };

        try {
            const { data } = await axios.post(`${API_URL}/api/customer`, values);
            console.log(data);
            toast.success('បង្កើតអតិជនបានដោយជោគជ័យ ', { autoClose: 3000 });
            setIsModalCustomer(false);
            window.location.href = "/index/pos";
            cleardata();
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || 'សូមលោកព្យាយាមម្ដងទៀត !';
            toast.error(errorMessage, { autoClose: 3000 });
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalCustomer(false);
        }
    };
    return (
        <div>
            <motion.div
                className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={handleOverlayClick}
            >
                <div className="relative w-full bg-white m-4 shadow mt-10 dark:bg-gray-700 max-w-4xl">
                    <div className="modal_title">
                        <h3 className="">អតិជន</h3>
                        <MdClose className='text-2xl cursor-pointer' onClick={() => setIsModalCustomer(false)} />
                    </div>
                    <div className="modal_form">
                        <form onSubmit={createCustomer}>
                            <div className="my-2">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="supplierType" className="font-NotoSansKhmer font-bold">
                                        ប្រភេទអតិជន: *
                                    </label>
                                    <select
                                        id="supplierType"
                                        required
                                        onChange={handleChange}
                                        className="input_text w-[300px] font-NotoSansKhmer"
                                        value={isTypwCustomer}
                                    >
                                        <option value="">ជ្រើសរើស</option>
                                        <option value="ផ្ទាល់ខ្លួន" className="font-bold">ផ្ទាល់ខ្លួន</option>
                                        <option value="អជីវកម្ម" className="font-bold">អជីវកម្ម</option>
                                    </select>
                                </div>
                            </div>
                            {isTypwCustomer === 'ផ្ទាល់ខ្លួន' && (
                                <div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="customeNames" className="font-NotoSansKhmer font-bold">ឈ្មោះអតិជន</label>
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
                            <div className="flex flex-wrap gap-3 items-center w-full">
                                {isTypwCustomer === "ផ្ទាល់ខ្លួន" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="col-span-1 gap-2">
                                            <label htmlFor="halfcustomeNames" className="font-NotoSansKhmer font-bold">ឈ្មោះអតិជន(ឈ្មោះកាត់)</label>
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
                                            <label htmlFor="phoneNumber" className="font-NotoSansKhmer font-bold">លេខទូរស័ព្ទ: *</label>
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
                                {isTypwCustomer === "អជីវកម្ម" && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="col-span-1 gap-2">
                                            <label htmlFor="businessName" className="font-NotoSansKhmer font-bold">ឈ្មោះអជីវកម្ម: *</label>
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
                                            <label htmlFor="businessPhone" className="font-NotoSansKhmer font-bold">លេខទូរស័ព្ទ: *</label>
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
                                        <label htmlFor="supplierID" className="font-NotoSansKhmer font-bold">លេខសម្គាល់ទំនាក់ទំនង</label>
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
                                        <label htmlFor="email" className="font-NotoSansKhmer font-bold">អ៊ីម៉ែល</label>
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
                            <div className="flex flex-col gap-2">
                                <label htmlFor="groupCustomer" className="font-NotoSansKhmer font-bold">ក្រុមអតិជន:</label>
                                <select
                                    className='input_text'
                                    id="bank"
                                    value={groupCustomer}
                                    onChange={e => setGroupCustomer(e.target.value)}
                                >
                                    <option value="" >សូមជ្រើសរើស</option>
                                    {group_Customer?.map((items) => (
                                        <option key={items.id} value={items.id}>
                                            {items.group_names}
                                        </option>
                                    ))}

                                </select>
                            </div>
                            <div className="col-span-2 gap-3 mt-3">
                                <label htmlFor="description" className="font-NotoSansKhmer font-bold">ពិពណ៌នា</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="input_text w-full py-5"
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
        </div>
    )
}

export default AddCustomer