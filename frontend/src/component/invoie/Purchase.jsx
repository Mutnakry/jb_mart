import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../service/api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import Navbar from '../Navbar';
import { IoPrint } from 'react-icons/io5';
import { TbRefresh } from "react-icons/tb";

function Purchase() {
    const [purchases, setPurchases] = useState([]);
    const [filteredPurchases, setFilteredPurchases] = useState([]); // Store filtered data
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');

    useEffect(() => {
        getAllPurchase();
    }, []);

    const getAllPurchase = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/invoice/purchase`);
            setPurchases(response.data);
            setFilteredPurchases(response.data); // Set initial filtered data
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        let filteredData = purchases;

        if (startDate && endDate) {
            filteredData = filteredData.filter((purchase) => {
                const payDate = new Date(purchase.purchase_date);
                return payDate >= new Date(startDate) && payDate <= new Date(endDate);
            });
        }

        if (supplierFilter) {
            filteredData = filteredData.filter((purchase) => {
                const fullSupplierName = `${purchase.business_names} ${purchase.full_names}`.toLowerCase();
                return fullSupplierName.includes(supplierFilter.toLowerCase());
            });
        }

        setFilteredPurchases(filteredData); // Update filtered purchases
    };

    const handleClearFilter = () => {
        setStartDate('');
        setEndDate('');
        setSupplierFilter('');
        setFilteredPurchases(purchases); // Reset to all data
    };

    const handlePrint = () => {
        // const printContents = document.getElementById('invoice').innerHTML;
        // const originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        window.print();
        // document.body.innerHTML = originalContents;
    };


    const nameCounts = filteredPurchases.reduce((acc, purchase) => {
        const fullName = `${purchase.business_names} ${purchase.full_names}`;
        acc[fullName] = (acc[fullName] || 0) + 1; // Count occurrences
        return acc;
    }, {});

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="print:hidden">
                <Navbar />
            </div>
            <div className='py-12 print:py-0 print:px-0 px-4 sm:ml-64 print:ml-0 md:w-auto w-[860px] bg-gray-200 dark:bg-gray-950'>
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">
                    <div className='flex items-center gap-2 pb-5 print:hidden'>
                        {/* <p className='text-xl font-bold font-NotoSansKhmer'>បន្ថែមការទិញ</p> */}
                        <div>
                            <label htmlFor="">ថ្ងៃចាប់ផ្ដើម</label>
                            <input
                                type="date"
                                className='input_text'
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="">ថ្ងៃបញ្ចប់</label>
                            <input
                                type="date"
                                className='input_text'
                                min={startDate}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="">អ្នកផ្គត់ផ្កង់</label>
                            <input
                                type="text"
                                className='input_text'
                                value={supplierFilter}
                                onChange={(e) => setSupplierFilter(e.target.value)}
                                placeholder="ស្វែងរកអ្នកផ្គត់ផ្កង់..."
                            />
                        </div>
                        <button onClick={handleClearFilter} className="bg-blue-500 text-xl text-white px-4 py-2 rounded"><TbRefresh /></button>
                        <button onClick={handleFilter} className="bg-blue-500 text-sm text-white px-4 py-2 rounded">ស្វែងរក</button>

                    </div>
                    <div className="px-6 pb-6 print:border-0 print:shadow-none hidden print:block">
                        {/* <div className="px-6 pb-6 print:border-0 print:shadow-none"> */}
                        <div className=" text-md px-4">
                            <div className='space-y-1 flex justify-center'>
                                <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>

                            </div>
                            <div className='flex justify-between'>
                                {/* Purchase Information */}
                                <div>
                                    <p>អ្នកផ្គត់ផ្កង់ :
                                        <span className='text-xl font-NotoSansKhmer'>
                                            {Object.entries(nameCounts).map(([name, count], index) => (
                                                <div key={index}>{name} <span>ទិញចំនួន {count} ដង</span></div>  // Show count next to name
                                            ))}
                                        </span>
                                    </p>
                                    {/* <p>កាលបរិច្ខេទ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.date_by ? formatDateToKhmer(new Date(purchaseData[0].date_by)) : 'មិនមាន'}</span></p> */}
                                    {/* <p>ម៉ាកលីយ៉ូ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.brand_names || 'មិនមាន'}</span></p> */}
                                </div>

                                {/* Product Information */}
                                {/* <div>
                                    <p>អាជីវកម្ម: : <span className='font-NotoSansKhmer capitalize'>{purchaseData?.[0]?.contect_type || 'មិនមាន'}</span></p>
                                    <p>ប្រភេទទំនិញ : <span className='font-NotoSansKhmer'>{purchaseData?.[0]?.cat_names || 'មិនមាន'}</span></p>

                                </div> */}
                                {/* Additional Product Information */}
                                {/* <div>
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
                                </div> */}

                            </div>

                        </div>
                    </div>
                    <div className="relative overflow-x-auto h-screen scrollbar-hidden">
                        {error && <p className="text-red-500">{error}</p>}
                        {filteredPurchases.length === 0 && !loading && <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ!</p>}

                        <table className="min-w-full table-auto">
                            <thead className="p-2 text-white bg-blue-600/90 text-sm">
                                <tr className="font-bold font-NotoSansKhmer">
                                    <th className="px-4 py-2">#</th>
                                    <th className="px-4 py-2">កាលបរិច្ឆេទ</th>
                                    <th className="px-4 py-2">ឈ្មោះផលិតផល</th>
                                    <th className="px-4 py-2">ចំនួន</th>
                                    <th className="px-4 py-2">អ្នកផ្គត់ផ្កង់</th>
                                    <th className="px-4 py-2">ពន្ធ</th>
                                    <th className="px-4 py-2">បញ្ចុះតម្លៃ</th>
                                    <th className="px-4 py-2">ទឹកប្រាក់សរុបចំនួន</th>
                                    <th className="px-4 py-2">បានបង់ទឹកប្រាក់សរុបចំនួន</th>
                                    <th className="px-4 py-2">នៅនៅខ្វះទឹកប្រាក់ចំនួន</th>
                                </tr>
                            </thead>

                            <tbody>
                                <AnimatePresence>
                                    {filteredPurchases.map((purchase, index) => {
                                        const remainingAmount = purchase.total_amount - (Number(purchase.amount_pay) + Number(purchase.amount_discount));
                                        return (
                                            <motion.tr key={purchase.id}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }}
                                                transition={{ duration: 0.3 }}
                                                className="text-sm duration-100 font-NotoSansKhmer hover:scale-y-110 whitespace-nowrap">
                                                <td className="px-4 py-1">{index + 1}</td>
                                                <td className="px-4 py-1">{formatDateToKhmer(new Date(purchase.purchase_date))}</td>
                                                <td dangerouslySetInnerHTML={{ __html: purchase.product_names }}></td>
                                                <td dangerouslySetInnerHTML={{ __html: purchase.grou_qty }}></td>
                                                <td className="px-4 py-1">{purchase.business_names} {purchase.full_names}</td>
                                                <td className="px-4 py-4 text-center">{purchase.total_include_tax} $</td>
                                                <td className="px-4 py-1 text-center">{purchase.amount_discount} $</td>
                                                <td className="px-4 py-1">{purchase.total_amount} $</td>
                                                <td className="px-4 py-1 text-center">{purchase.amount_pay} $</td>
                                                <td className="px-4 py-1 text-center">
                                                    {remainingAmount.toFixed(2)} $
                                                </td>
                                            </motion.tr>
                                        );
                                    })}

                                </AnimatePresence>
                            </tbody>

                            <tfoot className="bg-white">
                                <tr >
                                    <br />
                                </tr>
                                <tr className="bg-white">
                                    <td colSpan="8" className="font-bold text-center bg-white">ពន្ធសរុប:</td>
                                    <td colSpan="2" className="font-bold space-x-2 px-4 py-1 text-center">
                                        {filteredPurchases.reduce((total, purchase) => total + (Number(purchase.total_include_tax) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $

                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="8" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបបញ្ចុះតម្លៃ $ :</td>
                                    <td colSpan="2" className="font-bold px-4 py-1 text-center">
                                        {filteredPurchases.reduce((total, purchase) => total + (Number(purchase.amount_discount) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="8" className="font-bold text-center bg-white">បានបង់ទឹកប្រាក់សរុបចំនួន :</td>
                                    <td colSpan="2" className="font-bold px-4 py-1 text-center">
                                        {filteredPurchases.reduce((total, purchase) => total + (Number(purchase.amount_pay) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $

                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="8" className="font-bold text-center bg-white">នៅខ្វះទឹកប្រាក់ចំនួន :</td>
                                    <td colSpan="2" className="font-bold px-4 py-1 text-red-500 text-center">
                                        {filteredPurchases.reduce((total, purchase) => total + (Number(purchase.total_amount) - (Number(purchase.amount_pay) || 0)), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $

                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="8" className="font-bold text-center bg-white">ទឹកប្រាក់សរុបចំនួន:</td>
                                    <td colSpan="2" className="font-bold px-4 py-1 text-center">
                                        {/* {filteredPurchases.reduce((total, purchase) => total + (Number(purchase.amount_pay) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $ */}
                                        {filteredPurchases.reduce((total, purchase) => total + (Number(purchase.total_amount) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} $

                                    </td>
                                </tr>
                            </tfoot>

                        </table>
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
        </div>
    );
}

export default Purchase;






