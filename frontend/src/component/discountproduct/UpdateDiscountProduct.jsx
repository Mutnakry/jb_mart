import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";
import { API_URL } from '../../service/api'
import Navbar from '../Navbar';
import { useNavigate, useParams } from 'react-router-dom';


function CreateDiscountProduct() {
    const [products, setProducts] = useState([]);
    const [names, setNames] = useState('');
    const [startDiscount, setStartDiscount] = useState('');
    const [endDiscount, setEndDiscount] = useState('');
    const [product_ID, setProduct_ID] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isDropdownOpenProduct, setIsDropdownOpenProduct] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const [userLoginNames, setUserLoginNames] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setUserLoginNames(localStorage.getItem('user_names') || '');
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

    const handleAddProduct = (product) => {
        const isProductInPurchaseData = selectedProducts.some(
            (item) => item.product_id === product.id
        );
        if (isProductInPurchaseData) {
            toast.error(`ផលិតផល ${product.pro_names} មិនអាចបន្ថែមបានទេ ព្រោះវាត្រូវនឹងការទិញដើម!`, {
                position: "top-center",
                autoClose: 2000,
            });
        } else if (selectedProducts.find((p) => p.id === product.id)) {
            toast.error(`ផលិតផល ${product.pro_names} មានរូចហើយ!`, {
                position: "top-center",
                autoClose: 1000,
            });
        } else {
            setSelectedProducts((prevSelectedProducts) => [
                ...prevSelectedProducts,
                { ...product, quantity: 1 },
            ]);
        }
        setProduct_ID('');
        setIsDropdownOpenProduct(false);
    };



    const handleProductSearchChange = (e) => {
        setProduct_ID(e.target.value);
        setIsDropdownOpenProduct(e.target.value.length > 0);
    };

    const [error, setError] = useState(false)

    const handleDiscountChange = (index, newDiscount) => {
        const updatedProducts = [...selectedProducts];
        if (newDiscount <= 0) {
            setError("Discount must be greater than zero.");
        } else if (newDiscount <= updatedProducts[index].exclude_tax) {
            updatedProducts[index].discount = newDiscount;
            setError('');
        } else {
            setError(`Discount cannot exceed the price of ${updatedProducts[index].exclude_tax} $`);
        }

        setSelectedProducts(updatedProducts);
    };


    const [deletedProducts, setDeletedProducts] = useState([]);

    const handleRemoveProduct = (productId) => {
        const updatedData = selectedProducts.filter(item => item.product_id !== productId);
        setSelectedProducts(updatedData);
        setDeletedProducts(prevDeleted => [...prevDeleted, productId]);
    };


    const [editableData, setEditableData] = useState({});

    const handleRemoveProductNew = (productId) => {
        const updatedSelectedProducts = selectedProducts.filter(
            (product) => product.id !== productId
        );
        setSelectedProducts(updatedSelectedProducts);
        const updatedEditableData = editableData.filter(
            (item) => item.id !== productId
        );
        setEditableData(updatedEditableData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedProducts.length === 0) {
            toast.error("សូមបន្ថែមផលិតផល!", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        if (!startDiscount || !endDiscount) {
            toast.error("សូមបញ្ចូលថ្ងៃចាប់ផ្តើម និង ថ្ងៃបញ្ចប់!", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        if (new Date(startDiscount) >= new Date(endDiscount)) {
            toast.error("ថ្ងៃបញ្ចប់មិនអាចតិចជាងថ្ងៃចាប់ផ្តើម!", {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        setIsSubmitting(true);

        const productsData = selectedProducts
            .filter(product => !product.deleted) // Only send products that aren't deleted
            .map(product => ({
                product_id: product.product_id || product.id,
                discount_amount: product.discount,
                date_start: startDiscount,
                date_end: endDiscount,
                user_at: userLoginNames,
            }));

        const requestData = {
            detail_name: names,
            products: productsData,
            deletedProducts: deletedProducts
        };

        try {
            const response = await axios.put(`${API_URL}/api/product_discount/${id}`, requestData, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201 || response.status === 200) {
                toast.success("បន្ថែមការបញ្ចុះតម្លៃដោយជោគជ័យ!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                navigate('/discount_product');
                setNames('');
                setStartDiscount('');
                setEndDiscount('');
                setSelectedProducts([]);
            } else {
                toast.error(response.data.error || 'មានបញ្ហា!', {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.error('Error submitting discount:', error);
            toast.error("បរាជ័យក្នុងការបញ្ចូលទិន្នន័យ!", {
                position: "top-right",
                autoClose: 2000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    const filteredOptionsProduct = products.filter(option =>
        option.pro_names.toLowerCase().includes(String(product_ID || '').toLowerCase())
    );


    return (
        <div>
            <Navbar />
            <div className='Nav_bar h-screen'>
                <div className=' Div_bar bg-white'>
                    <div className='border p-4 border-gray-200 dark:border-gray-700'>
                        <form action="" onSubmit={handleSubmit}>
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
                                    <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                    <input
                                        type="date"
                                        value={startDiscount}
                                        required
                                        min={startDiscount}
                                        onChange={e => setStartDiscount(e.target.value )}
                                        id="price"
                                        class="input_text block "
                                        placeholder="បញ្ចុះតម្លៃនៅក្នងកម្មវីធី"
                                    />
                                </div>
                                <div class="space-y-2">
                                    <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                    <input
                                        type="date"
                                        value={endDiscount}
                                        min={startDiscount}
                                        required
                                        onChange={e => setEndDiscount(e.target.value)}
                                        id="price"
                                        class="input_text block "
                                        placeholder="បញ្ចុះតម្លៃនៅក្នងកម្មវីធី"
                                    />
                                </div>
                            </div>
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
                            <table className=" mt-4 border-collapse md:w-[85%] w-[100%] mx-auto">
                                <thead className="p-2 text-white bg-blue-600/90">
                                    <tr>
                                        <th className="p-2 border w-[5%]">
                                            <p className="text-center">លេខរៀង</p>
                                        </th>
                                        <th className="p-2 border w-[20%] text-center">ឈ្មោះផលិតផល</th>
                                        <th className="p-2 border w-[10%]">តម្លៃដើមលក់ចេញ</th>
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
                                                <td className="p-2 border text-center">
                                                    {index + 1}
                                                </td>
                                                <td className="p-2 border text-center">
                                                    {product.pro_names || product.product_id}
                                                </td>
                                                <td className="p-2 border">{product.exclude_tax} $</td>
                                                <td className="p-2 border">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        step={0.01}
                                                        value={product.discount}  // Set the discount dynamically
                                                        onChange={(e) => handleDiscountChange(index, parseFloat(e.target.value))}  // Ensure value is float
                                                        className="w-full input_text"
                                                    />
                                                </td>
                                                <td className='flex items-center justify-center'>
                                                    {product && product.product_discount_detail_id ? (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleRemoveProduct(product.product_id || product.product_discount_detail_id)}
                                                            className="text-white p-2 bg-red-500"
                                                        >
                                                            X
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type='button'
                                                            onClick={() => handleRemoveProductNew(product.product_id || product.id)}
                                                            className="text-white p-2 bg-red-500"
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>
                            <div className='flex justify-end mb-10 py-3 md:w-[85%] w-[100%] mx-auto'>
                                {error && (
                                    <div className="text-red-500 font-bold mt-2">
                                        {error}
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 font-semibold text-white font-NotoSansKhmer bg-blue-500 hover:bg-blue-600"
                                >

                                    {isSubmitting ? 'រក្សាទុក...' : 'រក្សាទុក'}
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