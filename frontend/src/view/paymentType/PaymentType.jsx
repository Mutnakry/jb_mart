import React from 'react'
import Navbar from '../../component/Navbar'
import PamentList from '../../component/pamentType/PamentList'

function PaymentType() {
    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
                <div className=' Div_bar'>
                <PamentList />
            </div>
            </div>
        </div>
    )
}

export default PaymentType