import { useState, useEffect } from "react";
import { RiContactsBook3Fill } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { TbSwitch3 } from "react-icons/tb";
import axios from "axios";
import TableCurrency from "../TableCurrency";
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { API_URL } from '../../../service/api'


const ModaleExchangRateToPOS = ({ setIsModalExchangRate }) => {
    const [inputValue, setInputValue] = useState(0);
    const [outputValue, setOutputValue] = useState(0);
    const [orderOutputValue, setOrderOutputValue] = useState(0);
    const [orderOutCurrency, setOrderCurrency] = useState("បាត");
    const [fromCurrency, setFromCurrency] = useState("រៀល");
    const [toCurrency, setToCurrency] = useState("ដុល្លារ");
    const [currency, setCurrency] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exchangeRateKHR, setExchangeRateKHR] = useState(4200);
    const [thbToKhrRateTHB, setThbToKhrRateTHB] = useState(120);
    const [exchangeRateUSD, setExchangeRateUSD] = useState(1);


    const getCurrencyData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/currency`);
            const fetchedData = response.data;
            setCurrency(fetchedData);
            console.log(fetchedData)
            const khrRate = parseFloat(fetchedData.find(c => c.name === "KHR")?.rate) || 4200;
            const thbRate = parseFloat(fetchedData.find(c => c.name === "THB")?.rate) || 120;
            const usdRate = parseFloat(fetchedData.find(c => c.name === "USD")?.rate) || 1;
            console.log(khrRate)
            console.log(thbRate)
            setExchangeRateKHR(khrRate);
            setThbToKhrRateTHB(thbRate);
            setExchangeRateUSD(usdRate);
        } catch (error) {
            console.error("Error fetching exchange rates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCurrencyData();
    }, []);


    const exchangeRates = {
        រៀល: { ដុល្លារ: exchangeRateUSD / exchangeRateKHR, បាត: exchangeRateUSD / thbToKhrRateTHB },
        ដុល្លារ: { រៀល: exchangeRateKHR, បាត: exchangeRateKHR / thbToKhrRateTHB },
        បាត: { រៀល: thbToKhrRateTHB, ដុល្លារ: thbToKhrRateTHB / exchangeRateKHR },
    };




    useEffect(() => {
        // Check if both currencies are ដុល្លារ and change to រៀល if true
        if (fromCurrency === "ដុល្លារ" && toCurrency === "ដុល្លារ") {
            setToCurrency("រៀល");
        }
        setInputValue(0);
        setOutputValue(0);
        setOrderOutputValue(0);

        if (fromCurrency === "រៀល" && toCurrency === "រៀល") {
            setToCurrency("ដុល្លារ");
        }

        // Determine order currency based on the selected toCurrency
        const currencyMap = {
            "ដុល្លារ": { "រៀល": "បាត", "បាត": "រៀល", "រៀល": "បាត" },
            "រៀល": { "ដុល្លារ": "បាត", "បាត": "ដុល្លារ" },
            "បាត": { "ដុល្លារ": "រៀល", "រៀល": "ដុល្លារ" },
        };

        setOrderCurrency(currencyMap[toCurrency][fromCurrency]);
    }, [fromCurrency, toCurrency]);

    useEffect(() => {
        // Update orderOutputValue when inputValue or currencies change
        const conversionRateOrder = exchangeRates[fromCurrency][orderOutCurrency];
        setOrderOutputValue(parseFloat((inputValue * conversionRateOrder).toFixed(2)));
    }, [inputValue, fromCurrency, orderOutCurrency]);

    const handleInputChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setInputValue(value);

        // Conversion logic for output value
        if (fromCurrency !== toCurrency) {
            const conversionRate = exchangeRates[fromCurrency][toCurrency];
            setOutputValue(parseFloat((value * conversionRate).toFixed(2)));
        } else {
            setOutputValue(value);
        }
    };

    const handleSwitch = () => {
        // Switch the currencies
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setInputValue(0);
        setOutputValue(0);
        setOrderOutputValue(0);
    };

    const getToCurrencyOptions = () => {
        // Return the available options for "To" currency based on "From" currency
        const options = [
            { value: "រៀល", label: "Khmer Riel (រៀល)" },
            { value: "ដុល្លារ", label: "US Dollar (ដុល្លារ)" },
            { value: "បាត", label: "Thai Baht (បាត)" }
        ];

        return options.filter(option => {
            if (fromCurrency === "ដុល្លារ" && option.value === "ដុល្លារ") return false;
            if (fromCurrency === "រៀល" && option.value === "រៀល") return false;
            if (fromCurrency === "បាត" && option.value === "បាត") return false;
            return true;
        });
    };



    // Function to get all exchange rate statements
    const getExchangeRateStatements = () => {
        const statements = [];

        for (const fromCurrency in exchangeRates) {
            for (const toCurrency in exchangeRates[fromCurrency]) {
                const rate = exchangeRates[fromCurrency][toCurrency];
                // Create the exchange rate statement
                statements.push({
                    fromCurrency,
                    toCurrency,
                    rate: rate.toFixed(4),
                });
            }
        }

        return statements;
    };

    const exchangeRateStatements = getExchangeRateStatements();

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsModalExchangRate(false);
        }
    };


    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 p-4 flex items-start justify-center w-full h-full bg-black bg-opacity-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={handleOverlayClick}
        >
            <div className="relative w-full max-w-5xl bg-white rounded-lg mt-2 shadow-md  p-6 dark:bg-gray-700 overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <RiContactsBook3Fill className="text-lg" />
                        <p className="text-lg font-bold font-NotoSansKhmer">អត្រាប្តូប្រាក់</p>
                    </div>
                    <MdClose
                        className="text-2xl cursor-pointer text-gray-700 hover:text-red-500 dark:text-white"
                        onClick={() => setIsModalExchangRate(false)}
                    />
                </div>
                {/* 💱 Currency Selectors - Cute Form Style */}
                <div className="flex flex-wrap gap-8 items-start pb-10 bg-blue-50 p-6 rounded-xl shadow-inner border border-blue-200">
                    <div className="space-y-2">
                        <label className="font-NotoSansKhmer text-blue-900 font-bold text-lg">📥 ប្តូរ​ពី</label>
                        <select
                            value={fromCurrency}
                            onChange={(e) => setFromCurrency(e.target.value)}
                            className="input_text font-NotoSansKhmer font-bold w-[260px] rounded-xl border border-blue-300 p-3 text-blue-800 shadow-sm"
                        >
                            <option value="រៀល">Khmer Riel (រៀល)</option>
                            <option value="ដុល្លារ">US Dollar (ដុល្លារ)</option>
                            <option value="បាត">Thai Baht (បាត)</option>
                        </select>
                    </div>

                    <div className="flex items-end h-[90px]">
                        <GoArrowRight className="w-10 h-10 text-blue-600 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <label className="font-NotoSansKhmer text-blue-900 font-bold text-lg">📤 ទៅ</label>
                        <select
                            value={toCurrency}
                            onChange={(e) => setToCurrency(e.target.value)}
                            className="input_text font-NotoSansKhmer font-bold w-[260px] rounded-xl border border-blue-300 p-3 text-blue-800 shadow-sm"
                        >
                            {getToCurrencyOptions().map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 💸 Exchange Input & Output - Cute Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {/* Input Amount */}
                    <div className="relative">
                        <label className="font-NotoSansKhmer text-blue-900 font-bold mb-1 block">ប្រាក់ {fromCurrency}</label>
                        <input
                            type="number"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="input_text w-full p-3 rounded-xl border border-blue-300 shadow-inner text-blue-800 font-bold"
                            placeholder={`បញ្ចូលប្រាក់ ${fromCurrency}`}
                        />
                        <span className="absolute right-4 top-10 bg-blue-600 text-white rounded-full px-4 py-1 text-sm shadow-md">
                            {fromCurrency}
                        </span>
                    </div>

                    {/* Switch Icon */}
                    <div className="flex items-center justify-center pt-6">
                        <TbSwitch3
                            className="w-12 h-12 text-pink-500 cursor-pointer hover:text-pink-700 transition duration-300 ease-in-out transform hover:scale-110"
                            onClick={handleSwitch}
                            title="Switch Currency"
                        />
                    </div>

                    {/* Output Amount */}
                    <div className="relative">
                        <label className="font-NotoSansKhmer text-blue-900 font-bold mb-1 block">ទៅប្រាក់ {toCurrency}</label>
                        <input
                            type="number"
                            readOnly
                            value={outputValue}
                            className="input_text w-full p-3 rounded-xl border border-gray-300 bg-gray-100 text-blue-800 font-semibold shadow-inner"
                            placeholder={`ចេញជា ${toCurrency}`}
                        />
                        <span className="absolute right-4 top-10 bg-blue-600 text-white rounded-full px-4 py-1 text-sm shadow-md">
                            {toCurrency}
                        </span>
                    </div>

                    {/* Output Order Currency */}
                    <div className="relative col-span-full lg:col-span-2">
                        <label className="font-NotoSansKhmer text-blue-900 font-bold mb-1 block">ប្រាក់ {orderOutCurrency}</label>
                        <input
                            type="number"
                            readOnly
                            value={orderOutputValue}
                            className="input_text w-full p-3 rounded-xl border border-gray-300 bg-gray-100 text-blue-800 font-semibold shadow-inner"
                            placeholder={`បង្ហាញជា ${orderOutCurrency}`}
                        />
                        <span className="absolute right-4 top-10 bg-blue-600 text-white rounded-full px-4 py-1 text-sm shadow-md">
                            {orderOutCurrency}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export default ModaleExchangRateToPOS