import { useState, useEffect } from "react";
import { RiContactsBook3Fill } from "react-icons/ri";
import { GoArrowRight } from "react-icons/go";
import { TbSwitch3 } from "react-icons/tb";
import axios from "axios";
import TableCurrency from "../TableCurrency";
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import {API_URL} from '../../../service/api'


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
                <div className="">
                    {/* Currency Selector */}
                    <div className="mt-5 flex gap-5 items-center pb-8">
                        <div>
                            <label htmlFor="fromCurrencySelect" className="font-NotoSansKhmer font-bold text-lg">អត្រាប្តូប្រាក់ ពី</label>
                            <select
                                id="fromCurrencySelect"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="input_text font-NotoSansKhmer font-bold xl:w-[350px] w-[280px] block"
                            >
                                <option value="រៀល">Khmer Riel (រៀល)</option>
                                <option value="ដុល្លារ">US Dollar (ដុល្លារ)</option>
                                <option value="បាត">Thai Baht (បាត)</option>
                            </select>
                        </div>
                        <div><GoArrowRight className="w-10 h-10 translate-y-3 text-gray-600" /></div>
                        <div>
                            <label htmlFor="toCurrencySelect" className="font-NotoSansKhmer font-bold text-lg">ទៅ</label>
                            <select
                                id="toCurrencySelect"
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="input_text font-NotoSansKhmer font-bold xl:w-[350px] w-[280px]  block"
                            >
                                {getToCurrencyOptions().map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* From Currency Input */}
                    <div className="flex items-center gap-10">
                        <div className="relative w-full space-y-2">
                            <label htmlFor="fromCurrency" className="font-NotoSansKhmer font-bold text-lg">អត្រាប្តូប្រាក់ ពី ប្រាក់{fromCurrency}</label>
                            <input
                                type="number"
                                id="fromCurrency"
                                className="input_text"
                                placeholder={fromCurrency}
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <div className="absolute right-0 p-2.5 px-5 bg-blue-500 top-6">
                                <p className="text-white">{fromCurrency}</p>
                            </div>
                        </div>

                        {/* Switch Currencies Button */}
                        <div className="mt-5">
                            <TbSwitch3
                                className="w-10 h-10 text-blue-600 cursor-pointer hover:text-blue-800"
                                onClick={handleSwitch}
                            />
                        </div>

                        <div className="relative w-full space-y-2">
                            <label htmlFor="toCurrency" className="font-NotoSansKhmer font-bold text-lg">ទៅ  ប្រាក់{toCurrency}</label>
                            <input
                                type="number"
                                id="toCurrency"
                                readOnly
                                className="bg-gray-100 input_text"
                                placeholder={toCurrency}
                                value={outputValue}
                            />
                            <div className="absolute right-0 p-2.5 px-5 bg-blue-500 top-6">
                                <p className="text-white">{toCurrency}</p>
                            </div>
                        </div>
                        <div className="relative w-full space-y-2">
                            <label htmlFor="orderCurrency" className="font-NotoSansKhmer font-bold text-lg">ប្រាក់{orderOutCurrency}</label>
                            <input
                                type="number"
                                id="orderCurrency"
                                readOnly
                                className="bg-gray-100 input_text"
                                placeholder={orderOutCurrency}
                                value={orderOutputValue}
                            />
                            <div className="absolute right-0 p-2.5 px-5 bg-blue-500 top-6">
                                <p className="text-white">{orderOutCurrency}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid xl:grid-cols-2 gap-10 md:grid-cols-1 border-t-4 justify-between mt-10 shadow-lg p-2 pr-8 border-blue-700 rounded-lg">
                    <div>
                            <TableCurrency />
                        </div>
                        <div className=" bg-blue-950 rounded-lg">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2">រូបិយបណ្ណ</th>
                                        <th className="border border-gray-300 px-4 py-2">អត្រាប្តូប្រាក់</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exchangeRateStatements.map((statement, index) => (
                                        <tr key={index} className="hover:bg-gray-50 text-2xl">

                                            <td className="border border-gray-300 px-4 text-center text-yellow-300 py-2">
                                                <div className="flex space-x-12 items-center">
                                                    <span>   {statement.fromCurrency}</span>
                                                    <span><img className="h-8" src="https://cdn.pixabay.com/animation/2022/10/06/13/44/13-44-02-515_512.gif" alt="" />
                                                    </span>
                                                    <span>   {statement.toCurrency}</span>
                                                </div>
                                            </td>
                                            <td className="border border-gray-300 text-yellow-300 px-4 py-2">
                                                {statement.rate}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>
        </motion.div>
    );
};


export default ModaleExchangRateToPOS