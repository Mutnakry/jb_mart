import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useParams } from 'react-router-dom';
import { IoPrint } from 'react-icons/io5';
import Navbar from '../Navbar';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import NullImage from '../../assets/image.png';
import {API_URL} from '../../service/api'



function PrintProduct() {
    const [Products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        CostsID();
    }, [id]);

    const CostsID = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product/product/${id}`);
            setProducts(response.data);
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
        // const printContents = document.getElementById('invoice').innerHTML;
        // const originalContents = document.body.innerHTML;
        // document.body.innerHTML = printContents;
        window.print();
        // document.body.innerHTML = originalContents;
    };

    return (
        <div>
            <div className='print:hidden'>
                <Navbar />
            </div>
            <div className='py-12 px-6 md:ml-64 bg-gray-100 print:bg-white print:px-0 dark:bg-gray-950'>

                <div className="w-full p-4 mt-7 print:mt-0 print:p-0 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out " id='invoice'>
                    <div>
                        <Link to="/product" className="text-white py-2 px-4 bg-blue-500 rounded print:hidden">
                            Back
                        </Link>
                    </div>
                    <div className="p-6  print:border-0 print:shadow-none">
                        <div className=" text-md px-4">
                            <div className='space-y-1 flex justify-center'>
                                <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>
                            </div>
                            <div className='flex justify-between mt-5'>
                                <div className=''>
                                    {Products[0] && <p>លេខសមញកាល់ : <span className='text-xl font-NotoSansKhmer'>{Products[0].pro_names}</span></p>}
                                    {Products[0] && <p>លេខសមញកាល់ : <span className='font-NotoSansKhmer'>00{Products[0].id}</span></p>}
                                    {Products[0] && <p>កាលបរិច្ខេទ :  <span className=' font-NotoSansKhmer'>{formatDateToKhmer(new Date(Products[0].create_at))}</span></p>}
                                    {Products[0] && <p>បន្ថែមដោយ :  <span className=' font-NotoSansKhmer capitalize'>{Products[0].user_at}</span></p>}
                                    {Products[0] && <p>ម៉ាលយីយោ​ :  <span className='font-NotoSansKhmer'>{Products[0].brand_names || 'មិនមាន'}</span></p>}

                                </div>
                                <div className=''>
                                    {Products[0] && <p>ប្រភេទទំនិញ : <span className=' font-NotoSansKhmer'>{Products[0].cat_names || 'មិនមាន'}</span></p>}
                                    {Products[0] && <p>ឯកតា :  <span className='font-NotoSansKhmer'>{Products[0].unit_names}</span></p>}

                                    {Products[0] && <p>គ្រប់គ្រងស្តុក :  <span className=' font-NotoSansKhmer capitalize'>{Products[0].mg_stock}</span></p>}
                                    {Products[0] && <p>ជូនដំណឹងពីបរិមាណ :  <span className=' font-NotoSansKhmer capitalize'>{Products[0].note_qty}</span></p>}
                                    {Products[0] && (
                                        <p>ផុតកំណត់ :
                                            <span className='font-NotoSansKhmer'>
                                                {Products[0].expiry ? formatDateToKhmer(new Date(Products[0].expiry)) : 'មិនមាន'}
                                            </span>
                                        </p>
                                    )}

                                </div>
                                <div className=''>
                                    {Products[0] && <p>ប្រភេទពន្ធលើតម្លៃលក់ : <span className=' font-NotoSansKhmer'>{Products[0].type_of_tax}</span></p>}
                                    {Products[0] && <p>ប្រភេទផលិតផល :  <span className=' font-NotoSansKhmer capitalize'>{Products[0].product_type}</span></p>}
                                    {Products[0] && <p>ប្រភេទកូដ :  <span className=' font-NotoSansKhmer'>{Products[0].barcode_type}</span></p>}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='py-4'>
                        {Products[0]?.image ? (
                            <div className="">
                                <img
                                    src={`${API_URL}/image/${Products[0].image}`}
                                    alt={Products[0].pro_names || "Character"}
                                    class="md:h-64 h-36 object-contain p-4 border border-gray-200"
                                />
                            </div>
                        ) : (
                            <div className="">
                                <img
                                    src={NullImage}
                                    alt="Placeholder"
                                    class="md:h-64 h-36 object-contain p-4 border border-gray-200"
                                />
                            </div>
                        )}
                    </div>
                    <table className="min-w-full table-auto">
                        <thead className="bg-blue-600/95 text-white">
                            <tr className="font-NotoSansKhmer font-bold">
                                <th className=" px-4 py-2 whitespace-nowrap">ឈ្មោះផលិតផល</th>
                                <th className=" px-4 py-2">តម្លៃទិញឯកតា</th>
                                <th className=" px-4 py-2">តម្លៃលក់</th>
                                <th className=" px-4 py-2">ពន្ធ</th>
                                <th className=" px-4 py-2">តម្លៃចំនេញ</th>
                                <th className=" px-4 py-2">បច្ចុប្បន្នភាពស្តុក</th>

                            </tr>
                        </thead>
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : Products.length === 0 ? (
                            <p className="text-start py-4 px-10 text-red-500 whitespace-nowrap ">រកមិនឃើញប្រភេទ ?</p>
                        ) : (
                            <tbody>
                                {Products.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100">

                                        <td className="px-4 py-5 font-bold">{product.pro_names} </td>
                                        <td className=" px-4 py-1">{product.cost_price} $</td>
                                        <td className=" px-4 py-1">{product.exclude_tax} $</td>
                                        <td className=" px-4 py-1">{product.include_tax} $ </td>
                                        <td className=" px-4 py-1">{product.profit} $</td>
                                        <td className="px-4 py-1">{product.qty} {product.unit_names}</td>

                                    </tr>
                                ))}
                            </tbody>
                        )}
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

export default PrintProduct