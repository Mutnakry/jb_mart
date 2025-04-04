

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import { FaBackward } from "react-icons/fa6";
import { IoPrint } from 'react-icons/io5';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { API_URL } from '../../service/api'



const PurchaseDetails = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
  const [product_ID, setProduct_ID] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const today = new Date().toISOString().split('T')[0];


  const [amountDiscount, setAmountDiscount] = useState(0);
  const [amountTotal, setAmountTotal] = useState(0);
  const [amountTotalPay, setAmountTotalPay] = useState(0);
  const [amounPayDate, setAmountPayDate] = useState(0);
  const [createDob, setCreateDob] = useState(today);
  const [status, setStatus] = useState('completed');
  const [supplier_id, setSupplier_ID] = useState('');
  const [paymentType_ID, setPaymentType_ID] = useState(null);
  const [account_ID, setAccount_ID] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLoginNames, setUserLoginNames] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    setUserLoginNames(localStorage.getItem('user_names') || '');

  }, []);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/purchase/puchase/${id}`)
      .then((response) => {
        setPurchaseData(response.data);
        console.log("Purchase Data:", response.data);
        setEditableData(response.data);
        setAmountDiscount(response.data[0]?.amount_discount || 0);
        setAmountTotal(response.data[0]?.amount_pay || 0);
        setAmountPayDate(response.data[0]?.pay_date || 0);
        setCreateDob(response.data[0]?.date_by || today);
        setStatus(response.data[0]?.status);
        setSupplier_ID(response.data[0]?.supplier_id);
        setPaymentType_ID(response.data[0]?.paymenttype_id);
        setAccount_ID(response.data[0]?.account_id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);


  ///// product
  const [editableData, setEditableData] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_URL}/api/product/all`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  useEffect(() => {
    fetchsupplier();
    getPaymentType();
    getAccountBank();
  }, [])

  ///// supplier
  const [supplier, setsupplier] = useState([]);
  const fetchsupplier = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:6700/api/supplier');
      setsupplier(response.data.supplier);
      setError('');
    } catch (error) {
      setError('Error fetching supplier data');
    } finally {
      setLoading(false);
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


  const filteredOptionsProduct = products.filter((product) =>
    product.pro_names.toLowerCase().includes(product_ID.toLowerCase())
  );



  const handleInputChange = (index, field, value) => {
    // Ensure the value is not less than 0
    const validatedValue = value >= 0 ? Number(value) : 0;
    const updatedData = [...editableData];
    updatedData[index][field] = validatedValue;
    setEditableData(updatedData);
  };


  const handleSubmit1 = async (e) => {
    e.preventDefault();

    // Validation
    if (editableData.length === 0) {
      toast.error("សូមបន្ថែមផលិតផលយ៉ាងហោចណាស់មួយ.", {
        position: "top-right",
        autoClose: 1000,
      });
      return;
    }

    // Prepare products data
    const productsData = editableData.map((item) => ({
      supplier_id: supplier_id,
      product_id: item.product_id || item.id,
      date_by: createDob,
      qty: item.qty,
      discount: item.discount,
      cost_price: item.cost_price,
      included_tax: item.include_tax,
      excluded_tax: item.exclude_tax,
      total: item.qty * item.exclude_tax - item.discount + item.include_tax,
      status: status,
      user_at: userLoginNames,
    }));

    // Prepare order data
    const orderData = {
      customerId: id,
      paymenttype_id: paymentType_ID,
      account_id: account_ID,
      amount_total: editableData.reduce((sum, item) => {
        const qty = Number(item.qty) || 0;
        const excludeTax = Number(item.cost_price) || 0;
        const discount = Number(item.discount) || 0;
        const includeTax = Number(item.include_tax) || 0;
        return sum + (qty * excludeTax - (discount - includeTax));
      }, 0),
      amount_discount: amountDiscount,
      amount_pay: amountTotal,
      pay_date: amounPayDate,
      products: productsData,
    };

    console.log(orderData);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/purchase/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Purchase updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/purchase");
      } else {
        toast.error(result.message || "Failed to update purchase.", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Failed to update purchase 1233.", {
        position: "top-right",
        autoClose: 1000,
      });
      // setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }






  const totalAmount = editableData.reduce((sum, item) => {
    const qty = Number(item.qty) || 0;
    const excludeTax = Number(item.cost_price) || 0;
    const discount = Number(item.discount) || 0;
    const includeTax = Number(item.include_tax) || 0;
    const totalPrice = qty * excludeTax - (discount - includeTax);
    return sum + totalPrice;
  }, 0);

  const finalAmount = Number(totalAmount) - Number(amountDiscount) - (Number(amountTotalPay) + Number(amountTotal));

  const handlePrint = () => {
    // const printContents = document.getElementById('invoice').innerHTML;
    // const originalContents = document.body.innerHTML;
    // document.body.innerHTML = printContents;
    window.print();
    // document.body.innerHTML = originalContents;
  };

  return (
    <div>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className='py-12 px-6 ml-64 print:ml-0 print:px-0 print:py-0 md:w-auto w-[860px] print:w-full bg-gray-200 dark:bg-gray-950'>
        <div className="w-full p-4 print:p-0 mt-10 print:mt-0 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">
          <div className="my-4 print:hidden">
            <Link
              type="button"
              to={'/purchase'}
              className="px-4 w-36 items-center space-x-1 flex py-2 font-semibold text-white font-NotoSansKhmer bg-blue-500 hover:bg-blue-600"
            >

              <FaBackward /> <span>ត្រឡប់ក្រោយ</span>
            </Link>
          </div>
          <div className="p-6  print:border-0 print:shadow-none">
            <div className=" text-md px-4">
              <div className='space-y-1 flex justify-center'>
                <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>
              </div>
              <div className='flex justify-between'>
                {/* Purchase Information */}
                <div>
                  <p>អ្នកផ្គត់ផ្កង់ :
                    <span className='text-xl font-NotoSansKhmer'>
                      {purchaseData?.[0]?.business_names || ''} {purchaseData?.[0]?.full_names || ''}
                    </span>
                  </p>
                  <p>លេខទូរស័ព្ទ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.contect_phone || 'មិនមាន'}</span></p>
                  <p>កាលបរិច្ខេទ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.date_by ? formatDateToKhmer(new Date(purchaseData[0].date_by)) : 'មិនមាន'}</span></p>
                  {/* <p>បន្ថែមដោយ : <span className='font-NotoSansKhmer capitalize'>{purchaseData?.[0]?.user_at || 'មិនមាន'}</span></p> */}
                  <p>ម៉ាកលីយ៉ូ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.brand_names || 'មិនមាន'}</span></p>
                </div>

                {/* Product Information */}
                <div>
                  <p>អាជីវកម្ម: : <span className='font-NotoSansKhmer capitalize'>{purchaseData?.[0]?.contect_type || 'មិនមាន'}</span></p>
                  <p>ប្រភេទទំនិញ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.cat_names || 'មិនមាន'}</span></p>

                </div>
                {/* Additional Product Information */}
                <div>
                  {/* <p>ប្រភេទពន្ធលើតម្លៃលក់ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.type_of_tax || 'មិនមាន'}</span></p> */}
                  <p>ស្ថានភាពទិញ : <span className='font-NotoSansKhmer capitalize'>
                    {editableData.some(purchase => purchase.status === 'active') && (
                      <span className="font-NotoSansKhmer">
                        កំពុងរងចាំ
                      </span>
                    )}
                    {editableData.some(purchase => purchase.status === 'pending') && (
                      <span className="font-NotoSansKhmer">
                        បានបញ្ជាទិញ
                      </span>
                    )}
                    {editableData.some(purchase => purchase.status === 'completed') && (
                      <span className="font-NotoSansKhmer">
                        បានទទួល
                      </span>
                    )}
                  </span></p>
                  <p>
                    {purchaseData?.[0]?.cat_names === 'disable' ? (
                      <p>
                        <span className="font-NotoSansKhmer">ស្តុក</span> :  <span className="font-NotoSansKhmer">មិនមានគ្រប់គ្រងស្តុក</span>

                      </p>
                    ) : (
                      <p>
                        <span className="font-NotoSansKhmer">ស្តុក</span> :  <span className="font-NotoSansKhmer">គ្រប់គ្រងស្តុក</span>

                      </p>
                    )}
                  </p>
                </div>

              </div>

            </div>
          </div>
          {purchaseData.length > 0 ? (
            <form>


              <table>
                <div className='pb-12 '>
                  <thead className="p-2 text-white bg-blue-600/90">
                    <tr>
                      <th className="p-2 border w-[7%]">លេខរៀង</th>
                      <th className="p-2 border w-[20%]">ឈ្មោះផលិតផល</th>
                      <th className="p-2 border w-[10%]">តម្លៃដើម(ឯកតា $)</th>
                      <th className="p-2 border w-[10%]">បរិមាណទិញចូល</th>
                      <th className="p-2 border w-[10%]">តម្លៃលក់ចេញ(ឯកតា $)</th>
                      <th className="p-2 border w-[10%]">បញ្ចុះតម្លៃ $</th>
                      <th className="p-2 border w-[10%]">ពន្ធសរុប</th>
                      <th className="p-2 border w-[15%]">សរុប</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableData.map((item, index) => {
                      const qty = Number(item.qty) || 0;
                      const excludeTax = Number(item.cost_price) || 0;
                      const discount = Number(item.discount) || 0;
                      const includeTax = Number(item.include_tax) || 0;
                      const totalPrice = (qty * excludeTax) - (discount - includeTax);
                      return (
                        <tr key={`${item.id}-${index}`} className="">
                          <td className="p-2 w-[7%]">{index + 1}</td>
                          <td className="p-2">
                            {item.pro_names}
                          </td>
                          <td>
                            {item.cost_price} $
                          </td>
                          <td>
                            {item.qty}  {item.unit_names}
                          </td>
                          <td>
                            {item.exclude_tax} $
                          </td>
                          <td>
                            {item.discount} $
                          </td>

                          <td>
                            {item.include_tax} $
                          </td>

                          <td>
                            {totalPrice.toFixed(2)} $
                          </td>
                        </tr>

                      );
                    })}
                  </tbody>
                  <tfoot className="bg-white">
                    <tr >
                      <br />
                    </tr>
                    <tr className="bg-white">
                      <td colSpan="6" className="font-bold text-center bg-white">ចំនួនសរុប:</td>
                      <td colSpan="2" className="font-bold space-x-2 px-4 py-1 text-center">
                        {editableData
                          .reduce((total, item) => total + (Number(item.qty) || 0), 0)
                        }
                        <span className="ml-2">{editableData[0].unit_names}</span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបបញ្ចុះតម្លៃ $ :</td>
                      <td colSpan="2" className="font-bold px-4 py-1 text-center">

                        {Number(purchaseData[0].amount_discount).toLocaleString('en-US', {
                          style: 'decimal',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} $
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="font-bold text-center bg-white">បានបង់ះទឹកប្រាក់សរុបចំនួន :</td>
                      <td colSpan="2" className="font-bold px-4 py-1 text-center">
                        {purchaseData[0].amount_pay} $
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="font-bold text-center bg-white">នៅខ្វះទឹកប្រាក់ចំនួន :</td>
                      <td colSpan="2" className="font-bold px-4 py-1 text-red-500 text-center">
                        {/* {((purchaseData[0].amount_total) - ((purchaseData[0].amount_pay))).toFixed(2)} $ */}
                        {((purchaseData[0].amount_total) - ((Number(purchaseData[0].amount_pay)) + Number(purchaseData[0].amount_discount))).toFixed(2)} $
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបចំនួន:</td>
                      <td colSpan="2" className="font-bold px-4 py-1 text-center">
                        {purchaseData[0].amount_total} $
                      </td>
                    </tr>
                  </tfoot>
                </div>
              </table>
              <div className="flex justify-between my-6 mx-36">
                <div className='text-center'>
                  <h2 className='text-xl font-KhmerMoul'>  <span>ម្ចាស់ផលិតផល</span></h2>
                  <p>ហត្ថលេខា</p>
                </div>
                <div className='text-center'>
                  <h2 className='text-xl font-KhmerMoul'>  <span>ចែប៊ីម៉ាត់ប៉ោយប៉ែត</span></h2>
                  <p>ហត្ថលេខា</p>
                </div>
              </div>

              <div className="flex justify-end my-6 print:hidden">
                <button
                  className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                  onClick={handlePrint}
                  type="button"
                >
                  <IoPrint /> <span>បោះពុម្ភ</span>
                </button>
              </div>
            </form>
          ) : (
            <div>No purchase data found.</div>
          )}
        </div>
      </div>
    </div>

  );
};

export default PurchaseDetails;

