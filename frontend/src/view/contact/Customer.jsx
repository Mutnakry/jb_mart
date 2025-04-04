
import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { RiContactsBook3Fill } from "react-icons/ri";
import CustomerList from '../../component/contract/CustomerList';
import CustomerGroup from '../../component/contract/CustomerGroup';
import CustomerInfo from '../../component/contract/CustomerInfo';
import Customer_payment_Info from '../../component/customer_payment/Customer_payment_Info';

const Customer = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const categories = [
        {
            name: 'បញ្ជីឈ្មោះអតិជន',
        },
        {
            name: 'ក្រុមអតិជន',
        },
        {
            name: 'ព័ត៍មានរបស់អតិជន',
        },
    ];


    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
                <div className="bg-white Div_bar">
                    <div className="mt-5 dark:border-gray-700">
                        <div className='flex items-center gap-2 pb-5'>
                            <RiContactsBook3Fill className='text-lg' />
                            <p className='text-lg font-bold font-NotoSansKhmer'>អតិជន</p>
                        </div>
                        <div className="w-full">
                            <TabGroup selectedIndex={activeTabIndex} onChange={setActiveTabIndex}>
                                <TabList className="flex gap-1">
                                    {categories.map(({ name }, index) => (
                                        <Tab
                                            key={name}
                                            className={` py-3 px-4 text-sm text-black font-NotoSansKhmer font-bold ${activeTabIndex === index ? 'border-[2px] border-blue-500' : 'border-2'} focus:outline-none`}
                                        >
                                            {name}
                                        </Tab>
                                    ))}
                                </TabList>

                                <TabPanels className="mt-3 ">
                                    <TabPanel className="p-4 border">
                                        <CustomerList />
                                    </TabPanel>
                                    <TabPanel className="p-4 border">
                                        <CustomerGroup />
                                    </TabPanel>
                                    <TabPanel className="p-4 border border-gray-300 ">
                                        <Customer_payment_Info />
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customer;
