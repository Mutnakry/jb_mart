
import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { RiContactsBook3Fill } from "react-icons/ri";
import CustomerList from '../../component/invoie/Customer';
import Supplier from '../../component/invoie/Supplier';

const Customer = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const categories = [
        {
            name: 'របាយការណ៏អតិជន',
        },
        {
            name: 'របាយការណ៏អ្នកផ្គត់ភ្គង',
        },
       
    ];


    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
                <div className="bg-white Div_bar">
                    <div className="dark:border-gray-700">
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
                                        <Supplier />
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
