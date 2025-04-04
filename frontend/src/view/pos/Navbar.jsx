
import React, { useState, useEffect, useRef } from 'react';
import { FaBackward, FaMoneyBillAlt, FaEquals, FaCalculator, FaHandHoldingMedical } from 'react-icons/fa';
import { IoChevronBackSharp } from "react-icons/io5";
import { GrSubtractCircle } from 'react-icons/gr';
import { motion, AnimatePresence } from 'framer-motion';
import NodePayManey from './NodePayManey';
import { Link } from 'react-router-dom';
import { formatDateToKhmer, formatTimeToKhmer } from '../../component/ForMartDateToKHmer';
import Calculator from './Calculator';
import ExchangRate from '../currency/modale/ModaleExchangRateToPOS';
import HoldOrder from '../../component/pos/HoldOrder'
import CloseCashHand from './ClostCashHand'

function Navbar() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const khmerToday = formatDateToKhmer(currentDateTime);

    const [isModalCustomer, setIsModalCustomer] = useState(false);
    const openInsertCustomer = () => setIsModalCustomer(true);
    const [isModalHoldOrder, setIsModalHoldeOrder] = useState(false);
    const openHoldOrder = () => setIsModalHoldeOrder(true);
    const [isModalExchangRate, setIsModalExchangRate] = useState(false);
    const openInsertExchangRate = () => setIsModalExchangRate(true);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle the dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };
    const [isOpenCash, setIsOpenCash] = useState(false);
    const OpenChash = () => {
        setIsOpenCash((prev) => !prev);
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [isHoveringPayCost, setIsHoveringPayCost] = useState(false);
    const [isHoveringCost, setIsHoveringCost] = useState(false);
    const [isHoverinHoldOrder, setIsHoveringHoldOrder] = useState(false);
    const [isHoveringExpence, setIsHoveringExpence] = useState(false);
    const [isHoveringSale, setIsHoveringSale] = useState(false);

 
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between p-2 text-center bg-white shadow dark:bg-slate-600 md:px-20">
            <div className='flex justify-between w-full'>

                <div className="flex items-center gap-5 font-bold text-center text-black font-NotoSansKhmer">
                    <Link className="p-1 px-2 py-2 text-white bg-blue-600 shadow-lg hover:bg-blue-700" to="/" aria-label="Go Back">
                        <IoChevronBackSharp />
                    </Link>
                    <h2 className="hidden font-KhmerMoul md:block">ចែប៊ីម៉ាត</h2>
                    <div className='space-x-2 font-bold'>
                        <span>កាលបរិច្ឆេត:</span>
                        <span className="text-black font-NotoSansKhmer">ថ្ងៃទី{khmerToday}</span>
                        {/* <span>ម៉ោង : {khmerTime}</span> */}
                    </div>
                </div>
                <div className="flex gap-2 p-1 text-lg">
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHoveringPayCost(true)}
                        onMouseLeave={() => setIsHoveringPayCost(false)}
                    >
                        <button  onClick={OpenChash} className='flex p-1 text-sm text-white bg-purple-600' aria-label="Add expense">
                            <span className="flex items-center">
                                <GrSubtractCircle className='mr-1 text-xs' /> បន្ថែមការចំណាយ
                            </span>
                        </button>
                        {isHoveringPayCost && (
                            <div className="absolute z-10 p-3 mt-1 text-center bg-white rounded-lg shadow w-44">
                                <p>បន្ថែមការចំណាយ</p>
                            </div>
                        )}
                    </div>
                    <div
                        className="relative"
                        onMouseEnter={() => setIsHoveringHoldOrder(true)}
                        onMouseLeave={() => setIsHoveringHoldOrder(false)}
                    >
                        <button onClick={openHoldOrder} className='flex items-center p-1 px-2 space-x-2 text-sm text-white bg-pink-600' aria-label="Add expense">
                            <span className="">
                                <FaHandHoldingMedical className='text-xs' />
                            </span>
                            <span>ព្រៀងទុក</span>
                        </button>
                        {isHoverinHoldOrder && (
                            <div className="absolute z-10 p-3 mt-1 text-center text-gray-700 -translate-x-1/2 bg-white rounded-lg w-44">
                                <p>ព្រៀងទុក</p>
                            </div>
                        )}
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setIsHoveringCost(true)}
                        onMouseLeave={() => setIsHoveringCost(false)}
                    >
                        <button className='p-2 text-white bg-red-500' aria-label="Equals">
                            <FaCalculator className='text-xs' />
                        </button>
                        {isHoveringCost && (
                            <div className="absolute z-10 p-3 mt-1 text-center text-gray-700 -translate-x-1/2 bg-white rounded-lg w-44">
                                <p>ម៉ាស៊ីនគិតលេខ</p>
                            </div>
                        )}
                    </div>

                    <div
                        className="relative"
                        onMouseEnter={() => setIsHoveringExpence(true)}
                        onMouseLeave={() => setIsHoveringExpence(false)}
                    >
                        <button onClick={openInsertExchangRate} className='p-2 px-2 text-white bg-pink-500' aria-label="Open Box">
                            <FaMoneyBillAlt className='text-xs' />
                        </button>
                        {isHoveringExpence && (
                            <div className="absolute z-10 p-3 mt-1 text-center -translate-x-1/2 bg-white rounded-lg w-44">
                                <p>អត្រាប្តូប្រាក់</p>
                            </div>
                        )}
                    </div>

                    {/* Calculator Dropdown */}
                    <div className="relative"
                        onMouseEnter={() => setIsHoveringSale(true)}
                        onMouseLeave={() => setIsHoveringSale(false)}
                        ref={dropdownRef}>

                        <button onClick={toggleDropdown} className="p-2 text-white bg-yellow-500" aria-label="Calculator">
                            <FaCalculator className='text-xs' />
                        </button>
                        {isHoveringSale && (
                            <div className="absolute z-10 p-3 mt-1 text-center -translate-x-1/2 bg-white rounded-lg w-44">
                                <p>ម៉ាស៊ីនគិតលេខ</p>
                            </div>
                        )}
                        <AnimatePresence>
                        {isDropdownOpen && <Calculator setIsDropdownOpen={setIsDropdownOpen} />}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            {/* Modal for customer */}
            <AnimatePresence>
                {isModalCustomer && <Calculator setIsModalCustomer={setIsModalCustomer} />}
            </AnimatePresence>

            {/* Modal for customer */}
            <AnimatePresence>
                {isModalHoldOrder && <HoldOrder setIsModalHoldeOrder={setIsModalHoldeOrder} />}
            </AnimatePresence>
             {/* Modal for open cash hand */}
             <AnimatePresence>
                {isOpenCash && <CloseCashHand setIsOpenCash={setIsOpenCash} />}
            </AnimatePresence>

            <AnimatePresence>
                {isModalExchangRate && <ExchangRate setIsModalExchangRate={setIsModalExchangRate} />}
            </AnimatePresence>
        </div>
    );
}

export default Navbar;
