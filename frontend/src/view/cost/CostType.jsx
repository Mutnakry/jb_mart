import React from 'react'
import Navbar from '../../component/Navbar'
import CostTypeConponent from '../../component/const/CostType'

function Cost() {
    return (
        <div>
            <Navbar />
            <div className='Nav_bar'>
            <div className=' Div_bar'>
                <CostTypeConponent />
            </div>
            </div>
        </div>
    )
}

export default Cost

