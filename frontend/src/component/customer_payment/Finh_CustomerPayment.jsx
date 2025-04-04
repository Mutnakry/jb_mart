import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { API_URL } from '../../service/api';
import Navbar from '../Navbar';
import { Link } from 'react-router-dom';

function CreateDiscountProduct() {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');  // Combined search query for business_names, full_names, and order_detail_id
    // const [selectedProduct, setSelectedProduct] = useState(null);  // To store the selected product details
    const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);

    useEffect(() => {
        getAllProduct();
    }, []);

    const getAllProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/repay`);
            setProducts(response.data); // Make sure the response contains the correct product data
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setIsDropdownOpenProduct(e.target.value.length > 0);
    };

    const filteredOptionsProduct = products.filter(product => {
        const search = searchQuery.toLowerCase();
        const businessName = product.business_names ? product.business_names.toLowerCase() : '';
        const fullName = product.full_names ? product.full_names.toLowerCase() : '';
        const orderDetailId = product.order_detail_id ? product.order_detail_id.toString() : '';

        return (
            businessName.includes(search) ||
            fullName.includes(search) ||
            orderDetailId.includes(search)
        );
    });


    return (
        <div>
            <Navbar />
            <div className='h-screen Nav_bar'>
                <div className='bg-white Div_bar'>
                    <div className='p-4 border border-gray-200 dark:border-gray-700'>
                        <p className='text-sm font-bold text-gray-600 md:text-2xl '>ស្វែងរកឈ្មោះអតិជនបង់ប្រាក់</p>
                        <form action="">
                            <div className="md:w-[70%] w-[100%] mx-auto mt-12">
                                <div className="relative items-center gap-3 mx-auto my-2">
                                    <div className="relative">
                                        <div className="flex justify-center">
                                            <input
                                                type="text"
                                                className="w-full input_text"
                                                placeholder="ស្វែងរកឈ្មោះអតិជន និង លេខវិក្កយបត្រ"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                            <div className="absolute right-[4%] xl:right-3 top-3.5">
                                                <FaSearch className="text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    {isDropdownOpenProduct && (
                                        <div className="flex justify-center">
                                            <ul className="absolute z-[2] w-full mt-1 overflow-y-auto bg-white border border-gray-300 shadow-md max-h-64">
                                                {filteredOptionsProduct.length > 0 ? (
                                                    filteredOptionsProduct.map((product) => (
                                                        <Link
                                                            to={`/customer_payment/${product.order_detail_id}`}
                                                        >
                                                            <li

                                                                key={product.order_detail_id}
                                                                className="p-2 text-gray-700 cursor-pointer hover:bg-gray-200 hover:text-black"

                                                            >
                                                                {product.business_names} {product.full_names} <span className='text-gray-300'>លេខវិក្កយបត្រ</span> {product.order_detail_id}
                                                            </li>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <li className="p-2 text-gray-500 font-NotoSansKhmer">
                                                        មិនមានកាត ឈ្មោះនេះ​ <span className="font-bold">{searchQuery}</span> ទេ!
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateDiscountProduct;
