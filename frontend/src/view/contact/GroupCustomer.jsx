import React from 'react'
import Navbar from '../../component/Navbar'
import CustomerGroup from '../../component/contract/CustomerGroup'

function Cost() {
    return (
        <div className=''>
            <Navbar />
            <div className='Nav_bar'>
                <div className=' Div_bar bg-white'>
                    <CustomerGroup />
                </div>
            </div>
        </div>
    )
}

export default Cost