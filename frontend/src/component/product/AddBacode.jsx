import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";
import Barcode from 'react-barcode';
import { IoPrint } from 'react-icons/io5';
import {API_URL} from '../../service/api'

function AddBarcode() {
    const [products, setProducts] = useState([]);
    const [product_ID, setProduct_ID] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);

    useEffect(() => {
        getAllProduct();
    }, []);
    const getAllProduct = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product`);
            setProducts(response.data.product);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleAddProduct = (product) => {
        const existingProduct = selectedProducts.find((p) => p.id === product.id);
        if (existingProduct) {
            toast.error(`ផលិតផល ${product.pro_names} មានរួចហើយ!`, {
                position: "top-center",
                autoClose: 1000,
            });
        } else {
            setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        }
        setProduct_ID('');
        setIsDropdownOpenProduct(false);
    };

    const handleProductSearchChange = (e) => {
        setProduct_ID(e.target.value);
        setIsDropdownOpenProduct(e.target.value.length > 0);
    };

    const handleQuantityChange = (index, newQuantity) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].quantity = newQuantity > 0 ? newQuantity : 1;
    
        setSelectedProducts(updatedProducts);
    };


    const filteredOptionsProduct = products.filter(option =>
        option.pro_names.toLowerCase().includes(product_ID.toLowerCase())
    );

    const handlePrint = () => {
        const printContents = document.getElementById('barcode-print-area').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        setSelectedProducts([]);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

   
    return (
        <div>
            <div className=' mb-4 rounded-lg '>
                <div className="md:w-[70%] w-[100%] mx-auto mt-12">
                    <div className="relative items-center gap-3 mx-auto my-2">
                        <div className="relative">
                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    className="w-full input_text"
                                    placeholder="ស្វែងរកផលិតផល"
                                    value={product_ID}
                                    onChange={handleProductSearchChange}
                                />
                                <div className="absolute right-[4%] top-3.5">
                                    <FaSearch className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                        {isDropdownOpenProduct && (
                            <div className="flex justify-center">
                                <ul className="absolute z-[2] w-full mt-1 overflow-y-auto bg-white border border-gray-300 shadow-md max-h-48">
                                    {filteredOptionsProduct.length > 0 ? (
                                        filteredOptionsProduct.map((product) => (
                                            <li
                                                key={product.id}
                                                className="p-2 text-gray-700 cursor-pointer hover:bg-gray-200 hover:text-black"
                                                onClick={() => handleAddProduct(product)}
                                            >
                                                {product.pro_names}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-2 text-gray-500 font-NotoSansKhmer">
                                            មិនមានកាត ឈ្មោះនេះ​ <span className="font-bold">{product_ID}</span> ទេ!
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <hr />

                <table className="w-full mt-4 border-collapse">
                    <thead className="p-2 text-white bg-blue-600/90">
                        <tr>
                            <th className="p-2 border w-[20%]">ឈ្មោះផលិតផល</th>
                            <th className="p-2 border w-[10%]">លេខបាកូដ</th>
                            <th className="p-2 border w-[15%]">ចំនួន</th>
                            <th className="p-2 border w-[5%]">
                                <p className="text-center">ស្ថានភាព</p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedProducts.map((product, index) => {
                            return (
                                <tr key={product.id}>
                                    <td className="p-2 border">
                                        {product.pro_names}
                                    </td>
                                    <td className="p-2 border">{product.barcode}</td>
                                    <td className="p-2 border">
                                        <input
                                            type="number"
                                            min="1"
                                            value={product.quantity}
                                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                            className="w-full input_text"
                                        />
                                    </td>
                                    <td className="p-2 border text-center">
                                        <button
                                            onClick={() => setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))}
                                            className="text-red-500"
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                    </tbody>
                </table>

                <div className='flex justify-start mb-10 py-3'>
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="button_only_submit"
                    >
                       <IoPrint /> <span>បោះពុម្ភ</span>
                    </button>
                </div>
                <div id="barcode-print-area">

                    <div className='flex flex-wrap gap-4 justify-center'>

                        {selectedProducts.map((product, index) =>
                            [...Array(product.quantity)].map((_, i) => (
                                <div key={`${product.barcode}-${i}`} className="flex flex-col items-center border-dotted border-2 border-gray-600">
                                    <div className='flex space-x-2'>
                                        <p className="font-semibold">{product.pro_names}</p>
                                        <span>|</span>
                                        <p className="font-semibold">តម្លៃ: ${product.cost_price}</p>
                                    </div>
                                    <Barcode value={product.barcode} className="m-2 w-48" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AddBarcode;
