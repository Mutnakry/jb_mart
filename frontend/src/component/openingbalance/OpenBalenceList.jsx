import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../service/api";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";


function OpenBalanceList() {
    const [openBalances, setOpenBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; // Number of records per page

    // Filter states
    const [filterDate, setFilterDate] = useState("ទាំងអស់");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    useEffect(() => {
        fetchOpeningBalance();
    }, []);

    const fetchOpeningBalance = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/opencash/all`);
            setOpenBalances(res.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch data");
            setLoading(false);
        }
    };

    // Date filter function
    const filterByDate = (opening_date) => {
        const today = new Date();
        const orderDateObj = new Date(opening_date);

        switch (filterDate) {
            case "today":
                return orderDateObj.toDateString() === today.toDateString();
            case "yesterday":
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);
                return orderDateObj.toDateString() === yesterday.toDateString();
            case "last7days":
                const last7Days = new Date();
                last7Days.setDate(today.getDate() - 7);
                return orderDateObj >= last7Days;
            case "last30days":
                const last30Days = new Date();
                last30Days.setDate(today.getDate() - 30);
                return orderDateObj >= last30Days;
            case "thisMonth":
                return (
                    orderDateObj.getMonth() === today.getMonth() &&
                    orderDateObj.getFullYear() === today.getFullYear()
                );
            case "lastMonth":
                const lastMonth = new Date();
                lastMonth.setMonth(today.getMonth() - 1);
                return (
                    orderDateObj.getMonth() === lastMonth.getMonth() &&
                    orderDateObj.getFullYear() === lastMonth.getFullYear()
                );
            case "last3Months":
                const last3Months = new Date();
                last3Months.setMonth(today.getMonth() - 3);
                return orderDateObj >= last3Months;
            case "thisYear":
                return orderDateObj.getFullYear() === today.getFullYear();
            case "lastYear":
                return orderDateObj.getFullYear() === today.getFullYear() - 1;
            case "custom":
                if (!customStartDate || !customEndDate) return false;
                const start = new Date(customStartDate);
                const end = new Date(customEndDate);
                return orderDateObj >= start && orderDateObj <= end;
            default:
                return true;
        }
    };

    // ✅ Apply Date Filtering
    const filteredBalances = openBalances.filter((balance) => filterByDate(balance.opening_date));

    // ✅ Update Pagination Based on Filtered Data
    const totalPages = Math.ceil(filteredBalances.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBalances.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>
            <Navbar />
            <div className="py-12 px-4 sm:ml-64 md:w-auto w-auto h-screen bg-gray-200 dark:bg-gray-950">
                <div className="w-full p-4 mt-10 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out">
                    <div className="mb-4">
                        <div className="space-y-2">
                            <label className='text-lg font-NotoSansKhmer' htmlFor="">ថ្ងៃដែលបើកការលក់:</label>
                            <select
                                className='input_text w-[420px] font-NotoSansKhmer text-md block'
                                value={filterDate}
                                onChange={(e) => {
                                    setFilterDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="ទាំងអស់">ទាំងអស់</option>
                                <option value="today">ថ្ងៃនេះ</option>
                                <option value="yesterday">ម្សិលមិញ</option>
                                <option value="last7days">7 ថ្ងៃចុងក្រោយ</option>
                                <option value="last30days">30 ថ្ងៃចុងក្រោយ</option>
                                <option value="thisMonth">ខែនេះ</option>
                                <option value="lastMonth">1 ខែចុងក្រោយ</option>
                                <option value="last3Months">3 ខែចុងក្រោយ</option>
                                <option value="thisYear">ឆ្នាំនេះ</option>
                                <option value="lastYear">ឆ្នាំមុន</option>
                                <option value="custom">ជ្រើសរើសកាលបរិច្ឆេទផ្ទាល់ខ្លួន</option>
                            </select>

                            {filterDate === "custom" && (
                                <div className="flex gap-3">
                                    <input
                                        type="date"
                                        className="input_text"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="input_text"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {loading && <p>Loading...</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && !error && (
                        <>
                            <table border="1" width="100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>កាលបរិច្ឆេទបើកការលក់</th>
                                        <th>កាលបរិច្ឆេទបិទការលក់</th>
                                        <th>ចាប់ផ្ដើមបើកបញ្ចី</th>
                                        <th>ឈ្មោះអ្នកបើកបញ្ចី</th>
                                        <th>ការបើកសមតុល្យ </th>
                                        <th>Expected Sales</th>
                                        <th>Actual Sales</th>
                                        <th>សាច់ប្រាក់ចូល</th>
                                        <th>ដកប្រាក់</th>
                                        <th>បិទសមតុល្យ</th>
                                        <th>សកម្មភាព
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((balance, index) => (
                                        <tr key={balance.id}>
                                            <td>{index + 1}</td>
                                            <td>{balance.opening_date}</td>
                                            <td>{balance.end_date}</td>
                                            <td>{balance.shift}</td>
                                            <td>{balance.cashier_id}</td>
                                            <td>{balance.opening_balance}</td>
                                            <td>{balance.expected_sales}</td>
                                            <td>{balance.actual_sales}</td>
                                            <td>{balance.cash_in}</td>
                                            <td>{balance.cash_out}</td>
                                            <td>{balance.closing_balance}</td>
                                            <td className="flex items-center justify-center ">
                                                <Link className="text-sm text-white text-center p-2 bg-green-400 rounded-md " to={`/OpenBalenceList/${balance.id}`}> <FaEye /></Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="flex text-sm justify-end space-x-2 my-4">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-700 bg-gray-300 disabled:opacity-50"
                                >
                                    ត្រលប់
                                </button>

                                <span className="px-4 py-2 border bg-blue-500 text-white">{currentPage}</span>

                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="px-3 py-2 border border-gray-700 bg-gray-300 disabled:opacity-50"
                                >
                                    បន្ទាប់
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OpenBalanceList;
