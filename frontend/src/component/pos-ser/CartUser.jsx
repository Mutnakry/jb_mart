
import React, { useEffect, useState } from 'react';
import { FaMoneyBill, FaRegIdCard, FaRegMoneyBillAlt, FaHandHoldingMedical, FaQrcode } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { useCart } from '../pos/CartContext';
import { toast } from 'react-toastify';
import SearchAddToCartProduct from '../pos/SearchAddToCartProduct'
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import AddCustomer from '../contract/modal/AddCustomer';
import { API_URL } from '../../service/api'
import { Link, useNavigate } from 'react-router-dom';
import NullImage from '../../assets/image.png';


import QRCode from 'qrcode';
const {
  BakongKHQR,
  khqrData,
  IndividualInfo,
  MerchantInfo,
} = require("bakong-khqr");


const Cart = () => {
  const { cart, removeItem, clearCart, updateQuantity, holdOrder } = useCart();

  const [ispaymentTypeCurrency, setPaymentTypeCurrency] = useState('usd');
  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLoginNames, setUserLoginNames] = useState('');
  const [account_ID, setAccount_ID] = useState(null);
  const [paymentType_ID, setPaymentType_ID] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState("");
  const [payMoney, setPayMoney] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setUserLoginNames(localStorage.getItem('user_names') || '');
    getALLCustomer();
    getCurrencyData();
    getAccountBank();
    getPaymentType();
  }, [])
  // add customer
  const [customers, setCustomers] = useState([]);
  const [customer_ID, setCustomer_ID] = useState('1');
  const getALLCustomer = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer/getcustomerdiscount`);
      setCustomers(response.data); // Default to an empty array if no data
    } catch (error) {
      console.error('Error fetching customers data', error);
      toast.error('Error fetching customers data');
    }
  };

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

  ///// get payment Type
  const [paymentType, setPaymentType] = useState([]);
  const getPaymentType = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment_type`);
      setPaymentType(response.data.payment_type);
      console.log(response.data)
    } catch (error) {
      setError('Error fetching categories data');
    }
  };

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


  // const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [getCustomerDiscount, setGetCustomerDiscount] = useState("");
  const [total_amount_di_sum, seTtotal_amount_di_sum] = useState(0);
  const [TotalAmount_type_currency, setTotalAmount_type_currency] = useState('');

  useEffect(() => {
    const selectedCustomer = customers.find((customer) => customer.id === parseInt(customer_ID));
    if (selectedCustomer) {
      // setSelectedCustomerName(`${selectedCustomer.full_names} ${selectedCustomer.business_names}`);
      setGetCustomerDiscount(selectedCustomer.discount)
      seTtotal_amount_di_sum(selectedCustomer.total_amount_difference_sum)
      setTotalAmount_type_currency(selectedCustomer.type_currency)
      console.log('selectedCustomer', selectedCustomer.group_id);
      console.log('total_amount_di_sum', total_amount_di_sum);
      console.log('getCustomerDiscount', getCustomerDiscount);
      console.log('TotalAmount_type_currency', TotalAmount_type_currency);
    }
  }, [customer_ID, customers]);

  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);

  const openInsertModal = () => {
    if (cart.length === 0) {
      toast.error('មិនអាចរក្សាទុកបានទេ!', {
        position: "top-center",
        autoClose: 500,
      });
      setIsModalCustomer(false);
      return;
    }
    setIsInsertModalOpen(true);
  };

  const [isModalCustomer, setIsModalCustomer] = useState(false);


  const openInsertCustomer = () => {

    setIsModalCustomer(true);
  };


  const [exchanges, setExchanges] = useState(1);
  const handleChangepaymentType = (e) => {
    setPaymentTypeCurrency(e.target.value);
    setDeposit(0);
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

    setPayMoney(calculatedPayMoney);
    setExchanges(ExchangesPayment)
  };


  const handleRemoveItem = (id) => {
    removeItem(id);
    toast.success('លុបបានជោគជ័យ !', {
      position: "top-right",
      autoClose: 1000,
    });
  };



  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;

    if (item.mg_stock === "enable" && newQuantity > item.qty) {
      toast.error(`មានតែទំនិញ ${item.qty} ប៉ុណ្ណោះក្នុងស្តុក។`, {
        position: "top-right",
        autoClose: 1000,
      });
    } else if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    } else {
      removeItem(item.id);
    }
  };


  // Calculate total amount and discounts
  const totalAmount = cart.reduce((acc, item) => {
    const total = (item.quantity * item.exclude_tax);
    return acc + total;
  }, 0);

  const discountTotal = cart.reduce((acc, item) => {
    const total = (item.quantity * item.discount);
    return acc + total;
  }, 0);

  const handleClearCart = () => {
    const confirmed = window.confirm('Are you sure you want to clear the cart?');
    if (confirmed) {
      clearCart();
    }
  };

  // console.log('totalAmount',totalAmount)
  const finalTotal = totalAmount - discountTotal - getCustomerDiscount;

  const [payment, setPayment] = useState(0);
  const [Deposit, setDeposit] = useState(0);
  console.log('Deposit', Deposit)

  const handleChangeMoney = (e) => {
    const newMoney = parseFloat(e.target.value) || 0;
    if (isNaN(newMoney) || newMoney < 0) return;
    setPayMoney(newMoney);
    const newPayment = newMoney;
    setPayment(newPayment);

    if (ispaymentTypeCurrency == "usd") {
      const cashDeposit = newMoney > finalTotal ? newMoney - finalTotal : 0;
      setDeposit(cashDeposit);
    }
    else if (ispaymentTypeCurrency == "khr") {
      const cashDeposit = newMoney > (finalTotal * exchangeRateKHR) ? (newMoney - (finalTotal * exchangeRateKHR)) : 0;
      setDeposit(cashDeposit);
    } else if (ispaymentTypeCurrency == "thb") {
      const cashDeposit = newMoney > (finalTotal * (exchangeRateKHR / thbToKhrRateTHB)) ? (newMoney - finalTotal * (exchangeRateKHR / thbToKhrRateTHB)) : 0;
      setDeposit(cashDeposit);
    }
  };

  const [messageAmountDi, setMessageAmountDi] = useState("");



  
  const handleSaveData = async () => {
    // e.preventDefault();
    console.log("🛠️ handleSaveData function called!");

    // Validation
    if (cart.length === 0) {
      // alert("មិនអាចរក្សាទុកបានទេ!");
      toast.error('មិនអាចរក្សាទុកបានទេ!', {
        position: "top-center",
        autoClose: 500,
      });
      return;
    }

    let totalAmount = 0; // Declare totalAmount
    let totalDiscount = 0;

    //// ឆែកមើលថាតើ stock is set to 0 if not provided
    for (let item of cart) {
      const qty = item.quantity;
      const stock = item.qty || 0;
      if (stock < qty && item.mg_stock === "enable") {
        // Display error message using toast
        toast.error(`ស្តុកមិនគ្រប់គ្រាន់សម្រាប់ផលិតផល ${item.pro_names}!`, {
          position: "top-right",
          autoClose: 1000,
        });
        return;
      }
    }

    // Prepare product data
    const productsData = cart.map(item => {
      const qty = item.quantity;
      const discount = item.discount || 0;
      const tax = item.tax || 0;
      const totalPrice = qty * item.exclude_tax;
      const grandTotal = totalPrice - (discount * qty + tax);
      // Accumulate totals
      totalAmount += grandTotal;
      totalDiscount += discount * qty;

      return {
        customer_id: customer_ID,
        product_id: item.id,
        qty: qty,
        price: item.exclude_tax,
        discount: discount,
        total: grandTotal,
        user_at: userLoginNames,
      };
    });

    // Calculate payMoney based on currency type **after** totalAmount is calculated
    let calculatedPayMoney = finalTotal;
    if (ispaymentTypeCurrency === "usd") {
      calculatedPayMoney = finalTotal;
    } else if (ispaymentTypeCurrency === "khr") {
      calculatedPayMoney = finalTotal * exchangeRateKHR;
    } else if (ispaymentTypeCurrency === "thb") {
      calculatedPayMoney = finalTotal * (exchangeRateKHR / thbToKhrRateTHB);
    }

    setPayMoney(calculatedPayMoney);
    let newPayment = payMoney;
    if (payMoney > calculatedPayMoney) {
      newPayment = calculatedPayMoney
    } else if (payMoney < calculatedPayMoney) {
      newPayment = payMoney
    }

    if (total_amount_di_sum > 0) {

    }

    let convertedAmountUSD = newPayment;
    let exchangesPayment = 1;
    if (ispaymentTypeCurrency === "usd") {
      convertedAmountUSD = newPayment;
    } else if (ispaymentTypeCurrency === "khr" && exchangeRateKHR) {
      convertedAmountUSD = newPayment / exchangeRateKHR;
      exchangesPayment = 1 / exchangeRateKHR;
    } else if (ispaymentTypeCurrency === "thb" && exchangeRateKHR && thbToKhrRateTHB) {
      convertedAmountUSD = (newPayment * thbToKhrRateTHB) / exchangeRateKHR;
      exchangesPayment = thbToKhrRateTHB / exchangeRateKHR;
    }

    if (total_amount_di_sum > 0) {
      toast.error('ឈ្មោះនេះជុំពាក់លើកមុនមិនទាន់អាចទិញផលិតផលបានទេ!', {
        position: "top-center",
        autoClose: 500,
      });
      setMessageAmountDi('ឈ្មោះនេះជុំពាក់លើកមុនមិនទាន់អាចទិញផលិតផលបានទេ​!')
      return;
    }


    // Prepare final order data
    const orderData = {
      account_id: account_ID,
      paymenttype_id: paymentType_ID,
      total_amount_dola: finalTotal,
      total_amount: calculatedPayMoney || totalAmount,
      // balance_amount: payMoney || calculatedPayMoney, 
      balance_amount: newPayment || calculatedPayMoney,
      changes: exchanges,
      amount_discount: Number(getCustomerDiscount),
      type_currency: ispaymentTypeCurrency,
      balance_amount_usd: convertedAmountUSD || calculatedPayMoney,
      description: description,
      user_at: userLoginNames,
      products: productsData,
    };

    // setIsSubmitting(true);
    console.log("Order Data:", orderData);

    // navigate('/index/invoce');
    navigate('index/pos');


    // try {
    //   setIsSubmitting(true);
    //   const response = await fetch(`${API_URL}/api/order`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(orderData),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     navigate('/index/invoce');
    //     setAccount_ID('');
    //     setCustomer_ID('');
    //     setPaymentType_ID('');
    //     setPaymentTypeCurrency('usd')
    //     setIsInsertModalOpen(false);
    //     setIsModaleQRCode(false)
    //     setPayMoney(0);
    //     setPaymentTypeCurrency('usd');
    //     clearCart();
    //   } else {
    //     alert("Error: " + data.error);
    //   }
    // } catch (error) {
    //   console.error("Error during order submission:", error);
    //   alert("There was an error saving the order.");

    // } finally {
    //   setIsSubmitting(false);
    //   clearCart();
    //   setIsInsertModalOpen(false);
    //   setIsModaleQRCode(false)
    // }

  };

  return (
    <div className="min-h-screen p-5 px-2 mt-3 overflow-y-auto bg-gray-50 print:hidden">
      {/* Top Section */}
      <div className="grid justify-between gap-2 p-3 mb-2 bg-white xl:grid-cols-2 md:grid-cols-1">

        <div className="flex items-center space-x-2">
          <SearchAddToCartProduct />
        </div>
      </div>


      {/* Table Section */}
      <div className="overflow-x-auto h-[60vh] bg-white p-1  scrollbar-hidden">
        <table className="min-w-full text-center">
          <thead>
            <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-200 whitespace-nowrap">
              <th className="w-8 px-1 py-3">#</th>
              <th className="px-6 py-3">រូបភាព</th>
              <th className="px-2 py-3">ឈ្មោះ</th>
              {/* <th className=" px-6 py-3">stock</th> */}
              <th className="py-3">បរិមាណ</th>
              <th className="px-6 py-3">តម្លៃ+ពន្ធ</th>
              <th className="px-6 py-3">បន្ចុះតម្លៃ</th>
              <th className="px-6 py-3">សរុប</th>
              <th className="px-6 py-3 ">លុប</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-600">
            {cart.map((item, index) => (
              <tr className="border-b border-gray-200" key={index}>
                <td className="px-2 py-3">{index + 1}</td>
                <td>
                  {item.image ? (
                    <div className="flex items-center justify-center h-8">
                      <img
                        src={`${API_URL}/image/${item.image}`}
                        alt={item.pro_names}
                        className="object-contain w-full h-full "
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-8">
                      <img
                        src={NullImage}
                        alt={item.pro_names}
                        className="object-contain w-full h-full "
                      />
                    </div>
                  )}
                </td>
                <td className="py-3 whitespace-nowrap">{item.pro_names}</td>
                {/* <td className=" px-6 py-3">{item.qty}</td> */}
                <td>
                  <div className="flex items-center justify-between border border-pink-500">
                    <button
                      type="button"
                      className={`text-gray-500 text-xl w-full hover:text-white  px-4 ${item.quantity <= 1 ? 'cursor-not-allowed bg-gray-200' : 'hover:bg-pink-400'}`}
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="w-12 text-xl text-center border-l border-r border-pink-500"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      type="button"
                      className="w-full px-4 text-xl text-gray-500 hover:text-white hover:bg-pink-400"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      +
                    </button>
                  </div>
                  <input type="text" className='text-center input_text' value={item.unit_names} readOnly />
                </td>
                <td className="px-6 py-3">$ {(item.exclude_tax)} </td>
                <td className="px-6 py-3">$ {(item.discount)}</td>
                <td className="px-6 py-3">$ {((item.quantity * item.exclude_tax) - (item.discount * item.quantity)).toFixed(2)}</td>
                <td className="px-6 py-3">
                  <MdDeleteForever onClick={() => handleRemoveItem(item.id)} className="text-xl text-red-600 cursor-pointer" />
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-4 gap-4 px-6 py-4 text-sm bg-gray-200">

        <div className='space-y-1'>
          <p>សរុប:</p>
          <p>$ {totalAmount.toFixed(2)}</p>
          {finalTotal !== 0 && (
            <>
              <p>{(totalAmount * exchangeRateKHR).toFixed(2)} រៀល</p>
              <p>{(totalAmount * (exchangeRateKHR / thbToKhrRateTHB)).toFixed(2)} បាត</p>
            </>
          )}
        </div>
        <div className='space-y-1 s'>
          <p>ការបញ្ចុះតំលៃ:</p>
          <p>${discountTotal.toFixed(2)}</p>
          {discountTotal !== 0 && (
            <>
              <p>{(discountTotal * exchangeRateKHR).toFixed(2)} រៀល</p>
              <p>{(discountTotal * (exchangeRateKHR / thbToKhrRateTHB)).toFixed(2)} បាត</p>
            </>
          )}
        </div>
        <div className='space-y-1 s'>
          <p>បន្ថែម:</p>
          <p>${getCustomerDiscount}</p>
          <div className='col-span-4'>

            <p>{TotalAmount_type_currency === "usd" ? (
              <div>
                <span className="block mb-2 text-lg">
                  {total_amount_di_sum} $
                </span>
              </div>
            ) : TotalAmount_type_currency === "khr" ? (
              <div>
                <span className="block mb-2 text-lg">
                  {total_amount_di_sum} រៀល
                </span>
              </div>
            ) : TotalAmount_type_currency === "thb" ? (
              <div>
                <span className="block mb-2 text-lg">
                  {total_amount_di_sum} បាត
                </span>
              </div>
            ) : null}</p>
          </div>
        </div>
        <div className='space-y-1 s'>
          <p>សរុបចុងក្រោយ:</p>
          <p>${finalTotal.toFixed(2)}</p>
          {finalTotal !== 0 && (
            <>
              <p>{(finalTotal * exchangeRateKHR).toFixed(2)} រៀល</p>
              <p>{(finalTotal * (exchangeRateKHR / thbToKhrRateTHB)).toFixed(2)} បាត</p>
            </>
          )}
        </div>
      </div>

    
    </div>
  );
};

export default Cart;
