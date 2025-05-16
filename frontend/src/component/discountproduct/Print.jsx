import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '../../service/api'
import Navbar from '../Navbar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoPrint } from 'react-icons/io5';

import { FaBackward } from "react-icons/fa";
function CreateDiscountProduct() {
    const [products, setProducts] = useState([]);
    const [names, setNames] = useState('');
    const [startDiscount, setStartDiscount] = useState('');
    const [endDiscount, setEndDiscount] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getAllProduct();
        getAllPuchase();
    }, [id]);
    const getAllProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product`);
            setProducts(response.data.product);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const getAllPuchase = async () => {
        if (!id) return; // Only fetch if there's an ID (edit mode)

        try {
            const response = await axios.get(`${API_URL}/api/product_discount/${id}`);
            const data = response.data[0];
            console.log(response.data);
            setNames(data.detail_name);
            setStartDiscount(data.date_start);
            setEndDiscount(data.date_end);

            setSelectedProducts(response.data.map(product => ({
                ...product,
                product_id: product.product_id,
                discount: product.discount_amount
            })));

        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.response?.data?.error || 'Error fetching discount data');
        }
    };
    const [error, setError] = useState(false)

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
            <Navbar />
            <div className='Nav_bar h-screen'>
                <div className=' Div_bar bg-white'>
                  
                    <div className='border p-4 border-gray-200 dark:border-gray-700' id='invoicesale'>
                          <Link
                        to={`/discount_product`}
                        className="flex items-center text-center w-16 print:hidden gap-1 p-2 font-bold bg-blue-400 text-white"
                    >
                       <FaBackward />
                    </Link>
                        <form action="">
                            <div className='grid xl:grid-cols-3 grid-cols-2 gap-4'>
                                <div class="space-y-2 col-span-3">
                                    <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                    <input
                                        type="text"
                                        value={names}
                                        readOnly
                                        required
                                        onChange={e => setNames(e.target.value)}
                                        id="price"
                                        class="input_text md:w-[470px]  block "
                                        placeholder="បញ្ចុះតម្លៃនៅក្នងកម្មវីធី"
                                    />
                                </div>

                                <div class="space-y-2">
                                    <label className="font-NotoSansKhmer font-bold">ថ្ងៃចាប់ផ្ដើម: *</label>
                                    <input
                                        type="date"
                                        value={startDiscount}
                                        required
                                        min={startDiscount}
                                        disabled
                                        onChange={e => setStartDiscount(e.target.value)}
                                        id="price"
                                        class="input_text block "
                                        placeholder="បញ្ចុះតម្លៃនៅក្នងកម្មវីធី"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label className="font-NotoSansKhmer font-bold">ថ្ងៃបញ្ចប់: *</label>
                                    <input
                                        type="date"
                                        value={endDiscount}
                                        min={startDiscount}
                                        disabled
                                        required
                                        onChange={e => setEndDiscount(e.target.value)}
                                        id="price"
                                        class="input_text block "
                                        placeholder="បញ្ចុះតម្លៃនៅក្នងកម្មវីធី"
                                    />
                                </div>
                            </div>

                            <table className=" mt-4 border-collapse md:w-[85%] w-[100%] mx-auto">
                                <thead className="p-2 text-white bg-blue-600/90">
                                    <tr>
                                        <th className="p-2 border w-[5%]">
                                            <p className="text-center">លេខរៀង</p>
                                        </th>
                                        <th className="p-2 border w-[20%] text-center">ឈ្មោះផលិតផល</th>
                                        <th className="p-2 border w-[10%]">តម្លៃដើមលក់ចេញ</th>
                                        <th className="p-2 border w-[15%]">ចំនួន</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product, index) => {
                                        return (
                                            <tr key={product.id}>
                                                <td className="p-2 border text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2 border text-center">
                                                    {product.pro_names || product.product_id}
                                                </td>
                                                <td className="p-2 border">{product.exclude_tax} $</td>
                                                <td className="p-2 border">
                                                    {product.discount} $
                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>
                            <div className='flex justify-end mb-10 py-3 md:w-[85%] w-[100%] mx-auto'>
                                <button onClick={handlePrint} className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700" type="button">
                                    <IoPrint /> <span>បោះពុម្ភ</span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateDiscountProduct