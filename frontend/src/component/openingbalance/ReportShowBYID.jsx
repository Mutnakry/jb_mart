import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../service/api';
import { IoPrint } from 'react-icons/io5';
import { Link, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import Navbar from '../Navbar';


const Cost = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [costs, setCosts] = useState([]);
    const [SumProduct, setSumProduct] = useState([]);
    const [CReturn, setCRetern] = useState([]);
    const [Reports, setReport] = useState([]);
    const [opening_date, setOpening_date] = useState('')
    const [clost_date, setClost_date] = useState('')
    useEffect(() => {
        GetAllData();
    }, [id]);

    // Fetch all data
    const GetAllData = async () => {
        try {
            const resClostReport = await axios.get(`${API_URL}/api/opencash/clostreport/${id}`);
            setReport(resClostReport.data)
            console.log("API Response:", resClostReport.data);
            if (resClostReport.data.length > 0) {
                const reportData = resClostReport.data[0];
                setOpening_date(reportData.opening_date);
                setClost_date(reportData.end_date); 
            } else {
                console.warn("No report data found");
            }
            const resCost = await axios.get(`${API_URL}/api/opencash/cost/${id}`);
            const resProduct = await axios.get(`${API_URL}/api/opencash/product/${id}`);
            const resSumProduct = await axios.get(`${API_URL}/api/opencash/sumProduct/${id}`);
            const resSumCuaromerReturn = await axios.get(`${API_URL}/api/opencash/customer_return/${id}`);

            setCRetern(resSumCuaromerReturn.data);
            setSumProduct(resSumProduct.data);
            setCosts(resCost.data);
            setProducts(resProduct.data);
        } catch (error) {
            console.error("API Fetch Error:", error);
        }
    };
    const totalAmountPriceCost = costs.reduce((sum, cost) => sum + parseFloat(cost.price || 0), 0);
    const totalAmountTax = costs.reduce((sum, cost) => sum + parseFloat(cost.tax || 0), 0);
    const totalAmountPayment = costs.reduce((sum, cost) => sum + parseFloat(cost.payment || 0), 0);

    const totalAmountCReturn = CReturn.reduce((sum, product) => sum + parseFloat(product.balance_usd || 0), 0);
    const totalAmountPrice = SumProduct.reduce((sum, product) => sum + parseFloat(product.total_amount_dola || 0), 0);

    const totalAmountDiscount = SumProduct.reduce((sum, product) => sum + parseFloat(product.total_discount || 0), 0);
    const totalAmountPriceUSD = SumProduct
        .filter(order => order.type_currency === "usd")
        .reduce((sum, product) => sum + parseFloat(product.total_amount || 0), 0);
    const totalAmountPriceTHB = SumProduct
        .filter(order => order.type_currency === "thb")
        .reduce((sum, product) => sum + parseFloat(product.total_amount || 0), 0);

    const totalAmountPriceKHR = SumProduct
        .filter(order => order.type_currency === "khr")
        .reduce((sum, product) => sum + parseFloat(product.total_amount || 0), 0);

    const totalAmountPriceUSDPay = SumProduct
        .filter(order => order.type_currency === "usd")
        .reduce((sum, product) => sum + parseFloat(product.balance_amount || 0), 0);

    const totalAmountPriceTHBPay = SumProduct
        .filter(order => order.type_currency === "thb")
        .reduce((sum, product) => sum + parseFloat(product.balance_amount || 0), 0);

    const totalAmountPriceKHRPay = SumProduct
        .filter(order => order.type_currency === "khr")
        .reduce((sum, product) => sum + parseFloat(product.balance_amount || 0), 0);


    const totalQTY = products.reduce((sum, product) => sum + parseFloat(product.qty || 0), 0);
    const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price || 0), 0);
    const totalDisacount = products.reduce((sum, product) => sum + parseFloat(product.itemdiscount || 0), 0);
    const total = products.reduce((sum, product) => sum + parseFloat(product.total || 0), 0);



    const handlePrint = () => {
        window.print();
    };


    const handlePrintSale = () => {
        const printContents = document.getElementById('invoicesale').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    }; const handlePrintCost = () => {
        const printContents = document.getElementById('invoicepurcost').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    const TotalAmoountOpenBalance = Reports.reduce((sum, product) => sum + parseFloat(product.opening_balance || 0), 0);
    const handlePrintReport = () => {
        const printContents = document.getElementById('invoiceReport').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Refresh the page
    };

    return (
        <div className=''>
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0 p-4  sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 print:p-0 mt-10  print:mt-0 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">

                    <div className='print:hidden'>
                        <Link to={'/OpenBalenceList'}
                            className="flex  items-center gap-1 px-4 py-2 text-2xl w-16 text-center font-bold text-white bg-blue-500 hover:bg-blue-700"
                        >
                            <IoArrowBackSharp />
                        </Link>
                    </div>
                    <div id='invoiceReport'>
                        <div className='flex space-x-6'>
                            <h2 className="text-xl font-bold mb-4 print:mb-0">របាយការណ៍លក់ (ចំណូល) (ចំណាយ) (ចំណេញ​​)</h2>
                            <div className=" print:hidden">
                                <button
                                    className="flex items-center gap-1 px-4 py-1 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                    onClick={handlePrintReport}
                                    type="button"
                                >
                                    <IoPrint /> <span>បោះពុម្ភ</span>
                                </button>
                            </div>
                        </div>
                        <div className='space-y-2 my-3'>
                            <p>  ចាប់ផ្ដើមបើកនៅមោង​ : {opening_date}</p>

                            <p> បិទនៅបើកមោង​ : {clost_date}</p>
                        </div>
                        <div className='bg-green-100 grid grid-cols-2 items-center text-gray-700 py-2 px-6'>
                            <div>
                                <p>ការលក់សរុប ($) :  ${totalAmountPrice}</p>
                            </div>
                            <div>
                                <p>ការលក់សរុបដុល្លា (ដុល្លា) :  ${totalAmountPriceUSDPay}</p>
                                <p>ការលក់សរុបរៀល (រៀល) :  {totalAmountPriceKHRPay} រៀល</p>
                                <p>ការលក់សរុបបាត (បាត) :  {totalAmountPriceTHBPay} បាត</p>
                            </div>
                        </div>
                        <div className='bg-green-100 text-gray-700 py-2 px-6 border-t border-white'>
                            សរុបអតិជនសងត្រឡប់ ($):  ${totalAmountCReturn.toFixed(2)}
                        </div>
                        <div className='bg-red-100 text-gray-700 py-2 px-6 border-t border-white'>
                            សរុបការចំណាយប្រចាំថ្ងៃ ($):  ${totalAmountPriceCost}
                        </div>
                        <div className='bg-red-100 text-gray-700 py-2 px-6 border-t border-white'>
                            ការបើកសមតុល្យលក់ ($):  ${TotalAmoountOpenBalance}
                        </div>
                        <div className='bg-green-200 text-gray-700 py-2 px-6 border-t border-blue-500 mt-4'>
                            ចំណូលសរុប​ ($) : ${totalAmountPrice}
                            <br />
                            ចំណាយសរុប​ ($) : ${totalAmountPriceCost + TotalAmoountOpenBalance}
                            <br />
                            ចំណេញសរុប​ ($) : ${((totalAmountPrice) - (totalAmountPriceCost + TotalAmoountOpenBalance)).toFixed(2)}
                        </div>
                    </div>
                    <div >
                        <div className='mt-8' id='invoicesale'>
                            <div className='flex space-x-6'>
                                <h2 className="text-xl font-bold mb-4 print:mb-0">របាយការណ៍លក់ផលិតផល</h2>
                                <div className=" print:hidden">
                                    <button
                                        className="flex items-center gap-1 px-4 py-1 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                        onClick={handlePrintSale}
                                        type="button"
                                    >
                                        <IoPrint /> <span>បោះពុម្ភ</span>
                                    </button>
                                </div>
                            </div>
                            <table className="border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 p-2">#</th>
                                        <th className="border border-gray-400 p-2">ឈ្មោះផលិតផល</th>
                                        <th className="border border-gray-400 p-2">ចំនួន</th>
                                        <th className="border border-gray-400 p-2">តម្លែ</th>
                                        <th className="border border-gray-400 p-2">បញ្ចុះតម្លែក្នុងមួយផលិតផល</th>
                                        <th className="border border-gray-400 p-2">សរុប</th>
                                        <th className="border border-gray-400 p-2">លក់ដោយ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.length > 0 ? (
                                        products?.map((product, index) => (
                                            <tr key={product.id} className="border border-gray-400">
                                                <td className="border border-gray-400 p-2">{index + 1}</td>
                                                <td className="border border-gray-400 p-2">{product.pro_names}</td>
                                                <td className="border border-gray-400 p-2">{product.qty} {product.unit_names}</td>
                                                <td className="border border-gray-400 p-2">${product.price}</td>
                                                <td className="border border-gray-400 p-2">${product.itemdiscount}</td>
                                                <td className="border border-gray-400 p-2">${product.total}</td>
                                                <td className="border border-gray-400 p-2">{product.user_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center p-4">No products found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tr className='bg-green-300'>
                                    <td colSpan="2" className="font-bold text-center">សរុប</td>
                                    <td colSpan="1" className="font-bold px-4 py-1">
                                        {totalQTY}
                                    </td>
                                    <td colSpan="1" className="font-bold px-4 py-1">
                                        ${totalPrice.toFixed(2)}
                                    </td>
                                    <td colSpan="1" className="font-bold px-4 py-1">
                                        ${totalDisacount.toFixed(2)}
                                    </td>
                                    <td colSpan="2" className="font-bold px-4 py-1">
                                        ${total.toFixed(2)}
                                    </td>
                                </tr>

                                <tfoot className="bg-white">
                                    <tr >
                                        <br />

                                    </tr>

                                    <tr>
                                        <td colSpan="5" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបចំនួនជា ($):</td>
                                        <td colSpan="2" className="font-bold px-6 py-1">
                                            ${totalAmountPrice}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបបញ្ចុះតម្លៃ ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1">
                                            ${totalAmountDiscount}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5" className="font-bold text-center bg-white">បានបង់ទឹកប្រាក់សរុបចំនួន :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1">
                                            <span> {totalAmountPriceUSDPay} $</span>
                                            <br />
                                            <span>{totalAmountPriceKHRPay} រៀល</span>
                                            <br />
                                            <span>{totalAmountPriceTHBPay} បាត</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5" className="font-bold text-center bg-white">នៅខ្វះទឹកប្រាក់ចំនួន :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1">
                                            <span> {totalAmountPriceUSD - totalAmountPriceUSDPay} $</span>
                                            <br />
                                            <span>{totalAmountPriceKHR - totalAmountPriceKHRPay} រៀល</span>
                                            <br />
                                            <span>{totalAmountPriceTHB - totalAmountPriceTHBPay} បាត</span>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="5" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបចំនួន:</td>
                                        <td colSpan="2" className="font-bold px-6 py-1">
                                            <span> ${totalAmountPriceUSD}</span>
                                            <br />
                                            <span>{totalAmountPriceKHR} រៀល</span>
                                            <br />
                                            <span> {totalAmountPriceTHB} បាត</span>

                                        </td>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>
                        <div className='mt-8' id='invoicepurcost'>
                            <div className='flex space-x-6'>
                                <h2 className="text-xl font-bold mb-4 print:mb-0">របាយការណ៍ចំណាយចាំថ្ងៃ</h2>
                                <div className=" print:hidden">
                                    <button
                                        className="flex items-center gap-1 px-4 py-1 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                        onClick={handlePrintCost}
                                        type="button"
                                    >
                                        <IoPrint /> <span>បោះពុម្ភ</span>
                                    </button>
                                </div>
                            </div>
                            <table className="border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 p-2">#</th>
                                        <th className="border border-gray-400 p-2">ថ្ងៃបញ្ជាទិញ</th>
                                        <th className="border border-gray-400 p-2">ផលិតផល</th>
                                        <th className="border border-gray-400 p-2">បន្ងែមដោយ</th>
                                        <th className="border border-gray-400 p-2">ប្រភេទចន្លោះពេល </th>
                                        <th className="border border-gray-400 p-2">	តម្លែ</th>
                                        <th className="border border-gray-400 p-2">ពន្ធ</th>
                                        <th className="border border-gray-400 p-2">បានបង់</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {costs.length > 0 ? (
                                        costs.map((cost, index) => (
                                            <tr key={cost.id} className="border border-gray-400">
                                                <td className="border border-gray-400 p-2">{index + 1}</td>
                                                <td className="border border-gray-400 p-2">{cost.dob}</td>
                                                <td className="border border-gray-400 p-2">{cost.type_names}</td>
                                                <td className="border border-gray-400 p-2">{cost.user_at}</td>
                                                <td className="border border-gray-400 p-2">{cost.interval}{cost.interval_type}</td>
                                                <td className="border border-gray-400 p-2">{cost.price}</td>
                                                <td className="border border-gray-400 p-2">{cost.tax}</td>
                                                <td className="border border-gray-400 p-2">{cost.payment}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center p-4">No cost data found</td>
                                        </tr>
                                    )}

                                </tbody>
                                <tfoot className="bg-white">
                                    <tr >
                                        <br />
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបចំនួន ​($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span>${totalAmountPriceCost}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">ពន្ធសរុប ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span>${totalAmountTax} </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">បានបង់ទឹកប្រាក់សរុបចំនួន ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span> ${totalAmountPayment}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">នៅខ្វះទឹកប្រាក់ចំនួន ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span>${totalAmountPriceCost - totalAmountPayment} </span>
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
                        </div>

                        {/* <div className='mt-8' id='invoicepurreturnproduct'>
                            <div className='flex space-x-6'>
                                <h2 className="text-xl font-bold mb-4 print:mb-0">របាយការណ៍លក់ផលិតផលប្ដូរយកវិញ</h2>
                                <div className=" print:hidden">
                                    <button
                                        className="flex items-center gap-1 px-4 py-1 font-bold text-white bg-blue-500 hover:bg-blue-700"
                                        onClick={handlePrintReturnProduct}
                                        type="button"
                                    >
                                        <IoPrint /> <span>បោះពុម្ភ</span>
                                    </button>
                                </div>
                            </div>
                            <table className="border-collapse border border-gray-400 w-full">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-400 p-2">#</th>
                                        <th className="border border-gray-400 p-2">ថ្ងៃសងត្រឡប់វិញ</th>
                                        <th className="border border-gray-400 p-2">ឈ្មោះផលិតផល </th>
                                        <th className="border border-gray-400 p-2">	តម្លែ</th>
                                        <th className="border border-gray-400 p-2">ចំនួន</th>
                                        <th className="border border-gray-400 p-2">បញ្ចុះតម្លែ</th>
                                        <th className="border border-gray-400 p-2">សរុប</th>
                                        <th className="border border-gray-400 p-2">ពណ៍នា</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CReturnProduct.length > 0 ? (
                                        CReturnProduct.map((cost, index) => (
                                            <tr key={cost.id} className="border border-gray-400">
                                                <td className="border border-gray-400 p-2">{index + 1}</td>
                                                <td className="border border-gray-400 p-2">{cost.payment_date}</td>
                                                <td className="border border-gray-400 p-2">{cost.pro_names}</td>
                                                <td className="border border-gray-400 p-2">{cost.price}</td>
                                                <td className="border border-gray-400 p-2">{cost.qty} {cost.unit_names}</td>
                                                <td className="border border-gray-400 p-2">{cost.discount}</td>
                                                <td className="border border-gray-400 p-2">{cost.total}</td>
                                                <td className="border border-gray-400 p-2">{cost.description}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center p-4">No cost data found</td>
                                        </tr>
                                    )}
                                </tbody>
                                <tr className='bg-green-300'>
                                    <td colSpan="3" className="font-bold text-center">សរុប</td>
                                    <td colSpan="1" className="font-bold px-4 py-1">
                                        ${CReturnProduct.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0).toFixed(2)}
                                    </td>
                                    <td colSpan="1" className="font-bold px-4 py-1">
                                        {CReturnProduct.reduce((sum, product) => sum + (parseFloat(product.qty) || 0), 0)}
                                    </td>
                                    <td colSpan="1" className="font-bold px-4 py-1">
                                        ${CReturnProduct.reduce((sum, product) => sum + (parseFloat(product.discount) || 0), 0).toFixed(2)}
                                    </td>
                                    <td colSpan="2" className="font-bold px-4 py-1">
                                        ${CReturnProduct.reduce((sum, product) => sum + (parseFloat(product.total) || 0), 0).toFixed(2)}
                                    </td>
                                </tr>
                                <tfoot className="bg-white">
                                    <tr >
                                        <br />
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបចំនួន ​($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span>${totalAmountSumCReturnProduct}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">ទឹកប្រាក់ថ្ងៃខូចខាត ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span>${totalAmountSumdiscountAmount}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបសងត្រឡប់ទៅវិញ ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span> ${totalAmountSumBalandPayment}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan="6" className="font-bold text-center bg-white">ចំណេញបានមកវិញសុបចំនួន ($) :</td>
                                        <td colSpan="2" className="font-bold px-6 py-1 text-center">
                                            <span>${totalAmountSumBalandPayment - totalAmountSumCReturnProduct}</span>
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
                        </div> */}
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

                </div>
            </div>
        </div>
    );
};

export default Cost;
