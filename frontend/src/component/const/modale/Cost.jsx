import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from '../../../service/api'

const Cost = ({ setIsOpenCash }) => {

    const [costType, setCustType] = useState('');
    const [account, setAccount] = useState(null);
    const [tax, setTax] = useState(0);
    const [price, setPrice] = useState('');
    const [payment, setPayment] = useState('');
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

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        GetAccountNames();
        GetCostTypeNames();
        fetchCurrentShift();
    }, []);

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

    // greate cost
    const Createcost = async (e) => {
        e.preventDefault();
        setError('');
        const values = {
            cost_type_id: costType,
            account_id: account,
            opening_id: opening_id || null,
            tax: tax,
            price: price,
            payment: payment,
            dob: DOB || today,
            description: description,
            interval: interval,
            interval_type: interval_type,
            user_at: userLoginNames
        }
        console.log(values)
        if (payment > (price + tax)) {
            toast.error('ចំនួនសរុបរួមបញ្ចូលពន្ធមិនអាចធំជាង ចំនួនសរុប​​​ និង ពន្ធបានទេ!', { autoClose: 3000 });
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/api/cost`, values);
            console.log(res.data);
            toast.success('បង្កើតចំណាយបានដោយជោគជ័យ ', { autoClose: 3000 });
            ClearData();
            setIsOpenCash(false);
        } catch (err) {
            console.error(err);
            toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
        }
    };

    return (
        <div className='p-4'>
            <div className="">
                <h3 className="">ឈ្មោះម៉ាក់យីយោ</h3>
            </div>
            <div className="">
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
                                    placeholder="0.00 $"
                                    required
                                />
                            </div>
                            <div class="col-span-1">
                                <label className="font-NotoSansKhmer font-bold">កាលបរិច្ខេទ: *</label>
                                <input
                                    type="date"
                                    value={DOB || today}
                                    disabled
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
                                <label className="font-NotoSansKhmer font-bold">ចំនួនសរុបរួមបញ្ចូលពន្ធ : *</label>
                                <input
                                    type="number"
                                    required
                                    value={payment || (Number(price) + Number(tax))}
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
                                        <option key={items.id} value={items.id} disabled={items.status === 'off'}>
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
    );
};

export default Cost;
