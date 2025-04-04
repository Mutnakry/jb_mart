import Navbar from '../Navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../service/api'
import { Link, useNavigate, useParams } from "react-router-dom";



function Customerpayment() {
    const navigate = useNavigate();
    const [customer, setSustomer] = useState('');
    const [cash_change, setCash_change] = useState(0);
    const [amountTotal, setAmounTotal] = useState(0);
    const [amountPay, setAmounPay] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [createDob, setCreateDob] = useState(today);
    const [description, setDescription] = useState(null);
    const [account_ID, setAccount_ID] = useState(null);
    const [customer_id, setCustomer_id] = useState(1);
    const [userLoginNames, setUserLoginNames] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [order_detail_id, setOrder_detail_id] = useState('');
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`http://localhost:6700/api/repay/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order data');
                }
                const data = await response.json();
                setSelectedProducts(data);
                setCreateDob(data[0]?.date_order);
                setCustomer_id(data[0]?.customer_id);
                setOrder_detail_id(data[0]?.order_detail_id);
                setSustomer(data[0]?.full_names || data[0]?.business_names)
                setPaymentTypeCurrency(data[0]?.type_currency);
                setCash_change(data[0]?.changes);
                setAmounTotal(data[0]?.total_amount);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [id]);


    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
        getAccountBank();
        getCurrencyData();
    }, []);
    ///// get account
    const [accountBank, setAccountBank] = useState([]);
    const getAccountBank = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/account`);
            setAccountBank(response.data.account);
            console.log(response.data)
        } catch (error) {
            setError('Error fetching categories data');
        }
    };


    const [balance_usd, setBalance_usd] = useState(1);
    const [exchangeRateKHR, setExchangeRateKHR] = useState(4200);
    const [thbToKhrRateTHB, setThbToKhrRateTHB] = useState(120);
    const getCurrencyData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/currency`);
            const fetchedData = response.data;
            const khrRate = parseFloat(fetchedData.find(c => c.name === "KHR")?.rate) || 4200;
            const thbRate = parseFloat(fetchedData.find(c => c.name === "THB")?.rate) || 120;
            console.log('khr', khrRate)
            console.log('thb', thbRate)
            setExchangeRateKHR(khrRate);
            setThbToKhrRateTHB(thbRate);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        }
    };

    const [ispaymentTypeCurrency, setPaymentTypeCurrency] = useState('usd');

    const [exchanges, setExchanges] = useState(1);
    const [finalTotal, SetFinalTotal] = useState(1);
    const handleChangepaymentType = (e) => {
        setPaymentTypeCurrency(e.target.value);
        // setDeposit(0);
        let calculatedPayMoney = finalTotal;
        let ExchangesPayment = 1;
        if (e.target.value === "usd") {
            calculatedPayMoney = finalTotal;
            ExchangesPayment = 1;
        } else if (e.target.value === "khr") {
            calculatedPayMoney = finalTotal * exchangeRateKHR;
            ExchangesPayment = exchangeRateKHR;
        } else if (e.target.value === "thb") {
            calculatedPayMoney = finalTotal * (exchangeRateKHR / thbToKhrRateTHB);
            // ExchangesPayment = thbToKhrRateTHB;
            ExchangesPayment = (exchangeRateKHR / thbToKhrRateTHB);
        }

        // setPayMoney(calculatedPayMoney);
        setExchanges(ExchangesPayment)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);
        setLoading(true);

        try {
            const totalAmount = parseFloat(selectedProducts?.[0]?.total_amount) || 0;
            const balanceAmount = parseFloat(selectedProducts?.[0]?.balance_amount) || 0;
            // const discount = parseFloat(selectedProducts?.[0]?.discount) || 0;

            const calculatedPayMoney = totalAmount - balanceAmount;

            let newPayment = amountPay;
            if (amountPay > calculatedPayMoney) {
                newPayment = calculatedPayMoney;
            }

            let convertedAmountUSD = newPayment;
            let exchangesPayment = 1;

            if (ispaymentTypeCurrency === "khr" && exchangeRateKHR) {
                convertedAmountUSD = newPayment / exchangeRateKHR;
                exchangesPayment = 1 / exchangeRateKHR;
            } else if (ispaymentTypeCurrency === "thb" && exchangeRateKHR && thbToKhrRateTHB) {
                convertedAmountUSD = (newPayment * thbToKhrRateTHB) / exchangeRateKHR;
                exchangesPayment = thbToKhrRateTHB / exchangeRateKHR;
            }

            const purchaseData = {
                customer_id: customer_id ?? null,
                order_detail_id: order_detail_id ?? null,
                balance: Number(newPayment) || 0,
                cash_change: Number(cash_change) || 0,
                balance_usd: Number(convertedAmountUSD) || 0,
                account_id: account_ID || null,
                type_currency: ispaymentTypeCurrency || "usd",
                description: description?.trim() || "",
                user_at: userLoginNames || "unknown"
            };

            console.log("Submitting:", purchaseData);

            const response = await axios.post(`${API_URL}/api/cus_payment`, purchaseData);
            if (response.status === 200 || response.status === 201) {
                toast.success("ការរក្សាទុកដោយជោគជ័យ.");
                navigate(`/customer`);
            } else {
                throw new Error("Unexpected response from server.");
            }

        } catch (error) {
            console.error("Error saving purchase:", error.response?.data || error.message);
            toast.error("Failed to save purchase.");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };



    return (
        <div>
            <Navbar />
            <div className='md:py-12 py-6  px-4 sm:ml-64 md:w-auto w-[560px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">
                    <div className='p-4 border'>
                        <div className="pb-6 ">
                            <p htmlFor="email" className="text-xl font-bold text-gray-600 font-NotoSansKhmer">
                                របាយការណ៍អតិជនបង់ប្រាក់
                            </p>
                        </div>
                        <form  onSubmit={handleSubmit} >
                            <div className='grid gap-4 xl:grid-cols-2 md:grid-cols-1'>
                                <div className='grid gap-3 p-2 border-2 md:grid-cols-2 border-x'>
                                    <div className="col-span-2 gap-2">
                                        <p htmlFor="email" className="text-xl font-bold text-center text-gray-600 font-NotoSansKhmer">
                                            របាយការណ៍ទូទាត់ថ្មី
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="groupCustomer" className="font-NotoSansKhmer">ឈ្មោះអតិជន</label>
                                        <input
                                            type="text"
                                            id="price"
                                            readOnly
                                            value={customer}
                                            className="input_text"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 space-y-2">
                                        <label className="font-bold font-NotoSansKhmer">កាលបរិច្ឆេទទិញ</label>
                                        <input
                                            type="text"
                                            id="price"
                                            min={today}
                                            readOnly
                                            value={createDob}
                                            className="input_text"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-1 gap-2 space-y-2">
                                        <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                            ចំនួនការទូទាត់សរុប <span className='text-red-600'>: *</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="input_text"
                                            value={amountPay}
                                            onChange={e => setAmounPay(e.target.value)}
                                            required
                                            placeholder="ចំនួនការទូទាត់សរុប"
                                        />
                                    </div>
                                    <div className="col-span-1 gap-2 space-y-2">
                                        <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                            ចំនួនការទូទាត់សរុបនៅជុំពាក់
                                        </label>
                                        <div className='flex'>
                                            <input
                                                type="number"
                                                className="text-center input_text"
                                                readOnly
                                                value={((parseFloat(selectedProducts?.[0]?.total_amount) || 0) - ((parseFloat(selectedProducts?.[0]?.balance_amount) || 0) ) - amountPay).toFixed(2)}
                                                placeholder="ចំនួនការទូទាត់សរុប"
                                            />
                                            <select id="paymenttype"
                                                disabled
                                                value={ispaymentTypeCurrency}
                                                onChange={handleChangepaymentType}
                                                className="w-20 text-white bg-blue-500 border-0 input_text font-NotoSansKhmer"

                                            >
                                                <option value="usd">ដុល្លារ</option>
                                                <option value="khr">រៀល</option>
                                                <option value="thb">បាត</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="groupCustomer" className="font-NotoSansKhmer">បញ្ចូលទៅកាន់គណនី:</label>
                                        <select
                                            className='input_text'
                                            id="bank"
                                            value={account_ID || null}
                                            onChange={e => setAccount_ID(e.target.value)}
                                        >
                                            {account_ID === null && <option value="">មិនមាន</option>}
                                            {accountBank?.map((items) => (
                                                <option key={items.id} value={items.id} disabled={items.status === 'off'}>
                                                    {items.acc_names}
                                                </option>
                                            ))}

                                        </select>
                                    </div>

                                    <div className="col-span-2 gap-2 space-y-2">
                                        <label htmlFor="email" className="font-bold font-NotoSansKhmer">
                                            ពណ៍នា
                                        </label>
                                        <textarea
                                            type="text"
                                            rows={4}
                                            value={description || null}
                                            onChange={e => setDescription(e.target.value)}
                                            className="input_text"

                                            placeholder="ពណ៍នា"

                                        />
                                    </div>
                                </div>

                                <div className='grid gap-3 p-2 border-2'>
                                    <div className="">
                                        <p htmlFor="email" className="text-xl font-bold text-center text-gray-600 font-NotoSansKhmer">
                                            របាយការណ៍ចាស់
                                        </p>
                                    </div>
                                    <table className="w-full border-collapse ">
                                        <thead className="p-2 text-white bg-blue-600/90">
                                            <tr>
                                                <th className="p-2 border w-[10%]">លេខរៀង</th>
                                                <th className="p-2 border w-[30%]">ឈ្មោះផលិតផល</th>
                                                <th className="p-2 border w-[15%]">តម្លៃដើម(ឯកតា)</th>
                                                <th className="p-2 border w-[15%]">បរិមាណទិញចូល</th>
                                                <th className="p-2 border w-[15%]">បញ្ចុះតម្លៃ</th>
                                                <th className="p-2 border w-[15%]">សរុប</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedProducts.length > 0 ? (
                                                selectedProducts.map((product, index) => {
                                                    return (
                                                        <tr key={product.id}>
                                                            <td className="p-2 w-[7%]">{index + 1}</td>
                                                            <td className="p-2">
                                                                {product.pro_names}  {product.product_id}
                                                                <p className="text-xs text-gray-500">
                                                                    {product.unit_names}
                                                                </p>
                                                            </td>
                                                            <td className="w-[10%] text-center">
                                                                <input
                                                                    type="number"
                                                                    readOnly
                                                                    value={product.qty}
                                                                    placeholder="0.0"
                                                                    className="input_text"
                                                                />
                                                                <span className='text-xs'> {product.unit_names}</span>
                                                            </td>

                                                            <td className="w-[10%]">

                                                                <p className='input_text'>$ {product.price}</p>
                                                            </td>
                                                            <td className="w-[10%]">
                                                                <p className='input_text'>$ {product.pro_discount}</p>
                                                            </td>
                                                            <td className="w-[10%]">

                                                                <p className='input_text'>$ {((product.qty * product.price) - (product.pro_discount * product.qty)).toFixed(2)}</p>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={10} className="p-2 text-center text-gray-500">
                                                        សូមជ្រើសរើសផលិតផល
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <br />
                                        <tr
                                            className='bg-gray-300'>
                                            <td colSpan="2" className="h-20 font-bold text-center">របាយការណ៍ចាស់</td>
                                            <td colSpan="2" className="py-2 space-y-3 font-bold text-gray-700">
                                                <p>សរុប</p>
                                                <hr />
                                                <span>បញ្ចុះតម្លៃ</span>
                                                <hr />
                                                <span>ចំនួនការទូទាត់សរុប</span>
                                                <hr />
                                                <span className='text-red-500'>នៅនៅខ្វះ</span>
                                            </td>
                                            <td colSpan="2" className="py-2 space-y-3 font-bold text-gray-700">
                                                {selectedProducts?.[0]?.type_currency !== "usd" && (
                                                    <span>
                                                        {selectedProducts?.[0]?.total_amount_dola ?? "0.00"} $ <br />
                                                    </span>
                                                )}
                                                {/* {selectedProducts?.[0]?.balance_amount ?? "0.00"}<span className='uppercase'> {selectedProducts?.[0]?.type_currency}</span> */}
                                                <span>
                                                    {selectedProducts?.[0]?.type_currency === "usd" ? (
                                                        <div>
                                                            <span >
                                                                {selectedProducts?.[0]?.total_amount}  $
                                                            </span>
                                                        </div>
                                                    ) : selectedProducts?.[0]?.type_currency === "khr" ? (
                                                        <div>
                                                            <span >
                                                                {selectedProducts?.[0]?.total_amount}  រៀល
                                                            </span>
                                                        </div>
                                                    ) : selectedProducts?.[0]?.type_currency === "thb" ? (
                                                        <div>
                                                            <span>
                                                                {selectedProducts?.[0]?.total_amount} បាត
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </span>
                                                <hr />
                                                <span className='uppercase'> {selectedProducts?.[0]?.discount || '0.00'} $</span>
                                                <hr />
                                                <p>
                                                    <span>
                                                        {selectedProducts?.[0]?.type_currency === "usd" ? (
                                                            <div>
                                                                <span >
                                                                    {selectedProducts?.[0]?.balance_amount ?? "0.00"}  $
                                                                </span>
                                                            </div>
                                                        ) : selectedProducts?.[0]?.type_currency === "khr" ? (
                                                            <div>
                                                                <span >
                                                                    {selectedProducts?.[0]?.balance_amount ?? "0.00"}  រៀល
                                                                </span>
                                                            </div>
                                                        ) : selectedProducts?.[0]?.type_currency === "thb" ? (
                                                            <div>
                                                                <span>
                                                                    {selectedProducts?.[0]?.balance_amount ?? "0.00"} បាត
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </span>
                                                </p>
                                                <hr />
                                                <p className='text-red-500'>
                                                    <span>
                                                        {selectedProducts?.[0]?.type_currency === "usd" ? (
                                                            <div>
                                                                <span >
                                                                    {(
                                                                        (parseFloat(selectedProducts?.[0]?.total_amount) || 0) -
                                                                        (parseFloat(selectedProducts?.[0]?.balance_amount) || 0)
                                                                    ).toFixed(2)}    $
                                                                </span>
                                                            </div>
                                                        ) : selectedProducts?.[0]?.type_currency === "khr" ? (
                                                            <div>
                                                                <span >
                                                                    {(
                                                                        (parseFloat(selectedProducts?.[0]?.total_amount) || 0) -
                                                                        (parseFloat(selectedProducts?.[0]?.balance_amount) || 0)
                                                                    ).toFixed(2)}   រៀល
                                                                </span>
                                                            </div>
                                                        ) : selectedProducts?.[0]?.type_currency === "thb" ? (
                                                            <div>
                                                                <span>
                                                                    {(
                                                                        (parseFloat(selectedProducts?.[0]?.total_amount) || 0) -
                                                                        (parseFloat(selectedProducts?.[0]?.balance_amount) || 0)
                                                                    ).toFixed(2)}    បាត
                                                                </span>
                                                            </div>
                                                        ) : null}
                                                    </span>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                </div>

                            </div>
                            <div className="flex justify-end mt-5">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 font-semibold text-white bg-blue-500 font-NotoSansKhmer hover:bg-blue-600"
                                >

                                    {isSubmitting ? 'រក្សាទុក...' : 'រក្សាទុក'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customerpayment