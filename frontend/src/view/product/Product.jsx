
import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { RiContactsBook3Fill } from "react-icons/ri";
import ProductList from '../../component/product/product/ProductList';
import ProductInfo from '../../component/product/ProductInfo';
import AddBacode from '../../component/product/AddBacode';
import Order_List from '../../component/order/Order_List';

const Account = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const categories = [
        {
            name: ' ផលិតផលទាំងអស់',
        },
        {
            name: 'ព័ត៍មានរបាយការណ៍ស្តុក',
        },
        {
            name: 'របាយការណ៍លក់',
        },
        {
            name: 'បោះពុម្ភបាដកូដ',
        },
    ];

    return (
        <div>
            <Navbar />
            <div className='md:py-12 py-2 px-6  sm:ml-64 md:w-auto w-[860px] bg-gray-100 dark:bg-gray-950'>
                <div className="w-full p-4 mt-7 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">

                    <div className="p-4 bg-white dark:border-gray-700 mt-5 ">
                        <div className='flex items-center gap-2 pb-5'>
                            <RiContactsBook3Fill className='text-lg' />
                            <p className='font-NotoSansKhmer font-bold text-lg'>ផលិតផល</p>
                        </div>
                        <div className="w-full">
                            <TabGroup selectedIndex={activeTabIndex} onChange={setActiveTabIndex}>
                                <TabList className="md:flex gap-2 md:space-y-0  space-y-2">
                                    {categories.map(({ name }, index) => (
                                        <Tab
                                            key={name}
                                            className={` py-3 px-4 text-sm text-black font-NotoSansKhmer font-bold ${activeTabIndex === index ? 'border-[2px] border-blue-500' : 'border-2'} focus:outline-none`}
                                        >
                                            {name}
                                        </Tab>
                                    ))}
                                </TabList>

                                <TabPanels className="mt-3">
                                    <TabPanel className="p-4 border">
                                        <ProductList />
                                    </TabPanel>
                                    <TabPanel className="p-4 border border-gray-300 rounded-md">
                                        <ProductInfo />
                                    </TabPanel>
                                    <TabPanel className="p-4 border border-gray-300 rounded-md">
                                        <Order_List />
                                    </TabPanel>
                                    <TabPanel className="p-4 border border-gray-300 rounded-md">
                                        <AddBacode />
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

export default Account;
