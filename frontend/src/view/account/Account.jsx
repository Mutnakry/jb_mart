
import React, { useState } from 'react';
import Navbar from '../../component/Navbar';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { RiContactsBook3Fill } from "react-icons/ri";
import AccoutList from '../../component/acount/AccountList';
import AccoutType from '../../component/acount/AcountType';
import Transfer_Monry from '../../component/acount/Transfer_money';


const Account = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const categories = [
        {
            name: 'បញ្ជីឈ្មោះគណនី',
        },
        {
            name: 'ប្រភេទគណនី',
        },
        {
            name: 'ព័ត៍មានរបស់គណនី',
        },
    ];

    return (
        <div>
            <div className='print:hidden'>
                <Navbar />
            </div>
            <div className='Nav_bar  md:ml-64 bg-gray-100 dark:bg-gray-950 print:py-0 print:px-0'>
                <div className=" Div_bar w-full  print:mt-0 print:p-0 bg-white dark:border-gray-700 animate-fade-up animate-duration-2000 animate-ease-in-out ">

                    <div className="p-4 bg-white dark:border-gray-700 mt-5  print:border-0 print:shadow-none">
                        <div className='flex items-center gap-2 pb-5  print:hidden'>
                            <RiContactsBook3Fill className='text-lg' />
                            <p className='font-NotoSansKhmer font-bold text-lg'>អតិជន</p>
                        </div>
                        <div className="w-full">
                            <TabGroup selectedIndex={activeTabIndex} onChange={setActiveTabIndex}>
                                <TabList className="flex  print:hidden">
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
                                    <TabPanel className="p-4 border  print:border-0 print:shadow-none print:hidden">
                                        <AccoutList />
                                    </TabPanel>
                                    <TabPanel className="p-4 border  print:border-0 print:shadow-none print:hidden">
                                        <AccoutType />
                                    </TabPanel>
                                    <TabPanel className="p-4 border print:p-0 border-gray-300 rounded-md  print:border-0 print:shadow-none">
                                        <Transfer_Monry />
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
