import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';
import { IoPrint } from 'react-icons/io5';
import Navbar from '../Navbar';
import {API_URL} from '../../service/api'

function PrintCost() {
    const [costs, setCost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        CostsID();
    }, [id]);

    const CostsID = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/cost/${id}`);
            setCost(response.data);
            console.log(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data');
            toast.error('សូមលោកព្យាយាមម្ដងទៀត !', { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className='print:hidden'>
                <Navbar />
            </div>
            <div className='Nav_bar'>
            <div className=' Div_bar'> 
                  <div>
                        <Link to="/cost" className="text-white py-2 px-4 bg-blue-500 rounded print:hidden">
                            Back
                        </Link>
                    </div>
                    <div className="p-6 border print:border-0 print:shadow-none">
                        <div className=" text-md px-4">
                            <div className='space-y-1 flex justify-center'>
                                <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>
                            </div>
                            <div className='px-[5%]'>
                                {costs[0] && <p>លេខវិក្កយបត្រ : <span className='text-xl font-NotoSansKhmer'>{costs[0].id}</span></p>}
                                {costs[0] && <p>កាលបរិច្ខេទ :  <span className=' font-NotoSansKhmer'>{new Date(costs[0].dob).toISOString().split('T')[0]}</span></p>}
                                {costs[0] && <p>បន្ថែមដោយ :  <span className=' font-NotoSansKhmer capitalize'>{costs[0].user_at}</span></p>}
                            </div>
                        </div>
                    </div>
                    <table className="w-full print:bg-white">
                        <thead className="bg-blue-600/95 text-white">
                            <tr className="font-NotoSansKhmer font-bold">
                                <th className="px-4 py-2">លេខរៀង</th>
                                <th className="px-4 py-2">កាលបរិច្ខេទ</th>
                                <th className="px-4 py-2">ប្រភេទនែការចំណាយ</th>
                                <th className="px-4 py-2">ព័ត៌មានលម្អិតពីការបន្ត</th>
                                <th className="px-4 py-2">ពន្ធ</th>
                                <th className="px-4 py-2">ចំនួនសរុប</th>
                                <th className="px-4 py-2">បានបង់</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-4 text-red-500">
                                        {error}
                                    </td>
                                </tr>
                            ) : costs.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="text-start py-4 px-10 text-red-500">
                                        រកមិនឃើញប្រភេទ ?
                                    </td>
                                </tr>
                            ) : (
                                costs.map((customer, index) => (
                                    <tr
                                        key={customer.id}
                                        className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100"
                                    >
                                        <td className="px-4 py-1">{index + 1}</td>
                                        <td>{new Date(customer.dob).toISOString().split('T')[0]}</td>
                                        <td className="px-4 py-1">{customer.type_names}</td>
                                        <td className="px-4 py-1">
                                            ចន្លោះពេលកើតឡើងវិញ​ : {customer.interval} {customer.interval_type || 'N/A'}
                                        </td>
                                        <td className="px-4 py-1">{customer.tax.toFixed(2)} $</td>
                                        <td className="px-4 py-1">{customer.price.toFixed(2)} $</td>
                                        <td className="px-4 py-1">{customer.payment.toFixed(2)} $</td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tr className='h-10'><br /></tr>
                        {/* <tr><br /></tr> */}
                        <tr
                            className=' print:bg-white'>
                            <td colSpan="5" className='text-end'>
                                ពន្ធ
                            </td>
                            <td colSpan="1" className='text-end'>
                            </td>
                            <td>
                                {(costs.reduce((total, customer) => total + customer.tax, 0)).toFixed(2)} $
                            </td>
                        </tr>
                        <tr
                            className=' print:bg-white'>
                            <td colSpan="5" className='text-end'>
                                ចំនួនសរុប
                            </td>
                            <td colSpan="1" className='text-end'>
                            </td>
                            <td>
                                <td className="font-bold px-4 py-1">
                                    {costs
                                        .reduce((total, customer) => total + customer.price, 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                            </td>
                        </tr>

                        <tr
                            className=' print:bg-white'>
                            <td colSpan="5" className='text-end'>
                                បានបង់
                            </td>
                            <td colSpan="1" className='text-end'>
                            </td>
                            <td>
                                <td className="font-bold px-4 py-1">
                                    {costs
                                        .reduce((total, customer) => total + customer.payment, 0)
                                        .toLocaleString('en-US', {
                                            style: 'decimal',
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}{' '}
                                    $
                                </td>
                            </td>
                        </tr>
                    </table>
                    <div className="flex justify-end my-6 mx-36">
                        <div className='text-center'>
                            <h2 className='text-xl font-KhmerMoul'>  <span>ចែប៊ីម៉ាត់ប៉ោយប៉ែត</span></h2>
                            <p>ហត្ថលេខា</p>
                        </div>
                    </div>

                    <div className="flex justify-end my-6 print:hidden">
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
}

export default PrintCost;