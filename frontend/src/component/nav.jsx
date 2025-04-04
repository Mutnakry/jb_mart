
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlineMoneyOff } from "react-icons/md";
import { RiLuggageDepositFill } from "react-icons/ri";
import { formatDateToKhmer, formatTimeToKhmer } from '../component/ForMartDateToKHmer';


function Navbar() {
    // Load the initial theme from localStorage or default to "light"
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    // State to hold user information
    const [userNames, setUserNames] = useState('');
    const [userRol, setUserRol] = useState('');
    const [userEmail, setUserEmail] = useState('');
    useEffect(() => {
        setUserNames(localStorage.getItem('user_names') || '');
        setUserRol(localStorage.getItem('user_rol') || '');
        setUserEmail(localStorage.getItem('user_email') || '');
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // Save the theme to localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeSwitch = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_rol');
        localStorage.removeItem('user_names');
        localStorage.removeItem('user_email');
        window.location.href = "/";
    };

    const [isContactDropdown, setIsContactDropdown] = useState(false);
    const [isProductDropdown, setIsProductDropdown] = useState(false);
    const [isPurchaseDropdown, setIsPurchaseDropdown] = useState(false);
    const [isTopupDropdown, setIsTopupDropdown] = useState(false);
    const [isExpenseDropdown, setIsExpenseDropdown] = useState(false);
    const [isAccountDropdown, setIsAccountDropdown] = useState(false);
    const [isPaymentMethodDropdown, setIsPaymentMethodDropdown] = useState(false);
    const [isUsersDropdown, setIsUsersDropdown] = useState(false);
    const [isReportsDropdown, setIsReportsDropdown] = useState(false);
    const [isCurrencyDropdown, setIsCurrencyDropdown] = useState(false);
    const [isProductDisDropdown, setIsProductDisDropdown] = useState(false);

    // Routes create_productdiscount
    const contactRoutes = ["/supplier", "/customer", "/groupcustomer"];
    const productsRoutes = ["/category", "/brands", "/udit", "/product", "/createproduct", "/varrenty", "/tests"];
    const purchaseRoutes = ["/purchase", "/createpurchase"];
    const topupRoutes = ['/topup', '/topupList']
    const exspenseRoutes = ['/cost', '/costtype']
    const accountRoutes = ['/account', '/account_list']
    const paymentRoutes = ['/paymenttype', '/payment_list']
    const usersRoutes = ['/user', '/createuser']
    const reportsRoutes = ['/reports', '/report_list']
    const currentcyRoutes = ['/currency', '/currency_list']
    const ProductDisRoutes = ['/discount_product', '/create_discount_product']

    // Active route checks
    const isContactActive = contactRoutes.some((route) => location.pathname.startsWith(route));
    const isProductsActive = productsRoutes.some((route) => location.pathname.startsWith(route));
    const isPurchaseActive = purchaseRoutes.some((route) => location.pathname.startsWith(route));
    const isTopupRouteActive = topupRoutes.some((route) => location.pathname.startsWith(route))
    const isExpenseRouteActive = exspenseRoutes.some((route) => location.pathname.startsWith(route))
    const isAccountRouteActive = accountRoutes.some((route) => location.pathname.startsWith(route))
    const isPaymentActive = paymentRoutes.some((route) => location.pathname.startsWith(route))
    const isUsersActive = usersRoutes.some((route) => location.pathname.startsWith(route))
    const isReportsActive = reportsRoutes.some((route) => location.pathname.startsWith(route))
    const isCurrencyActive = currentcyRoutes.some((route) => location.pathname.startsWith(route))
    const isProductDisActive = ProductDisRoutes.some((route) => location.pathname.startsWith(route))


    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownVisible((prev) => !prev);
    };

    // Dropdown behavior on route change
    useEffect(() => {
        if (isContactActive) {
            setIsContactDropdown(true);
        } else {
            setIsContactDropdown(false);
        }

        if (isProductDisActive) {
            setIsProductDisDropdown(true);
        } else {
            setIsProductDisDropdown(false);
        }


        if (isProductsActive) {
            setIsProductDropdown(true);
        } else {
            setIsProductDropdown(false);
        }

        if (isPurchaseActive) {
            setIsPurchaseDropdown(true);
        } else {
            setIsPurchaseDropdown(false);
        }

        if (isTopupRouteActive) {
            setIsTopupDropdown(true)
        }
        else {
            setIsTopupDropdown(false)

        }

        if (isExpenseRouteActive) {
            setIsExpenseDropdown(true)
        }
        else {
            setIsExpenseDropdown(false)

        }

        if (isAccountRouteActive) {
            setIsAccountDropdown(true)
        }
        else {
            setIsAccountDropdown(false)
        }

        if (isPaymentActive) {
            setIsPaymentMethodDropdown(true)
        }
        else {
            setIsPaymentMethodDropdown(false)
        }

        if (isUsersActive) {
            setIsUsersDropdown(true)
        }
        else {
            setIsUsersDropdown(false)
        }

        if (isReportsActive) {
            setIsReportsDropdown(true)
        }
        else {
            setIsReportsDropdown(false)
        }

        if (isCurrencyActive) {
            setIsCurrencyDropdown(true)
        }
        else {
            setIsCurrencyDropdown(false)
        }


    }, [isContactActive, isProductsActive, isPurchaseActive, isTopupRouteActive, isExpenseRouteActive, isAccountRouteActive, isPaymentActive, isUsersActive, isReportsActive, isCurrencyActive]);

    const navLinkStyle = ({ isActive }) => {
        return `flex items-center p-3 gap-2 ${isActive ? "bg-blue-600 dark:bg-blue-500 text-white" : "text-gray-800 dark:text-white "} `;
    };


    const handleDropdownContact = () => {
        setIsContactDropdown(!isContactDropdown);
    };

    const handleDropdownProductDiscount = () => {
        setIsProductDisDropdown(!isProductDisDropdown);
    };

    const handleProductDropdown = () => {
        setIsProductDropdown(!isProductDropdown);
    };

    const handlePurchaseDropdown = () => {
        setIsPurchaseDropdown(!isPurchaseDropdown);
    };

    const handleTopupDropDown = () => {
        setIsTopupDropdown(!isTopupDropdown)
    }

    const handleExspenseDropdown = () => {
        setIsExpenseDropdown(!isExpenseDropdown)
    }

    const handleAccountDropdown = () => {
        setIsAccountDropdown(!isAccountDropdown)
    }

    const handlepaymentDropdown = () => {
        setIsPaymentMethodDropdown(!isPaymentMethodDropdown)
    }

    const handleUsersDropdown = () => {
        setIsUsersDropdown(!isUsersDropdown)
    }

    const handleReportDropdown = () => {
        setIsReportsDropdown(!isReportsDropdown)
    }

    const handleCurrencyDropdown = () => {
        setIsCurrencyDropdown(!isCurrencyDropdown)
    }

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    const khmerToday = formatDateToKhmer(currentDateTime);
    const khmerTime = formatTimeToKhmer(currentDateTime);

    return (
        <div className=''>
            <nav className="fixed top-0 z-50 w-full  bg-blue-700 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="py-3 px-4 ">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between space-x-2 rtl:justify-end">
                            <a href="/Dashboard" className=" md:me-8 ">
                                <span className="self-center text-xl text-white font-bold sm:text-2xl whitespace-nowrap dark:text-white">ហាងលក់ទំនិញចែប៊ីម៉ាត</span>
                            </a>
                            <button data-drawer-target="sidebar-multi-level-sidebar" data-drawer-toggle="sidebar-multi-level-sidebar" aria-controls="sidebar-multi-level-sidebar" type="button" class="inline-flex items-center  ms-3 text-sm text-white rounded-lg sm:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span class="sr-only">Open sidebar</span>
                                <svg class="w-8 h-8" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <p className='text-white font-NotoSansKhmer text-xl'>
                                <span >{khmerToday}</span> <span>ម៉ោង : {khmerTime}</span>
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className='flex space-x-4'>
                                <NavLink to="/index/pos" >
                                    <p className='px-6 py-2 flex text-white items-center space-x-2 hover:bg-gray-500 transition duration-300 text-lg font-medium bg-gray-400'>
                                        <svg
                                            className="flex-shrink-0 w-5 h-5 "
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 18 18"
                                        >
                                            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                        </svg>
                                    </p>
                                </NavLink>

                                <p className="text-lg text-white font-bold" role="none">
                                    {userNames}
                                </p>
                            </div>
                            <div className="flex items-center ms-3 md:pr-20 pr-0">
                                <div>
                                    <button
                                        type="button"
                                        onClick={toggleDropdown}
                                        className="flex rounded-full p-2 bg-gray-400"
                                    >
                                        <span className="sr-only ">Open user menu</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-user"
                                        >
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </button>
                                </div>
                                {isDropdownVisible && (
                                    <div className="absolute z-10 top-4 w-44 p-2 bg-white shadow mt-10 -right-[20px] text-gray-600 -translate-x-16">
                                        <div onClick={handleLogout} className=" items-center gap-1 cursor-pointer hover:text-red-400">
                                            <div className="px-4 py-3" role="none">
                                                <p className="text-sm text-gray-900 font-bold" role="none">
                                                    Name: {userNames}
                                                </p>
                                                <p className="text-sm text-gray-900 font-bold" role="none">
                                                    Email: {userEmail}
                                                </p>
                                            </div>
                                            <ul className="py-1" role="none">
                                                <li>
                                                    <a
                                                        href="/"
                                                        onClick={handleLogout}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        Sign out
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </nav>

            <aside id="sidebar-multi-level-sidebar" class="fixed top-12 h-screen bg-white left-0 z-40 w-64 overflow-y-auto hidden-scrollbar transition-transform " aria-label="Sidebar">
                <div className=" px-3 py-4 overflow-y-auto mb-4 shadow-lg dark:bg-gray-800 scrollbar-hidden pb-20">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="/dashboard" className={navLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-gauge">
                                    <path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
                                    <circle cx="12" cy="12" r="2" />
                                    <path d="M13.4 10.6 19 5" />
                                </svg>
                                <span className="flex-1 ml-1 whitespace-nowrap font-NotoSansKhmer font-bold">ផ្ទាំងគ្រប់គ្រង</span>
                            </NavLink>
                        </li>

                        <li className="space-y-2">
                            <button
                                onClick={handleDropdownContact}
                                className={`flex items-center p-3 w-full text-left justify-between ${isContactDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-contact">
                                        <path d="M16 2v2" />
                                        <path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
                                        <path d="M8 2v2" />
                                        <circle cx="12" cy="11" r="3" />
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">ទំនាក់ទំនង</span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isContactDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isContactDropdown ? "max-h-96 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/supplier" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">អ្នកផ្គត់ផ្គង់</p>
                                </NavLink>
                                <NavLink to="/customer" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">អតិជន</p>
                                </NavLink>
                                <NavLink to="/groupcustomer" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីរក្រុមអតិជន</p>
                                </NavLink>

                            </div>
                        </li>

                        {/* Product Dropdown */}
                        <li className="space-y-2">
                            <button onClick={handleProductDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isProductDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-package-open">
                                        <path d="M12 22v-9" />
                                        <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
                                        <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
                                        <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">ផលិតផល</span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isProductDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isProductDropdown ? "max-h-96 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/product" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីផលិតផល</p>
                                </NavLink>

                                {/* user add purchase admin and superadmin */}

                                {(userRol === 'superadmin' || userRol === 'admin') ? (
                                    <NavLink to="/createproduct" className={navLinkStyle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">បន្ថែមផលិតផល</p>
                                    </NavLink>
                                ) : (
                                    <div className='flex items-center cursor-not-allowed  p-3 gap-2 "bg-blue-600 dark:bg-blue-500 text-gray-800 dark:text-white'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">បន្ថែមផលិតផល</p>
                                    </div>
                                )}
                                <NavLink to="/tests" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ចូលផលិតផល</p>
                                </NavLink>
                                <NavLink to="/udit" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ឯកតា</p>
                                </NavLink>
                                <NavLink to="/category" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ប្រភេទទំនិញ</p>
                                </NavLink>
                                <NavLink to="/brands" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ម៉ាកយីហោ</p>
                                </NavLink>
                                <NavLink to="/varrenty" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ការធានា</p>
                                </NavLink>
                            </div>
                        </li>

                        {/* Purchase Dropdown */}
                        <li className="space-y-2">
                            <button onClick={handlePurchaseDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isPurchaseDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.49 12 3.74 8.248m0 0 3.75-3.75m-3.75 3.75h16.5V19.5" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">បញ្ជាទិញទំនិញ</span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isPurchaseDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isPurchaseDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/purchase" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">រាយបញ្ជីតិញ</p>
                                </NavLink>

                                {/* user add purchase admin and superadmin */}
                                {(userRol === 'superadmin' || userRol === 'admin') ? (
                                    <NavLink to="/createpurchase" className={navLinkStyle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">បន្ថែមការបញ្ជាទិញ</p>
                                    </NavLink>
                                ) : (
                                    <div className='flex items-center cursor-not-allowed  p-3 gap-2 "bg-blue-600 dark:bg-blue-500 text-gray-800 dark:text-white'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">បន្ថែមការបញ្ជាទិញ</p>
                                    </div>
                                )}

                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ការទិញដែលប្តូរយកវិញ</p>
                                </NavLink>
                            </div>
                        </li>
                        {/* Purchase POS */}
                        <li>
                            <NavLink to="/index/pos" className={navLinkStyle}>
                                <svg
                                    className="flex-shrink-0 w-5 h-5 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ml-2 whitespace-nowrap font-NotoSansKhmer font-bold">
                                    ផ្ទាំងលក់ទំនិញ
                                </span>
                            </NavLink>
                        </li>

                        {/* Topup Phone dropdown */}
                        <li className="space-y-2">
                            <button onClick={handleDropdownProductDiscount} className={`flex items-center p-3 w-full text-left justify-between ${isProductDisDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-receipt-text"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M14 8H8" /><path d="M16 12H8" /><path d="M13 16H8" /></svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                        បញ្ចុះតម្លៃផលិតផល
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isProductDisDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isProductDisDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>

                                <NavLink to="/discount_product" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បង្កើតផលិតផល</p>
                                </NavLink>
                                <NavLink to="/create_discount_product" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បង្កើតផលិតផលបញ្ចុះតម្លៃ</p>
                                </NavLink>
                            </div>
                        </li>
                        {/*  Currency Dropdown */}
                        <li className="space-y-2">
                            <button onClick={handleCurrencyDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isCurrencyDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                        រូបិយប័ណ្ណ
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isCurrencyDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isCurrencyDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/exchange" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បង្កើតបញ្ជាទិញ</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីបញ្ជាទិញ</p>
                                </NavLink>
                            </div>
                        </li>

                        {/*  Extense Dropdown */}
                        <li className="space-y-2">
                            <button onClick={handleExspenseDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isExpenseDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.99 7.5 8.24 3.75m0 0L4.49 7.5m3.75-3.75v16.499h11.25" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                        ចំណាយ
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isExpenseDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isExpenseDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/cost" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីចំណាយ</p>
                                </NavLink>
                                <NavLink to="/costtype" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ប្រភេទនៃការចំណាយ</p>
                                </NavLink>
                            </div>
                        </li>


                        {/*  Account Dropdown */}
                        <li className="space-y-2">
                            <button onClick={handleAccountDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isAccountDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                        គណនី
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isAccountDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isAccountDropdown ? "max-h-96 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/account" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីឈ្មោះគណនី</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">តុល្យការ</p>
                                </NavLink>
                                <NavLink to="/purchase" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">តារាងតុល្យភាព</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">លំហូរសាច់ប្រាក់</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍គណនីចំណាយ</p>
                                </NavLink>
                            </div>
                        </li>

                        {/*  Payment method dropdown */}
                        <li className="space-y-2">
                            <button onClick={handlepaymentDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isPaymentMethodDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                        វិធីសាស្រ្តបង់ប្រាក់
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isPaymentMethodDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isPaymentMethodDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                <NavLink to="/paymenttype" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីបង់ប្រាក់</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីបង់ប្រាក់</p>
                                </NavLink>
                            </div>
                        </li>

                        {userRol === 'superadmin' || userRol === 'admin' && (
                            <li className="space-y-2">
                                <button onClick={handleUsersDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isUsersDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg>                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                            អ្នកប្រើប្រាស់
                                        </span>
                                    </div>
                                    <svg className={`w-4 h-4 transition-transform duration-300 ${isUsersDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>


                                <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isUsersDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                    <NavLink to="/user" className={navLinkStyle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">បញ្ជីឈ្មោះអ្នកប្រើប្រាស់</p>
                                    </NavLink>
                                    <NavLink to="/createuser" className={navLinkStyle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">បន្ថែមអ្នកប្រើប្រាស់</p>
                                    </NavLink>
                                </div>
                            </li>

                        )}

                        {/*  Report dropdown report */}
                        <li className="space-y-2">
                            <button onClick={handleReportDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isReportsDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap font-NotoSansKhmer font-bold">
                                        របាយការណ៍
                                    </span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isReportsDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>


                            <div className={`overflow-hidden transition-all duration-500 ${isReportsDropdown ? "max-h-[900px] opacity-100" : "max-h-0"}`}>
                                <NavLink to="/purchase" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍ចំណេញ/ខាត</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ទិញ & លក់</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍ពន្ធ</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer whitespace-nowrap">អតិថិជន​ & អ្នកផ្គត់ផ្គង់</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍ក្រុមអតិថិជន</p>
                                </NavLink>
                                <NavLink to="/purchase" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍ស្តុក</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍កែប្រែស្តុក</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ផលិតផលពេញនិយម</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍សម្ភារៈ</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍ទិញផលិតផល</p>
                                </NavLink>



                                <NavLink to="/purchase" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍លក់ផលិតផល</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍ទូទាត់ការទិញ</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍ទូទាត់ការលក់</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍ចំណាយ</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍ការបើកផ្ទាំងលក់</p>
                                </NavLink>
                                <NavLink to="/purchase-list" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 ml-3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">របាយការណ៍តំណាងនៃការលក់</p>
                                </NavLink>
                            </div>
                        </li>


                    </ul>
                </div>
            </aside>
        </div>
    );
}

export default Navbar;
