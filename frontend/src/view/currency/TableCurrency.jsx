import { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';
import { MdClose } from "react-icons/md"; // For closing the modal
import {API_URL} from '../../service/api'


export default function TableCurrency() {
    const [currency, setCurrency] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [rate, setRate] = useState('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedcurrencyId, setSelectedCurrencyId] = useState(null);

    // Fetch currency data
    const getCurrencyData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/currency`);
            const fetchedData = response.data;
            setCurrency(fetchedData);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrencyData();
    }, []);

    // Update currency rate
    const updateCurrencyRate = async (e) => {
        e.preventDefault();
        const values = { rate }; 
        try {
            const response = await axios.put(`${API_URL}/api/currency/${selectedcurrencyId}`, values);
            toast.success('បានកែប្រែការប្រាក់ដោយជោគជ័យ!', { autoClose: 3000 });
            console.log(response.data.message); // Successfully updated
            getCurrencyData(); // Refresh currency data after update
            setIsUpdateModalOpen(false); // Close the modal
        } catch (error) {
            console.error('Error updating currency rate:', error); // Handle errors
        }
    };

    // Open modal and set currency data
    const openUpdateModal = (currencyItem) => {
        setSelectedCurrencyId(currencyItem.id);
        setName(currencyItem.name);
        setRate(currencyItem.rate);
        setIsUpdateModalOpen(true);
    };

 

    return (
        <div>
            <table className="min-w-full table-auto text-center">
                <thead>
                    <tr className="font-NotoSansKhmer font-bold">
                        <th className="px-12 py-2">Currency</th>
                        <th className="px-12 py-2">Rate</th>
                        <th className="px-12 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currency.map((currencyItem) => (
                        <tr key={currencyItem.name} className="text-sm font-NotoSansKhmer hover:scale-y-110 duration-100 text-center">
                            <td className="px-12 py-3">{currencyItem.name}</td>
                            <td className="px-12 py-3">{currencyItem.rate}</td>
                            <td className="px-12 space-x-2 flex">
                                {currencyItem.name !== "USD" ? (
                                    <button
                                        onClick={() => openUpdateModal(currencyItem)}
                                        className="bg-blue-50 rounded-full p-2"
                                    >
                                        <FaPencilAlt className="text-blue-500" />
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-gray-200 rounded-full p-2 cursor-not-allowed"
                                    >
                                        <FaPencilAlt className="text-gray-400" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Update Modal */}
            <AnimatePresence>
                {isUpdateModalOpen && (
                    <motion.div
                        className="modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="modal_center max-w-sm">
                            <div className="modal_title">
                                <h3 className="">កែប្រែប្រភេទទំនិញ</h3>
                                <MdClose className="text-2xl cursor-pointer" onClick={() => setIsUpdateModalOpen(false)} />
                            </div>
                            <div className="modal_form">
                                <form onSubmit={updateCurrencyRate}>
                                    <div className="grid gap-4 mb-4 grid-cols-1">
                                        <div className="col-span-2">
                                            <label className="font-NotoSansKhmer font-bold">ឈ្មោះ: *</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                id="price"
                                                className="input_text"
                                                placeholder="ឈ្មោះនៃប្រភេទទំនិញ"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="font-NotoSansKhmer font-bold">Rate: *</label>
                                            <input
                                                type="number"
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                                id="rate"
                                                className="input_text"
                                                placeholder="Currency Rate"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-end">
                                        <button type="submit" className="button_only_submit">
                                            រក្សាទុក្ខ
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
