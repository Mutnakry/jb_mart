
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useCart } from './CartContext';

// const SearchAddToCartProduct = () => {
//     const { addItem } = useCart();
//     const [products, setProducts] = useState([]);
//     const [barcodeInput, setBarcodeInput] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     // Fetch products from API
//     const fetchProducts = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get('http://localhost:6700/api/product');
//             setProducts(response.data.product);
//             setError('');
//         } catch (error) {
//             setError('Error fetching products data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Handle change in barcode input
//     const handleBarcodeChange = (e) => {
//         const input = e.target.value;
//         setBarcodeInput(input);
//         const product = products.find(p => 
//             p.barcode === input || p.id === input || p.pro_names.toLowerCase() === input.toLowerCase()
//         );

//         // Add product to cart if found
//         if (product) {
//             addItem(product);
//             setBarcodeInput(''); // Clear input after adding
//         }
//     };

//     // Handle form submission for barcode input
//     const handleBarcodeSubmit = (e) => {
//         e.preventDefault();
//         const product = products.find(p => 
//             p.barcode === barcodeInput || p.id === barcodeInput || p.pro_names.toLowerCase() === barcodeInput.toLowerCase()
//         );

//         if (product) {
//             addItem(product);
//             setBarcodeInput(''); // Clear input after adding
//         }
//     };

//     return (
//         <div className='flex gap-12'>
//             <div className="col-span-1 space-y-2 w-[450px]">
//                 <form onSubmit={handleBarcodeSubmit} className='flex'>
//                     <input
//                         type="text"
//                         className='input_text'
//                         value={barcodeInput}
//                         onChange={handleBarcodeChange}
//                         placeholder="Enter or Scan Barcode"
//                     />
//                 </form>
//                 {loading && <p className="text-blue-500">Loading products...</p>}
//                 {error && <p className="text-red-500">{error}</p>}
//             </div>
//         </div>
//     );
// };

// export default SearchAddToCartProduct;




// import React, { useState } from 'react';
// import { FaSearch } from "react-icons/fa";

// // Sample product list
// const productList = [
//     {
//         id: 1,
//         name: "Metfone",
//         unit: "សន្លឹក",
//         price: 45,
//         qty: 10,
//         cost: 50,
//         description: "Gadgets and devices",
//         datetime: new Date().toLocaleString(),
//     },
//     {
//         id: 2,
//         name: "Smart",
//         unit: "សន្លឹក",
//         price: 20,
//         qty: 2,
//         cost: 65,
//         description: "Gadgets and devices",
//         datetime: new Date().toLocaleString(),
//     },
//     {
//         id: 3,
//         name: "Cellcard",
//         unit: "សន្លឹក",
//         price: 80,
//         qty: 5,
//         cost: 90,
//         description: "Gadgets and devices",
//         datetime: new Date().toLocaleString(),
//     },
// ];

// function SearchAddToCartProduct() {
//     const [productSearchQuery, setProductSearchQuery] = useState("");
//     const [showProductDropdown, setShowProductDropdown] = useState(false);
//     const [selectedProducts, setSelectedProducts] = useState([]);

//     const handleProductSearchChange = (e) => {
//         setProductSearchQuery(e.target.value);
//         setShowProductDropdown(e.target.value.length > 0);
//     };

//     const handleAddProduct = (product) => {
//         if (selectedProducts.find((p) => p.id === product.id)) {
//             alert("Product already exists!");
//         } else {
//             setSelectedProducts([...selectedProducts, product]);
//         }
//         setProductSearchQuery("");
//         setShowProductDropdown(false);
//     };

//     // Filter products based on search query
//     const filteredProducts = productList.filter(product =>
//         product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
//     );

//     return (
//         <div>
//             <div className="relative">
//                 <div className="flex justify-center">
//                     <input
//                         type="text"
//                         className="w-full input_text"
//                         placeholder="ស្វែងរកកាតទូរស័ព្ទ"
//                         value={productSearchQuery}
//                         onChange={handleProductSearchChange}
//                     />
//                     <div className="absolute right-[2%] top-3.5">
//                         <FaSearch className="text-gray-400" />
//                     </div>
//                 </div>

//                 {/* Dropdown for displaying matching products */}
//                 {showProductDropdown && (
//                     <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
//                         {filteredProducts.length > 0 ? (
//                             filteredProducts.map((product) => (
//                                 <div
//                                     key={product.id}
//                                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                                     onClick={() => handleAddProduct(product)}
//                                 >
//                                     {product.name}
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="p-2 text-gray-500">No products found</div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default SearchAddToCartProduct;






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import {API_URL} from '../../service/api'

const SearchAddToCartProduct = () => {
    const { addItem } = useCart();
    const [products, setProducts] = useState([]);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [productSearchQuery, setProductSearchQuery] = useState("");
    const [showProductDropdown, setShowProductDropdown] = useState(false);

    
    useEffect(() => {
        fetchProducts();
    }, []);

    // Fetch products from API
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/product/product`);
            setProducts(response.data);
            setError('');
        } catch (error) {
            setError('Error fetching products data');
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.pro_names.toLowerCase().includes(productSearchQuery.toLowerCase())
    );
    
    const handleBarcodeChange = (e) => {
        setProductSearchQuery(e.target.value);
        setShowProductDropdown(e.target.value.length > 0);
        const input = e.target.value;
        setBarcodeInput(input);
        const product = products.find(p =>
            p.barcode === input || p.barcode === input || p.pro_names.toLowerCase() === input.toLowerCase()
        );
        if (product) {
            if (product.qty > 0) {
                addItem(product);
                setBarcodeInput('');
                setShowProductDropdown(false);
            } else {
                toast.warning('This product is out of stock');
            }
        }
    };

    const handleAddProduct = (product) => {
        if (product.qty > 0) {
            addItem(product);
            setProductSearchQuery("");
            setShowProductDropdown(false);
            setBarcodeInput('');
        } else {
            toast.warning('This product is out of stock');
        }

    };

    return (
        <div className='flex gap-12'>
            <div className="relative">
                <div className="flex justify-center">
                    <input
                        type="text"
                        className=" input_text w-[350px]"
                        placeholder="ស្វែងរកកាតផលិតផល"
                        value={barcodeInput}
                        onChange={handleBarcodeChange}
                    />
                    <div className="absolute right-[4%] top-3.5">
                        <FaSearch className="text-gray-400" />
                    </div>
                </div>

                {/* Dropdown for displaying matching products */}
                {showProductDropdown && (
                    <div className="absolute w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleAddProduct(product)}
                                >
                                    {product.pro_names}
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500">No products found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchAddToCartProduct;
