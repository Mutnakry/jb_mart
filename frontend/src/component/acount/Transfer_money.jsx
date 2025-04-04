

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoPrint } from 'react-icons/io5';
import {API_URL} from '../../service/api'

const AccountDetailTransfer = () => {
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state


    useEffect(() => {
        fetchPaymentDetails();
    }, []);

    const fetchPaymentDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/account/paymentdetail`);
            setPaymentDetails(response.data);
            setFilteredDetails(response.data); // Initialize filteredDetails with all data
        } catch (error) {
            console.error('Error fetching payment details:', error);
            alert('Failed to fetch payment details. Please try again later.');
        }
    };

    const handleFilter = () => {
        if (!startDate || !endDate) {
            alert('Please select both start and end dates.');
            return;
        }

        setLoading(true); // Set loading to true

        setTimeout(() => {
            const filtered = paymentDetails.filter(detail => {
                const detailDate = new Date(detail.created_at);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return detailDate >= start && detailDate <= end;
            });

            setFilteredDetails(filtered);
            setLoading(false); // Set loading back to false
        }, 1000); // Simulate a delay for filtering
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className=" bg-white print:bg-transparent dark:border-gray-700 print:bg-white print:p-0 print:shadow-none">
                <div className="my-4 print:hidden flex justify-between">
                   
                    <div className="flex justify-center space-x-2">
                        <div className="space-y-2">
                            <label htmlFor="startDate">ថ្ងៃទីចាប់ផ្ដើម</label>
                            <input
                                type="date"
                                id="startDate"
                                className="input_text"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="endDate">ថ្ងៃទីបញ្ខប់</label>
                            <input
                                type="date"
                                id="endDate"
                                className="input_text"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleFilter}
                                className={`px-8 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                disabled={loading}
                            >
                                {loading ? 'ទាញយក...' : 'ទាញយក'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className=" print:border-0 print:shadow-none">
                    <table className="w-full border-collapse border border-gray-400">
                        <thead>
                            <tr className="dark:bg-gray-600 bg-blue-500">
                                <th className="border border-gray-400 px-4 py-2">គណនីចូល</th>
                                <th className="border border-gray-400 px-4 py-2">លេខគណនីចូល</th>
                                <th className="border border-gray-400 px-4 py-2">គណនីចេញ</th>
                                <th className="border border-gray-400 px-4 py-2">លេខគណនីចេញ</th>
                                <th className="border border-gray-400 px-4 py-2">ចំនួន</th>
                                <th className="border border-gray-400 px-4 py-2">ថ្ងៃទី</th>
                                <th className="border border-gray-400 px-4 py-2">ការណិពណ័នា</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDetails.length > 0 ? (
                                filteredDetails.map((detail, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                                        <td className="border border-gray-400 px-4 py-2">{detail.acc_nameIn || 'NA'}</td>
                                        <td className="border border-gray-400 px-4 py-2">{detail.acc_numIn || 'NA'}</td>
                                        <td className="border border-gray-400 px-4 py-2">{detail.acc_nameOut || 'NA'}</td>
                                        <td className="border border-gray-400 px-4 py-2">{detail.acc_numOut || 'NA'}</td>
                                        <td className="border border-gray-400 px-4 py-2">{detail.detail_balance } $</td>
                                       
                                        <td className="border border-gray-400 px-4 py-2">
                                            {detail.created_at ? new Date(detail.created_at).toLocaleDateString() : 'NA'}
                                        </td>
                                        <td className="border border-gray-400 px-4 py-2">{detail.description }</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No payment details available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-end my-2 print:hidden">
                        <button
                            className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700"
                            onClick={handlePrint}
                        >
                            <IoPrint /> <span>បោះពុម្ភ</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AccountDetailTransfer;
