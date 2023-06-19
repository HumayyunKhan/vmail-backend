import React, { useState } from 'react'
import './allBatchIDs.css'

const AllBatchIDs = (props) => {

    const [textValue, setTextValue] = useState('')
    const [validationStatus, setValidationStatus] = useState('')


    const getBatchIds = async () => {
        const response = await props.getAllBatchIds();
        // console.log("Validation Status: " + response)
        // setValidationStatus(response);
    }


    return (
        <>
            <div className='title-container'>
                <h2 className='title'>Get All Batch IDs</h2>
            </div>
            <div className='btn-container' style={{marginTop: '10%'}}>
                <button onClick={() => { getBatchIds() }}>Get All Batch Ids</button>
            </div>
        </>
    )
}

export default AllBatchIDs