import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../service/api';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateDiscount = () => {
    const [detailName, setDetailName] = useState('');
    const [products, setProducts] = useState([]);
    const [deletedProducts, setDeletedProducts] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [startDiscount, setStartDiscount] = useState('');
    const [endDiscount, setEndDiscount] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams(); // Use the id from useParams()

    // Fetch data when the component is mounted
    useEffect(() => {
        if (id) {
            getAllPuchase();
        }
    }, [id]);

    const getAllPuchase = async () => {
        if (!id) return; // Only fetch if there's an ID (edit mode)

        try {
            const response = await axios.get(`${API_URL}/api/product_discount/${id}`);
            const data = response.data[0];

            console.log(response.data);

            setDetailName(data.detail_name);
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
    
        const deletedProducts = selectedProducts
            .filter(product => product.deleted)
            .map(product => product.product_id || product.id);
    
        const requestData = {
            detail_name: names,
            products: productsData,
            deletedProducts: deletedProducts.length > 0 ? deletedProducts : [],
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
    

    // Handle discount change for a specific product
    const handleDiscountChange = (index, newDiscount) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[index].discount = newDiscount;
        setSelectedProducts(updatedProducts);
    };

    // Handle removing a product from the selected products list
    const handleRemoveProduct = async (productId) => {
        try {
            // Add product to deleted list
            setDeletedProducts([...deletedProducts, productId]);
    
            // Remove the product from selected list
            setSelectedProducts(selectedProducts.filter(product => product.product_id !== productId));
    
            // Optionally, show a success message
            setMessage('Product removed successfully.');
    
            // Call API to remove from database (You can add this step later)
            await axios.delete(`${API_URL}/api/product_discount/${id}/${productId}`);
        } catch (error) {
            console.error('Error removing product:', error);
            setError('Failed to remove product');
        }
    };
    

    // Function to handle adding a new product to the selected products list
    const handleAddProduct = (newProduct) => {
        setSelectedProducts([...selectedProducts, newProduct]);
    };

    return (
        <div>
            <h2>Update Discount</h2>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Detail Name:</label>
                    <input
                        type="text"
                        value={detailName}
                        onChange={(e) => setDetailName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={startDiscount}
                        onChange={(e) => setStartDiscount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={endDiscount}
                        onChange={(e) => setEndDiscount(e.target.value)}
                        required
                    />
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
                                    {/* 
                                                <td className="p-2 border text-center">
                                                    <button
                                                        // onClick={() => setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))}
                                                        onClick={() => setSelectedProducts(selectedProducts.filter((p) => p.product_id !== product.product_id))}

                                                        className="text-white p-2 bg-red-500"
                                                    >
                                                        X
                                                    </button>
                                                </td> */}

                                    <button
                                        type='button'
                                        onClick={() => handleRemoveProduct(product.product_id || product.id)}
                                        className="text-white p-2 bg-red-500"
                                    >
                                        X
                                    </button>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

                {/* Example for adding products (You can make this more complex with dropdowns or a search) */}
                <div>
                    <label>Add Product:</label>
                    <input
                        type="text"
                        placeholder="Enter product ID"
                        onChange={(e) => {
                            // For now, just add a dummy product ID and discount value
                            const newProduct = {
                                product_id: e.target.value,
                                discount: 10,  // Example fixed discount, modify this as per your logic
                            };
                            handleAddProduct(newProduct);
                        }}
                    />
                </div>

                <button type="submit">Update Discount</button>
            </form>

            {message && <div>{message}</div>}
            {error && <div>{error}</div>}
        </div>
    );
};

export default UpdateDiscount;
