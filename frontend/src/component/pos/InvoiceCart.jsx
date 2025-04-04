

import React, { useEffect, useState } from 'react';
import Navbar from '../../view/pos/Navbar';
import { API_URL } from '../../service/api';
import axios from 'axios';
import { formatDateToKhmer } from '../ForMartDateToKHmer'
import { IoPrint } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../../assets/logo.png'

import QRCode from 'qrcode';
const {
    BakongKHQR,
    khqrData,
    IndividualInfo,
    MerchantInfo,
} = require("bakong-khqr");

function InvoiceCart() {
    const [invoice, setInvoice] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        getMaxInvoice();
    }, []);

    const getMaxInvoice = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/order/invoice`);
            setInvoice(response.data);
            console.log(response.data);
            // toast.info(`ចំនួនសរុប: ${response.data[0]?.total_amount || 0} ${response.data[0]?.type_currency || "USD"}`, {
            //     position: "top-right",
            //     autoClose: 5000,
            //     hideProgressBar: true,
            //     closeOnClick: true,
            // });
        } catch (error) {
            setError('Error fetching invoice data');
            console.error(error);
        }
    };

    const handlePrint = () => {
        // const printContents = document.getElementById('invoice').innerHTML;
        // const originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        window.print();
        // document.body.innerHTML = originalContents;
    };

    // useEffect(() => {
    //     if (invoice.length > 0) {
    //         window.print();
    //         navigate('/index/pos');
    //         await handleCheckOut();
    //     }
    // }, [invoice]);

    useEffect(() => {
        if (invoice.length > 0) {
            // Wait for the checkout process to complete before continuing
            const performCheckoutAndPrint = async () => {
                await handleCheckOut(); // Ensure the checkout process finishes first
                window.print();          // Trigger print after checkout
                navigate('/index/pos'); // Navigate after printing
            };

            performCheckoutAndPrint();  // Execute the sequence
        }
    }, [invoice]);

    const [qrimg, setQrimg] = useState(null);

    const handleCheckOut = async () => {
        console.log("🔄 Initiating Checkout Process...");

        const expirationTimestamp = new Date().getTime() + 15 * 60 * 1000;
        const amount = invoice?.[0]?.total_amount_dola;
        console.log("💰 Amount Sent to KHQR:", amount);

        const optionalData = {
            currency: khqrData.currency.usd,
            // currency: khqrData.currency.khr,
            amount: amount,
            billNumber: "#0001",
            mobileNumber: "85587344479",
            storeLabel: "Chamrouen PichSamphors",
            terminalLabel: "Phors I",
            expirationTimestamp: expirationTimestamp,
        };

        const individualInfo = new IndividualInfo(
            "pichsamphors_chamroeun@aclb",
            "Chamrouen PichSamphors",
            "Battambang",
            optionalData
        );

        const KHQR = new BakongKHQR();
        let individual = null;

        try {
            individual = KHQR.generateIndividual(individualInfo);
            console.log("✅ Generated Individual:", individual);
        } catch (error) {
            console.error("🚨 Error generating QR:", error);
        }

        if (individual?.data?.qr) {
            const qrData = await QRCode.toDataURL(individual.data.qr);
            setQrimg(qrData);
        } else {
            console.error("❌ QR data is missing:", individual?.data?.qr);
        }


        if (individual?.data?.md5) {
            console.log("🔍 Checking Transaction with MD5:", individual.data.md5);
            const isTransactionSuccess = await handleCheckTransaction(individual.data.md5);

            if (isTransactionSuccess) {
                console.log("✅ Transaction verified, calling handleSaveData...");
                // await handleSaveData();
            } else {
                console.log("❌ Transaction verification failed.");
            }
        } else {
            console.error("⚠️ MD5 is missing.");
        }
    };
    const handleCheckTransaction = async (md5) => {
        try {
            console.log("Checking transaction status with MD5:", md5);

            const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMmJjNzYzZDNlNmRmNDRiNyJ9LCJpYXQiOjE3MzU2MzI4NzksImV4cCI6MTc0MzQwODg3OX0.LvLaqsv-LvocVosQaXKOCzZQLIvOL4g4S4nN3kJB5fU"; // this token is renew in bakong open api document

            const response = await axios.post(
                'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5',
                { md5 },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("Transaction API Response:", response.data);

            if (response.status === 200 && response.data.responseMessage === 'Success') {
                console.log("✅ Transaction successful:", response.data);

                return true;
            } else {
                console.log("❌ Transaction failed:", response.data);
            }
        } catch (error) {
            console.error("🚨 Transaction check failed:", error.response?.data || error.message);
        }
        return false; // Ensure it returns false if the transaction is not successful
    };

    return (
        <div>
            <div className='print:hidden'>
                <Navbar />
            </div>
            <div className=' px-2 print:px-0 print:py-0 md:w-auto bg-gray-200 print:bg-white dark:bg-gray-950'>
                <div className="w-full mt-10 print:mt-0 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">
                    <div className="p-2 pt-6 print:pt-2 border-b mb-4 border-gray-500 print:px-0  print:shadow-none">
                        <div className="">
                            <div className='space-y-1 flex justify-center'>
                                {/* <img src={logo} className='md:h-36 h-28 mb-4' alt="" /> */}
                            </div>

                            <div className='space-y-1 flex justify-center'>

                                <h3 className="md:text-xl text-md font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>
                            </div>
                            <div className='space-y-1 text-center mb-2 font-light text-xs border-b'>
                                <p>ស្ថិតនៅភូមិ ក្បាលស្ពាន១ សង្កាត់ប៉ោយប៉ែត ក្រុងប៉ោយប៉ែត ខេត្តបន្ទាយមានជ័យ</p>
                                <p>លេខទូរស័ព្ទទំនាក់ទំនង : <span className='font-NotoSansKhmer capitalize'>097 488 673</span></p>
                            </div>

                            <div className='flex justify-between md:text-xl text-xs'>
                                {/* Purchase Information */}
                                <div>
                                    <p>លេខវិក្កយបត្រ : JB00-<span className='font-NotoSansKhmer'>{invoice?.[0]?.order_detail_id || 'មិនមាន'}</span></p>
                                    <p>ឈ្មោះអតិជន :
                                        <span className='font-NotoSansKhmer'>
                                            {invoice?.[0]?.business_names || ''} {invoice?.[0]?.full_names || ''}
                                        </span>
                                    </p>
                                    <p>លេខទូរស័ព្ទ : <span className='font-NotoSansKhmer'>{invoice?.[0]?.mobile_phone || 'មិនមាន'}</span></p>
                                    <p>កាលបរិច្ខេទ : <span className='font-NotoSansKhmer'>{invoice?.[0]?.create_at ? formatDateToKhmer(new Date(invoice[0].create_at)) : 'មិនមាន'}</span></p>
                                    <p>បន្ថែមដោយ : <span className='font-NotoSansKhmer capitalize'>{invoice?.[0]?.user_at || 'មិនមាន'}</span></p>

                                </div>

                                {/* Product Information */}
                                <div>
                                    {/* <p>លេខទូរស័ព្ទទំនាក់ទំនង : <span className='font-NotoSansKhmer capitalize'>097 488 673</span></p> */}
                                    {/* <p>ប្រភេទទំនិញ : <span className='font-NotoSansKhmer'>{invoice?.[0]?.cat_names || 'មិនមាន'}</span></p> */}

                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="min-w-full table-auto">
                        <thead className=" text-gray-700 print:table-header-group">
                            <tr className="font-NotoSansKhmer md:text-lg text-xs ">
                                <th className="px-4 border-b border-gray-500 border-t-0 border-x-0">លេខរៀង</th>
                                <th className="px-4 py-2 whitespace-nowrap border-b border-gray-500 border-t-0 border-x-0">ឈ្មោះផលិតផល</th>
                                <th className="px-4 py-2 border-b border-gray-500 border-t-0 border-x-0">ចំនួន</th>
                                <th className="px-4 py-2 border-b border-gray-500 border-t-0 border-x-0">បញ្ចុះតម្លៃ</th>
                                <th className="px-4 py-2 border-b border-gray-500 border-t-0 border-x-0">តម្លៃលក់</th>
                                <th className="px-4 py-2 border-b border-gray-500 border-t-0 border-x-0">សរុប</th>
                            </tr>
                        </thead>
                        <tbody className='md:text-lg text-xs text-gray-500'>
                            {invoice.map((item, index) => (
                                <tr key={index} className="border-b text-center border-0 whitespace-nowrap">
                                    <td className="py-2  border-y-0 border-x-0">{index + 1}</td>
                                    <td className="py-2 whitespace-nowrap  border-y-0 border-x-0">{item.pro_names || 'មិនមាន'}</td>
                                    <td className="py-2  border-y-0 border-x-0">{item.qty || '0'} </td>
                                    <td className="py-2  border-y-0 border-x-0">{item.discount || '0.00'} $</td>
                                    <td className="py-2  border-y-0 border-x-0">{item.price || '0.00'} $</td>
                                    <td className="py-2  border-y-0 border-x-0">{item.total || '0.00'} $</td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="bg-white md:text-lg text-xs">
                            <tr >
                                <br />
                            </tr>
                            <tr className="bg-white">
                                <td colSpan="4" className="font-bold text-center border-b border-t-0 border-x-0  bg-white">ចំនួនសរុប:</td>

                                <td colSpan="2" className="font-bold space-x-2 py-1 text-center  border-t-0 border-x-0 bg-white">
                                    {invoice[0]?.type_currency !== 'usd' ? (
                                        // Format the amount in USD with two decimal places and thousand separators
                                        <>
                                            {Number(invoice[0]?.total_amount_dola || 0).toLocaleString('en-US', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}{' '}
                                            $
                                            <br />
                                        </>
                                    ) : null}
                                    {Number(invoice[0]?.total_amount || 0).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                    {(invoice[0]?.type_currency === 'usd') ? (
                                        <span className="uppercase"> $</span>

                                    ) : (invoice[0]?.type_currency === 'khr') ? (
                                        <span className="uppercase">រៀល </span>

                                    ) : (invoice[0]?.type_currency === 'thb') ? (
                                        <span className="uppercase">បាត</span>

                                    ) : null}
                                </td>
                            </tr>

                            <tr className="bg-white">
                                <td colSpan="4" className="font-bold text-center border-b border-t-0 border-x-0 bg-white">ទឹកប្រាក់សរុបបញ្ចុះតម្លៃ $ :</td>
                                <td colSpan="2" className="font-bold py-1 text-center border-b border-t-0 border-x-0 bg-white">
                                    {Number(invoice[0]?.discount || 0).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })} $
                                </td>
                            </tr>

                            <tr className="bg-white">
                                <td colSpan="4" className="font-bold text-center border-t-0 border-x-0 bg-white">បានបង់ះទឹកប្រាក់សរុបចំនួន :</td>
                                <td colSpan="2" className="font-bold  py-1 text-center border-b border-t-0 border-x-0 bg-white">

                                    {Number(invoice[0]?.balance_amount || 0).toLocaleString('en-US', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}

                                    {(invoice[0]?.type_currency === 'usd') ? (
                                        <span className="uppercase"> $</span>

                                    ) : (invoice[0]?.type_currency === 'khr') ? (
                                        <span className="uppercase"> រៀល </span>

                                    ) : (invoice[0]?.type_currency === 'thb') ? (
                                        <span className="uppercase"> បាត</span>

                                    ) : null}

                                </td>
                            </tr>
                            {invoice[0]?.total_amount <= 0 ? (
                                <tr className="bg-white">
                                    <td colSpan="4" className="font-bold text-center border-b border-t-0 border-x-0 bg-white">នៅនៅជុះពាក់ទឹកប្រាក់ចំនួន :</td>
                                    <td colSpan="2" className="font-bold px-4 py-1 bg-white border-b border-t-0 border-x-0 text-red-500 text-center">
                                        {Number((invoice[0]?.total_amount || 0) - (invoice[0]?.balance_amount || 0)).toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                        {(invoice[0]?.type_currency === 'usd') ? (
                                            <span className="uppercase"> $</span>

                                        ) : (invoice[0]?.type_currency === 'khr') ? (
                                            <span className="uppercase"> រៀល </span>

                                        ) : (invoice[0]?.type_currency === 'thb') ? (
                                            <span className="uppercase"> បាត</span>

                                        ) : null}
                                    </td>
                                </tr>
                            ) : null}
                        </tfoot>
                    </table>
                    <div className='border-t my-12 text-center items-center justify-center flex-col border-gray-200 w-full flex'>
                        <div className='flex flex-col items-center justify-center'>
                            <p>
                                {qrimg ? (
                                    <img src={qrimg} alt="QR Code" />
                                ) : (
                                    <p>Loading QR code...</p>
                                )}
                            </p>
                            <h2 className='md:text-xl text-sm font-sans'>Thank You !</h2>
                            <p className='md:text-xl text-sm font-extralight'>
                                អគុណដែលបានជួយគ្រាំទ្រហាង ចែប៊ីម៉ាត់ របស់យើងខ្ញុំ
                            </p>
                            <p className='md:text-xl text-sm font-extralight'>
                                អាចបញ្ជាប្ដូរយកទំនិញវិញមានរយៈពេលត្រឹមតែ ៧ ថ្ងៃប៉ុណ្ណោះ !
                            </p>
                        </div>
                    </div>

                </div>



                <div className="flex justify-end my-8 print:hidden">
                    <button
                        className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                        onClick={handlePrint}
                        type="button"
                    >
                        <IoPrint /> <span>បោះពុម្ភ</span>
                    </button>
                </div>
            </div>

        </div>
    );
}

export default InvoiceCart;