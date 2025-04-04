import React from 'react'
import Navbar from '../../component/Navbar'
import CostConponent from '../../component/const/Cost'

function Cost() {
    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
                <div className=' Div_bar'>
                    <CostConponent />
                </div>
            </div>
        </div>
    )
}

export default Cost

