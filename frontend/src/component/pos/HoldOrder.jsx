import React from 'react';
import { useCart } from './CartContext';
import { motion } from 'framer-motion';


const Cart = ({ setIsModalHoldeOrder }) => {
    const { cart, heldOrders, restoreHeldOrder, ClearHold } = useCart();

    const calculateTotal = (cartItems) => {
        return cartItems.reduce((total, item) => {
            const itemTotal = item.cost_price * item.quantity;
            const discountedPrice = itemTotal - (item.discount || 0);
            return total + discountedPrice;
        }, 0);
    };

    const calculateOverallTotal = () => {
        return heldOrders.reduce((total, order) => {
            return total + calculateTotal(order.cartItems);
        }, 0);
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalHoldeOrder(false);
        }
    };

    const handleClearHold = () => {
        const confirmed = window.confirm('Are you sure you want to clear all held orders?');
        if (confirmed) {
            ClearHold();
            setIsModalHoldeOrder(false);
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClick}
        >
            <div className="relative w-full max-w-3xl m-4 bg-white rounded shadow-md mt-10 p-2 py-4 dark:bg-gray-700">
                <div className="mb-4">
                    <h2 className="text-xl font-bold py-4">រក្សាទុក្ខកែប្រែ</h2>
                    {heldOrders.length > 0 ? (
                        <table className="min-w-full text-center">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 w-8 px-1">លេខរៀង</th>
                                    <th className="py-3 px-2">ឈ្មោះ</th>
                                    <th className="py-3">បរិមាណ</th>
                                    <th className="py-3 px-6">តម្លៃរួមបញ្ចូលពន្ធ</th>
                                    <th className="py-3 px-6">បន្ចុះតម្លៃ</th>
                                    <th className="py-3 px-6">តម្លៃសរុប</th>
                                    <th className="py-3 px-6">កែក្រែ</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm">
                                {heldOrders.length > 0 ? (
                                    heldOrders.map((order, index) => (
                                        <tr key={order.id} className="bg-gray-100">
                                            <td className="py-2">{index + 1}</td>

                                            <td className="py-2">
                                                {order.cartItems.map((item) => (
                                                    <div key={item.id}>{item.pro_names}</div>
                                                ))}
                                            </td>
                                            <td className="py-2">
                                                {order.cartItems.map((item) => (
                                                    <div key={item.id}>{item.quantity}</div>
                                                ))}
                                            </td>
                                            <td className="py-2">
                                                {order.cartItems.map((item) => (
                                                    <div key={item.id}>{item.cost_price}</div>
                                                ))}
                                            </td>
                                            <td className="py-2">
                                                {order.cartItems.map((item) => (
                                                    <div key={item.id}>{item.discount}</div>
                                                ))}
                                            </td>
                                            <td className="py-2 font-bold  text-xl text-blue-600">
                                                {calculateTotal(order.cartItems).toFixed(2)} $
                                            </td>
                                            <td className="py-2">
                                                <button
                                                    onClick={() => {
                                                        restoreHeldOrder(order);
                                                        setIsModalHoldeOrder(false);
                                                    }}
                                                    className="bg-blue-500 text-white p-2 mt-2 rounded"
                                                >
                                                    កែក្រែលក់
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="py-4">No held orders.</td>
                                    </tr>
                                )}
                            </tbody>
                            <button onClick={handleClearHold} className="bg-yellow-500 w-[160px] text-white p-2 mt-2 rounded">
                                Clear Hold
                            </button>
                        </table>
                    ) : (
                        <div className='text-center w-full'>
                            <p className="py-4 text-center text-red-400 w-full">
                                មិនមានផលិតផល
                            </p>
                        </div>
                    )}

                    {heldOrders.length > 0 && (
                        <div className="mt-4 text-right">
                            <p className="font-bold text-lg">
                                Overall Total: {calculateOverallTotal().toFixed(2)} $
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Cart;
