import Navbar from '../Navbar'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../service/api'
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoPrint } from 'react-icons/io5';



function Customerpayment() {
    const [customer, setSustomer] = useState('');
    // const [amountTotal, setAmounTotal] = useState(0);
    const [error, setError] = useState('');
    const { id } = useParams();
    const [selectedProducts, setSelectedProducts] = useState([]);
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`http://localhost:6700/api/repay/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch order data');
                }
                const data = await response.json();
                setSelectedProducts(data);
                setSustomer(data[0]?.full_names || data[0]?.business_names)
                // setAmounTotal(data[0]?.total_amount);
                console.log(data)
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOrderData();
    }, [id]);




    const handlePrint = () => {
        const printContents = document.getElementById('invoicesale').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };


    return (
        <div>
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0 px-4 sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 print:pt-0 print:p-0 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">
                    <div className='p-4'>
                        <div className="pb-6 ">
                            <p htmlFor="email" className="text-xl font-bold text-gray-600 font-NotoSansKhmer">
                                របាយការណ៍អតិជនបង់ប្រាក់
                            </p>
                        </div>
                        <form  id='invoicesale'>
                            <div className='grid gap-4 '>

                                <div className="px-6 print:border-0">
                                    {/* <div className="px-6 pb-6 print:border-0 print:shadow-none"> */}
                                    <div className=" text-md px-4 pt-4">
                                        <div className='space-y-1 flex justify-center'>
                                            <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>

                                        </div>
                                        <div className='flex justify-between'>
                                            {/* Purchase Information */}
                                            <div>
                                                <p>អ្នកផ្គត់ផ្កង់ :   {customer} </p>
                                                <p>កាលបរិច្ខេទ : <span className='font-NotoSansKhmer'>{selectedProducts?.[0]?.date_order}</span></p>
                                                {/* <p>ម៉ាកលីយ៉ូ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.brand_names || 'មិនមាន'}</span></p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=''>
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
                                                                {product.pro_names}
                                                                <p className="text-xs text-gray-500">
                                                                    {product.unit_names}
                                                                </p>
                                                            </td>
                                                            <td className="w-[10%] text-center">
                                                                {product.qty} {product.unit_names}
                                                            </td>

                                                            <td className="w-[10%]">
                                                                $ {product.price}
                                                            </td>
                                                            <td className="w-[10%]">
                                                                <p className=''>$ {product.pro_discount}</p>
                                                            </td>
                                                            <td className="w-[10%]">

                                                                <p className=''>$ {((product.qty * product.price) - (product.pro_discount * product.qty)).toFixed(2)}</p>
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
                                            <td colSpan="2" className="h-20 font-bold text-center">សសរុបរបាយការណ៍</td>
                                            <td colSpan="2" className="py-2 space-y-3 font-bold text-gray-700  text-center">
                                                <p>សរុប</p>
                                                <hr />
                                                <span>បញ្ចុះតម្លៃ</span>
                                                <hr />
                                                <span>ចំនួនការទូទាត់សរុប</span>
                                                <hr />
                                                <span className='text-red-500'>នៅនៅខ្វះ</span>
                                            </td>
                                            <td colSpan="2" className="py-2 space-y-3 font-bold text-gray-700 text-center">
                                                {selectedProducts?.[0]?.type_currency !== "usd" && (
                                                    <span>
                                                        {selectedProducts?.[0]?.total_amount_dola ?? "0.00"} $ <br />
                                                    </span>
                                                )}
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customerpayment