import React, { useState } from 'react'
import './validationStatus.css'

const ValidationStatus = (props) => {

    const [textValue, setTextValue] = useState('')
    const [validationStatus, setValidationStatus] = useState('')
    const [deliveryTime, setDeliveryTime] = useState('')


    const checkStatus = async (text) => {
        const response = await props.statusCheck(text);
        console.log("Validation Status: " + response)
        setValidationStatus(response.status);
        setDeliveryTime(response.delivery);
    }


    return (
        <>
            <div className='title-container'>
                <h2 className='title'>Check Validation Status</h2>
            </div>
            <div className="text-section">
                <input
                    type="text"
                    value={textValue}
                    placeholder='Enter you Batch ID'
                    onChange={(e) => setTextValue(e.target.value)}
                />
            </div>
            <div className='btn-container'>
                <button onClick={() => { checkStatus(textValue) }}>Check Status</button>
            </div>
            {validationStatus !== '' ?
                <div className='validation-status-container'>
                    <h5 className='validation-status'>Validation status: &nbsp;<p className={validationStatus === 'PENDING' ? 'pending' : 'finalized'}>{validationStatus}</p>
                    </h5>
                    <h5 className='validation-time'>Validation time: &nbsp;<p className={validationStatus === 'PENDING' ? 'pending' : 'finalized'}>{deliveryTime}</p>
                    </h5>
                    <div className='result-btn-container'>
                        <button className="btn result-btn" disabled={validationStatus === 'PENDING' ? true : false}>Download Result</button>
                    </div>
                </div>
                : null
            }
        </>
    )
}

export default ValidationStatus