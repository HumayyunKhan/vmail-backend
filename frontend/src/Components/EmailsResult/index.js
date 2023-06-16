import React, { useState } from 'react'
import './emailsResult.css'

const EmailsResult = (props) => {

    const [textValue, setTextValue] = useState('')
    const [resultStatus, setResultStatus] = useState('')


    const getResult = async (text) => {
        const response = await props.emailResult(text);
        // console.log("Validation Status: " + response)
        setResultStatus(response);
    }


    return (
        <>
            <div className='title-container'>
                <h2 className='title'>Get Emails Result</h2>
            </div>
            <div className="text-section">
                <input
                    type="text"
                    value={textValue}
                    placeholder='Enter you Batch ID'
                    onChange={(e) => setTextValue(e.target.value)}
                />
            </div>

            {resultStatus === 'PENDING' ?
                <h5 className='result-status'>Batch ID Status is &nbsp;<p className='pending'> PENDING</p></h5>
                : null
            }

            {
                resultStatus === 'FINALIZE' ?
                <button className="btn result-btn" disabled={resultStatus === 'PENDING' ? true : false}>Download Result</button>
                : null
            }

            <div className='btn-container'>
                <button onClick={() => { getResult(textValue) }}>Get Validation Result</button>
            </div>
        </>
    )
}

export default EmailsResult