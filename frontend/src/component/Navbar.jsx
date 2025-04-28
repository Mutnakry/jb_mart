import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";

// import { NavLink } from 'react-router-dom';
// import { MdOutlineMoneyOff } from "react-icons/md";
// import { RiLuggageDepositFill } from "react-icons/ri";
import { formatDateToKhmer, formatTimeToKhmer } from '../component/ForMartDateToKHmer';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // Refs for the sidebar and button
    const sidebarRef = useRef(null);
    const buttonRef = useRef(null);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current && !sidebarRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Load the initial theme from localStorage or default to "light"
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    // State to hold user information
    const [userNames, setUserNames] = useState('');
    const [userRol, setUserRol] = useState('');
    useEffect(() => {
        setUserNames(localStorage.getItem('user_names') || '');
        setUserRol(localStorage.getItem('user_rol') || '');
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // Save the theme to localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_rol');
        localStorage.removeItem('user_id');
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
    const contactRoutes = ["/supplier", "/customer", "/groupcustomer", "/customer_payment"];
    const productsRoutes = ["/category", "/brands", "/udit", "/product", "/createproduct", "/varrenty", "/tests"];
    const purchaseRoutes = ["/purchase", "/createpurchase", '/order-Repay'];
    const topupRoutes = ['/topup', '/topupList']
    const exspenseRoutes = ['/cost', '/costtype']
    const accountRoutes = ['/account', '/account_list']
    const paymentRoutes = ['/paymenttype', '/payment_list']
    const usersRoutes = ['/user', '/createuser']
    const reportsRoutes = ['/InvocePurchase', '/InvoceSaleAndPuchase', '/CustomerAndSupplier', '/InvoiceGroupCustomer', '/InvoiceStock', '/SaleProductQTY', '/OrderPurchase', '/SaleProduct', '/CostInvoice', '/ProductPobpular', '/ReportClostCash', '/OpenBalenceList']
    const currentcyRoutes = ['/exchange', '/currency_list']
    const ProductDisRoutes = ['/discount_product', '/create_discount_product']

    const isContactActive = contactRoutes.some((route) => window.location.pathname.startsWith(route));
    const isProductsActive = productsRoutes.some((route) => window.location.pathname.startsWith(route));
    const isPurchaseActive = purchaseRoutes.some((route) => window.location.pathname.startsWith(route));
    const isTopupRouteActive = topupRoutes.some((route) => window.location.pathname.startsWith(route));
    const isExpenseRouteActive = exspenseRoutes.some((route) => window.location.pathname.startsWith(route));
    const isAccountRouteActive = accountRoutes.some((route) => window.location.pathname.startsWith(route));
    const isPaymentActive = paymentRoutes.some((route) => window.location.pathname.startsWith(route));
    const isUsersActive = usersRoutes.some((route) => window.location.pathname.startsWith(route));
    const isReportsActive = reportsRoutes.some((route) => window.location.pathname.startsWith(route));
    const isCurrencyActive = currentcyRoutes.some((route) => window.location.pathname.startsWith(route));
    const isProductDisActive = ProductDisRoutes.some((route) => window.location.pathname.startsWith(route));




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

    return (
        <div className='bg-gray-200'>
            {/* Navbar */}
            <nav className="top-0 z-50 w-full md:fixed md:px-4 md:m-0">
                <div className="px-4 py-3 bg-white border-b border-gray-200 sm:ml-64 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-between space-x-4 rtl:justify-end">
                            <button
                                ref={buttonRef}  // Attach ref to the button
                                onClick={toggleMenu}
                                type="button"
                                className="inline-flex items-center text-sm text-gray-900 rounded-lg sm:hidden focus:outline-none"
                            >
                                {menuOpen ? (
                                    <AiOutlineMenuUnfold size={24} />
                                ) : (
                                    <AiOutlineMenuFold size={24} />
                                )}
                            </button>
                            <div className='flex items-center gap-2 font-bold'>
                                <span>កាលបរិច្ឆេត:</span>
                                <p className='text-sm text-gray-700 font-NotoSansKhmer md:text-xl lg:text-[17px] font-bold'>
                                    <span >{khmerToday}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className='flex space-x-4'>
                                <NavLink to="/check/pos" >
                                    <div className='relative flex items-center px-6 py-2 space-x-2 text-lg font-medium transition duration-300 text-black/60'>
                                        <svg
                                            className="flex-shrink-0 w-5 h-5 "
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 18 18"
                                        >
                                            <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                        </svg>

                                        <div className='absolute -top-2 px-1.5  text-[10px] text-white'>
                                            <span className='px-1 bg-red-500 rounded-full'>POS</span>
                                        </div>
                                    </div>


                                </NavLink>


                                <div className="flex items-center gap-1">
                                    <span className="font-bold font-NotoSansKhmer">ប្រវត្តិរូប:</span>
                                    <p className="text-sm font-bold text-gray-700 capitalize" role="none">
                                        {userNames}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center pr-0 ms-3 md:pr-20 xl:pr-0">
                                <div>
                                    <button
                                        type="button"
                                        onClick={toggleDropdown}
                                        className="flex p-2.5 bg-gray-200 rounded-full"
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
                                    <div className="absolute z-10 p-2 text-gray-600 -translate-x-4 bg-white shadow mt-14 top-4 w-44 -right-0">
                                        <div className="items-center gap-1 text-sm cursor-pointer hover:text-red-400">
                                            {/* <div className="px-4 py-3" role="none">
                                                <p className="text-sm font-bold text-gray-900" role="none">
                                                    Name: {userNames}
                                                </p>
                                                <p className="text-sm font-bold text-gray-900" role="none">
                                                    Email: {userEmail}
                                                </p>
                                            </div> */}
                                            <ul className="py-1" role="none">
                                                <li>
                                                    <a
                                                        href="/"
                                                        onClick={handleLogout}
                                                        className="block px-4 py-1 text-gray-700 text-md hover:text-gray-500 dark:text-gray-300 dark:hover:text-white"
                                                        role="menuitem"
                                                    >
                                                        ចាកចេញ
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

            {/* Sidebar */}
            <aside
                ref={sidebarRef}  // Attach ref to the sidebar
                className={`fixed md:top-0 top-12 h-full bg-white left-0 z-40 w-64 overflow-y-auto scrollbar-hidden transition-transform shadow
                ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
            >
                <div className="px-3 overflow-y-auto">
                    <div className="my-4 text-center">
                        <h1 className="text-xl font-bold font-NotoSansKhmer">ហាងលក់ <br /> ទំនិញចែប៊ីម៉ាត</h1>
                    </div>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <NavLink to="/dashboard" className={navLinkStyle}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-gauge">
                                    <path d="M15.6 2.7a10 10 0 1 0 5.7 5.7" />
                                    <circle cx="12" cy="12" r="2" />
                                    <path d="M13.4 10.6 19 5" />
                                </svg>
                                <span className="flex-1 ml-1 font-bold whitespace-nowrap font-NotoSansKhmer">ផ្ទាំងគ្រប់គ្រង</span>
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
                                    <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">ទំនាក់ទំនង</span>
                                </div>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isContactDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isContactDropdown ? "max-h-96 opacity-100" : "max-h-0"}`}>
                                {(userRol === 'superadmin' || userRol === 'user' || userRol === 'admin') && (
                                    <NavLink to="/supplier" className={navLinkStyle}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                        <p className="font-bold font-NotoSansKhmer">អ្នកផ្គត់ផ្គង់</p>
                                    </NavLink>
                                )}
                                <NavLink to="/customer" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">អតិជន</p>
                                </NavLink>
                                <NavLink to="/groupcustomer" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">បញ្ជីរក្រុមអតិជន</p>
                                </NavLink>
                                <NavLink to="/customer_payment" className={navLinkStyle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                    </svg>
                                    <p className="font-bold font-NotoSansKhmer">ស្វែងរកអតិជនបង់ប្រាក់</p>
                                </NavLink>

                            </div>
                        </li>
                        {(userRol === 'superadmin' || userRol === 'user' || userRol === 'admin') && (
                            <div>
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
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">ផលិតផល</span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isProductDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isProductDropdown ? "max-h-96 opacity-100" : "max-h-0"}`}>
                                        <NavLink to="/product" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បញ្ជីផលិតផល</p>
                                        </NavLink>

                                        {/* user add purchase admin and superadmin */}

                                        {(userRol === 'superadmin' || userRol === 'admin') ? (
                                            <NavLink to="/createproduct" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">បន្ថែមផលិតផល</p>
                                            </NavLink>
                                        ) : (
                                            <div className='flex items-center gap-2 p-3 cursor-not-allowed "bg-blue-600 dark:bg-blue-500 text-gray-800 dark:text-white'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">បន្ថែមផលិតផល</p>
                                            </div>
                                        )}
                                        {/* <NavLink to="/tests" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បញ្ចូលផលិតផល</p>
                                        </NavLink> */}
                                        <NavLink to="/udit" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ឯកតា</p>
                                        </NavLink>
                                        <NavLink to="/category" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ប្រភេទទំនិញ</p>
                                        </NavLink>
                                        <NavLink to="/brands" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ម៉ាកយីហោ</p>
                                        </NavLink>
                                        <NavLink to="/varrenty" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
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
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">បញ្ជាទិញទំនិញ</span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isPurchaseDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isPurchaseDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                        <NavLink to="/purchase" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">រាយបញ្ជីទិញ</p>
                                        </NavLink>

                                        {/* user add purchase admin and superadmin */}
                                        {(userRol === 'superadmin' || userRol === 'admin') ? (
                                            <NavLink to="/createpurchase" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">បន្ថែមការបញ្ជាទិញ</p>
                                            </NavLink>
                                        ) : (
                                            <div className='flex items-center gap-2 p-3 cursor-not-allowed "bg-blue-600 dark:bg-blue-500 text-gray-800 dark:text-white'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">បន្ថែមការបញ្ជាទិញ</p>
                                            </div>
                                        )}

                                        <NavLink to="/order-Repay" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ការទិញដែលប្តូរយកវិញ</p>
                                        </NavLink>
                                    </div>
                                </li>
                            </div>
                        )}

                        {/* Purchase POS */}
                        <li>
                            <NavLink to="/check/pos" className={navLinkStyle}>
                                <svg
                                    className="flex-shrink-0 w-5 h-5 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ml-2 font-bold whitespace-nowrap font-NotoSansKhmer">
                                    ផ្ទាំងលក់ទំនិញ
                                </span>
                            </NavLink>
                        </li>
                        {/* Purchase POS */}
                        {/* <li>
                            <NavLink to="/index/pos/user" className={navLinkStyle}>
                                <svg
                                    className="flex-shrink-0 w-5 h-5 "
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 18 18"
                                >
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ml-2 font-bold whitespace-nowrap font-NotoSansKhmer">
                                    ផ្ទាំងលក់ទំនិញសម្រាប់អតិជន
                                </span>
                            </NavLink>
                        </li> */}


                        {(userRol === 'superadmin' || userRol === 'user' || userRol === 'admin') && (
                            <div>
                                {/* Topup Phone dropdown */}
                                <li className="space-y-2">
                                    <button onClick={handleDropdownProductDiscount} className={`flex items-center p-3 w-full text-left justify-between ${isProductDisDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-receipt-text"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M14 8H8" /><path d="M16 12H8" /><path d="M13 16H8" /></svg>
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                បញ្ចុះតម្លៃផលិតផល
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isProductDisDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isProductDisDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>

                                        <NavLink to="/discount_product" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បង្កើតផលិតផល</p>
                                        </NavLink>
                                        <NavLink to="/create_discount_product" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បង្កើតផលិតផលបញ្ចុះតម្លៃ</p>
                                        </NavLink>
                                    </div>
                                </li>

                                {/*  Currency Dropdown */}
                                {/* <li className="space-y-2">
                                    <button onClick={handleCurrencyDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isCurrencyDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                រូបិយប័ណ្ណ
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isCurrencyDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isCurrencyDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                        <NavLink to="/exchange" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បង្កើតបញ្ជាទិញ</p>
                                        </NavLink>
                                        <NavLink to="/purchase-list" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បញ្ជីបញ្ជាទិញ</p>
                                        </NavLink>
                                    </div>
                                </li> */}
                                <li>
                                    <NavLink to="/exchange" className={navLinkStyle}>
                                    <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-receipt"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></svg>
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                រូបិយប័ណ្ណ
                                            </span>
                                        </div>
                                    </NavLink>
                                </li>
                                {/*  Extense Dropdown */}
                                <li className="space-y-2">
                                    <button onClick={handleExspenseDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isExpenseDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.99 7.5 8.24 3.75m0 0L4.49 7.5m3.75-3.75v16.499h11.25" />
                                            </svg>
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                ចំណាយ
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isExpenseDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isExpenseDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                        <NavLink to="/cost" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បញ្ជីចំណាយ</p>
                                        </NavLink>
                                        <NavLink to="/costtype" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ប្រភេទនៃការចំណាយ</p>
                                        </NavLink>
                                    </div>
                                </li>

                                {/*  Account Dropdown using to super addmin */}
                                {userRol === 'superadmin' && (
                                    <li className="space-y-2">
                                        <button onClick={handleAccountDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isAccountDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                                <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                    គណនី
                                                </span>
                                            </div>
                                            <svg className={`w-4 h-4 transition-transform duration-300 ${isAccountDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isAccountDropdown ? "max-h-96 opacity-100" : "max-h-0"}`}>
                                            <NavLink to="/account" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">បញ្ជីឈ្មោះគណនី</p>
                                            </NavLink>
                                            {/* <NavLink to="/purchase-list" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">តុល្យការ</p>
                                            </NavLink>
                                            <NavLink to="/purchase" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">តារាងតុល្យភាព</p>
                                            </NavLink>
                                            <NavLink to="/purchase-list" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">លំហូរសាច់ប្រាក់</p>
                                            </NavLink>
                                            <NavLink to="/purchase-list" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">របាយការណ៍គណនីចំណាយ</p>
                                            </NavLink> */}
                                        </div>
                                    </li>
                                )}
                                {/*  Payment method dropdown using to super addmin */}
                                <li className="space-y-2">
                                    <button onClick={handlepaymentDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isPaymentMethodDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg>                                    <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                វិធីសាស្រ្តបង់ប្រាក់
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isPaymentMethodDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isPaymentMethodDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                        <NavLink to="/paymenttype" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បញ្ជីបង់ប្រាក់</p>
                                        </NavLink>
                                        {/* <NavLink to="/purchase-list" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">បញ្ជីបង់ប្រាក់</p>
                                        </NavLink> */}
                                    </div>
                                </li>

                                {userRol === 'superadmin' && (
                                    <li className="space-y-2">
                                        <button onClick={handleUsersDropdown} className={`flex items-center p-3 w-full text-left justify-between ${isUsersDropdown ? "bg-blue-700 dark:bg-blue-500 text-white" : "text-gray-900 dark:text-white"}`}>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-users-round"><path d="M18 21a8 8 0 0 0-16 0" /><circle cx="10" cy="8" r="5" /><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" /></svg>                                    <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                    អ្នកប្រើប្រាស់
                                                </span>
                                            </div>
                                            <svg className={`w-4 h-4 transition-transform duration-300 ${isUsersDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>


                                        <div className={`overflow-hidden transition-all duration-500 space-y-2 ${isUsersDropdown ? "max-h-40 opacity-100" : "max-h-0"}`}>
                                            <NavLink to="/user" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                                <p className="font-bold font-NotoSansKhmer">បញ្ជីឈ្មោះអ្នកប្រើប្រាស់</p>
                                            </NavLink>
                                            <NavLink to="/createuser" className={navLinkStyle}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
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
                                            <span className="flex-1 font-bold ms-3 whitespace-nowrap font-NotoSansKhmer">
                                                របាយការណ៍
                                            </span>
                                        </div>
                                        <svg className={`w-4 h-4 transition-transform duration-300 ${isReportsDropdown ? "transform rotate-90" : ""}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>


                                    <div className={`overflow-hidden transition-all duration-500 ${isReportsDropdown ? "max-h-[900px] opacity-100" : "max-h-0"}`}>
                                        <NavLink to="/InvocePurchase" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍ទិញផលិតផល</p>
                                        </NavLink>
                                        <NavLink to="/InvoceSaleAndPuchase" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ទិញ & លក់</p>
                                        </NavLink>
                                        {/* <NavLink to="/purchase-list" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">របាយការណ៍ពន្ធ</p>
                                        </NavLink> */}
                                        <NavLink to="/CustomerAndSupplier" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer whitespace-nowrap">អតិថិជន​ & អ្នកផ្គត់ផ្គង់</p>
                                        </NavLink>
                                        <NavLink to="/InvoiceGroupCustomer" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">របាយការណ៍ក្រុមអតិថិជន</p>
                                        </NavLink>
                                        <NavLink to="/InvoiceStock" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍ស្តុក</p>
                                        </NavLink>
                                        <NavLink to="/SaleProductQTY" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">របាយការណ៍ទូទាត់ការលក់</p>
                                        </NavLink>
                                        <NavLink to="/ProductPobpular" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">ផលិតផលពេញនិយម</p>
                                        </NavLink>
                                        {/* <NavLink to="/purchase-list" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍សម្ភារៈ</p>
                                        </NavLink> */}
                                        <NavLink to="/OrderPurchase" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">របាយការណ៍ទិញផលិតផល</p>
                                        </NavLink>
                                        <NavLink to="/SaleProduct" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍លក់ផលិតផល</p>
                                        </NavLink>
                                        <NavLink to="/CostInvoice" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer whitespace-nowrap">របាយការណ៍ចំណាយ</p>
                                        </NavLink>
                                        <NavLink to="/ReportClostCash" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">របាយការណ៍ការបើកផ្ទាំងលក់</p>
                                        </NavLink>
                                        <NavLink to="/OpenBalenceList" className={navLinkStyle}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="ml-3 size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                            <p className="font-bold font-NotoSansKhmer">របាយការណ៍តំណាងនៃការលក់</p>
                                        </NavLink>
                                    </div>
                                </li>
                            </div>
                        )}
                    </ul>
                </div>
            </aside>
        </div>
    );
};

export default Navbar;
