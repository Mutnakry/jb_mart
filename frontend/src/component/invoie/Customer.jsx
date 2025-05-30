
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { API_URL } from '../../service/api';
import { formatDateToKhmer } from '../ForMartDateToKHmer';
import { IoPrint } from 'react-icons/io5';
import { RiFileExcel2Line } from "react-icons/ri";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Supplier() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("ទាំងអស់");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("ទាំងអស់"); // New state for customer filter
  const [filterAmountDi, setFilterAmountDi] = useState("ទាំងអស់");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    getAllOrder();
    getALLCustomer();
  }, []);

  const getAllOrder = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/repay`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  const getALLCustomer = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customer/getcustomerdiscount`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers data', error);
    }
  };

  const [filterDate, setFilterDate] = useState("ទាំងអស់");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const filterByDate = (orderDate) => {
    const today = new Date();
    const orderDateObj = new Date(orderDate);

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


  // Filter orders based on selected currency and customer
  const filteredOrders = orders.filter(order => {
    const matchesCurrency = selectedCurrency === "ទាំងអស់" || order.type_currency === selectedCurrency;
    const matchesCustomer = selectedCustomer === "ទាំងអស់" || order.customer_id == selectedCustomer;
    const matchesDate = filterByDate(order.date_order);

    // Calculate remaining balance
    const remainingAmount = Number(order.total_amount) - Number(order.balance_amount);

    const matchesPaymentStatus =
      filterAmountDi === "ទាំងអស់" ||
      (filterAmountDi === "ជំពាក់" && remainingAmount > 0) ||
      (filterAmountDi === "បង់រួច" && remainingAmount === 0);

    return matchesCurrency && matchesCustomer && matchesDate && matchesPaymentStatus;
  });


  const totalPages = () => {
    return Math.ceil(filteredOrders.length / itemsPerPage);
  };

  const handlePrint = () => {
    const printContents = document.getElementById('invoicesale').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Refresh the page
  };


  const totalDiscountSum = filteredOrders.reduce(
    (total, order) => total + (Number(order.totalDiscount) || 0),
    0
  ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalQTY = filteredOrders.reduce(
    (total, order) => total + (Number(order.totalqty) || 0),
    0
  );


  const totalAmountUSD = filteredOrders
    .filter(order => order.type_currency === "usd")
    .reduce((total, order) => total + (Number(order.total_amount) || 0), 0)
    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalAmountKHR = filteredOrders
    .filter(order => order.type_currency === "khr")
    .reduce((total, order) => total + (Number(order.total_amount) || 0), 0)
    .toLocaleString('en-US');

  const totalAmountTHB = filteredOrders
    .filter(order => order.type_currency === "thb")
    .reduce((total, order) => total + (Number(order.total_amount) || 0), 0)
    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalAmountUSDPay = filteredOrders
    .filter(order => order.type_currency === "usd")
    .reduce((total, order) => total + (Number(order.balance_amount) || 0), 0)
    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalAmountKHRPay = filteredOrders
    .filter(order => order.type_currency === "khr")
    .reduce((total, order) => total + (Number(order.balance_amount) || 0), 0)
    .toLocaleString('en-US');

  const totalAmountTHBPay = filteredOrders
    .filter(order => order.type_currency === "thb")
    .reduce((total, order) => total + (Number(order.balance_amount) || 0), 0)
    .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


  const exportToExcel = () => {
    const wsData = filteredOrders.map((order, index) => ({
      '#': index + 1,
      'កាលបរិច្ឆេទ': formatDateToKhmer(new Date(order.date_order)),
      'អតិជន': order.full_names || order.business_names,
      'ចំនួន': `${order.totalqty} ${order.unit_names}`,
      'ចំនួនទឺកប្រាក់សរុប': `${order.total_amount}  ${order.type_currency}`,
      'ទឺកប្រាក់ដែលបានបង់': `${order.balance_amount}  ${order.type_currency}`,
      'នៅនៅខ្វះទឺកប្រាក់': `${(Number(order?.total_amount) || 0) - (Number(order?.balance_amount) || 0)} ${order.type_currency}`,
      'បញ្ចុះតម្លៃ': `${order.totalDiscount}  ${order.type_currency}`,
    }));

    // Create worksheet and workbook totalDiscount
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    // Save to file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `Orders_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className='w-full' >
      <div className='grid xl:grid-cols-4  md:grid-cols-3 grid-cols-1 gap-3 border-t-2 border-blue-500 bg-gray-200/50 py-6 px-2'>
        <div className="space-y-2">
          <label className='text-lg font-NotoSansKhmer' htmlFor="">ទំនាក់ទំនង:</label>
          <select
            className='input_text block'
            id="unit_ID"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="ទាំងអស់">ទាំងអស់</option>
            {customers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.full_names} {item.business_names}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 ">
          <label className='text-lg font-NotoSansKhmer' htmlFor="">រូបិយប័ណ្ណ :</label>

          <select className='input_text block' onChange={(e) => setSelectedCurrency(e.target.value)}>
            <option value="ទាំងអស់">ទាំងអស់</option>
            <option value="khr">ខ្មែរ</option>
            <option value="usd">ដុល្លា</option>
            <option value="thb">បាត</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className='text-lg font-NotoSansKhmer' htmlFor="">កាលបរិច្ឆេទ:</label>
          <select
            className='input_text font-NotoSansKhmer text-md block'
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
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

        <div className="space-y-2">
          <label className='text-lg font-NotoSansKhmer' htmlFor="">ទាំងអស់:</label>
          <select
            className='input_text font-NotoSansKhmer text-md block'
            value={filterAmountDi}
            onChange={(e) => setFilterAmountDi(e.target.value)}
          >
            <option value="ទាំងអស់">ទាំងអស់</option>
            <option value="ជំពាក់">អ្កកជុំពាក់</option>
            <option value="បង់រួច">អ្កកមិនបានជុំពាក់</option>
          </select>
        </div>
      </div>

      <div id='invoicesale' className='mt-6'>

        {/* <div className=" text-md px-4"> */}
        <div className="px-6 pt-2 print:border-0 print:shadow-none hidden print:block">
          <div className='space-y-1 flex justify-center'>
            <h3 className="text-2xl font-KhmerMoul flex text-center text-blue-600">ចែប៊ីម៉ាត់ប៉ោយប៉ែត</h3>
          </div>
          <div className='flex justify-between'>
            {/* Purchase Information */}
            <div>
              <p>អ្នកផ្គត់ផ្កង់ : {selectedCustomer}
              </p>
              <p>កាលបរិច្ខេទ : <span className='font-NotoSansKhmer'>{filterDate}</span></p>
              <p>រូបិយប័ណ្ណ : {selectedCurrency}
              </p>
            </div>

          </div>
        </div>

        <div className="flex justify-end my-2 print:hidden space-x-5 text-sm">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 flex items-center space-x-2 bg-green-500 text-white hover:bg-green-600">
            <RiFileExcel2Line />  <span> នាំចេញ Excel</span>
          </button>

          <button onClick={handlePrint} className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700" type="button">
            <IoPrint /> <span>បោះពុម្ភ</span>
          </button>
        </div>

        <div className="relative overflow-x-auto scrollbar-hidden">
          <AnimatePresence>
            <table className="min-w-full table-auto">
              <thead className="text-white text-sm bg-blue-600/95">
                <tr className="font-bold font-NotoSansKhmer">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">កាលបរិច្ឆេទ</th>
                  <th className="px-4 py-2">អតិជន</th>
                  <th className="px-4 py-2">ចំនួន</th>
                  <th className="px-4 py-2">ចំនួនទឺកប្រាក់សរុប</th>
                  <th className="px-4 py-2">ទឺកប្រាក់ដែលបានបង់</th>
                  <th className="px-4 py-2">នៅនៅខ្វះទឺកប្រាក់</th>
                  <th className="px-4 py-2">បញ្ចុះតម្លៃ</th>
                </tr>
              </thead>
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p>{error}</p>
              ) : filteredOrders.length === 0 ? (
                <p className="px-10 py-4 text-red-500 text-start">រកមិនឃើញប្រភេទ</p>
              ) : (
                <tbody>
                  {filteredOrders.slice(indexOfFirstItem, indexOfLastItem).map((order, index) => {
                    const remainingAmount = (Number(order?.total_amount) || 0) - (Number(order?.balance_amount) || 0);
                    return (
                      <motion.tr
                        key={order.order_detail_id}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="text-xs duration-100 font-NotoSansKhmer hover:scale-y-110">

                        <td>{index + 1}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{formatDateToKhmer(new Date(order.date_order))}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{order.full_names || order.business_names}</td>
                        <td>{order.totalqty} {order.unit_names}</td>

                        <td>
                          {order.type_currency === "usd" ? `${order.total_amount} $`
                            : order.type_currency === "khr" ? `${order.total_amount} រៀល`
                              : order.type_currency === "thb" ? `${order.total_amount} បាត`
                                : null}
                        </td>

                        <td>
                          {order.type_currency === "usd" ? `${order.balance_amount} $`
                            : order.type_currency === "khr" ? `${order.balance_amount} រៀល`
                              : order.type_currency === "thb" ? `${order.balance_amount} បាត`
                                : null}
                        </td>

                        <td>
                          {order.type_currency === "usd" ? `${remainingAmount} $`
                            : order.type_currency === "khr" ? `${remainingAmount} រៀល`
                              : order.type_currency === "thb" ? `${remainingAmount} បាត`
                                : null}
                        </td>

                        <td>{order.totalDiscount || '0.00'} $</td>
                      </motion.tr>
                    );
                  })}
                </tbody>

              )}
              <tfoot>
                <tr className="font-bold bg-gray-200">
                  <td colSpan='3' className="text-right px-4 py-2">សរុប:</td>
                  <td className="px-4 py-2">{totalQTY} ផលិតផល</td>
                  <td className="px-4 py-2">
                    {totalAmountUSD} $ <br /> {totalAmountKHR} រៀល <br /> {totalAmountTHB} បាត
                  </td>
                  <td className="px-4 py-2">
                    {totalAmountUSDPay} $ <br /> {totalAmountKHRPay} រៀល <br /> {totalAmountTHBPay} បាត
                  </td>
                  <td className="px-4 py-2">
                    {totalAmountUSD - totalAmountUSDPay} $ <br /> {Number(totalAmountKHR || 0) - Number(totalAmountKHRPay || 0) || 0} រៀល <br /> {(totalAmountTHB - totalAmountTHBPay) || 0} បាត
                  </td>
                  <td className="px-4 py-2">{totalDiscountSum} $</td>
                </tr>
              </tfoot>
            </table>
            <div className="flex text-sm justify-end space-x-1 my-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-2 border border-gray-700 disabled:opacity-50"
              >
                ត្រលប់
              </button>

              <span className="px-3 py-2 border bg-blue-500 border-blue-500 disabled:opacity-50"
              >{currentPage}</span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages()}
                className="px-2 py-2 border border-gray-700 disabled:opacity-50"
              >
                បន្ទាប់
              </button>
            </div>

          </AnimatePresence>
        </div>
      </div>
    </div>

  );
}
export default Supplier;
