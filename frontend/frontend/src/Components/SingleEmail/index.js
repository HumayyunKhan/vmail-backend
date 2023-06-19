import React, { useState } from 'react'
import './singleEmail.css'

const SingleEmail = () => {

    const [textValue, setTextValue] = useState('');

    const handleSubmit = async () => {
        if (textValue === '') {
            return alert("Please enter a csv file or email in the field below");
        }

        // setIsLoading(true)

        // setEmailResult([{
        //   email: "sherykhan@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: false
        // },
        // {
        //   email: "ferozamdasdasir@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: false,
        //   isActice: false
        // },
        // {
        //   email: "johnsmith@yahoo.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: true
        // },
        // {
        //   email: "sherykhan@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: false
        // },
        // {
        //   email: "ferozamdasdasir@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: false,
        //   isActice: false
        // },
        // {
        //   email: "johnsmith@yahoo.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: true
        // },
        // {
        //   email: "sherykhan@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: false
        // },
        // {
        //   email: "ferozamdasdasir@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: false,
        //   isActice: false
        // },
        // {
        //   email: "johnsmith@yahoo.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: true
        // },
        // {
        //   email: "sherykhan@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: false
        // },
        // {
        //   email: "ferozamdasdasir@gmail.com",
        //   isValid: true,
        //   isDomainAvailable: false,
        //   isActice: false
        // },
        // {
        //   email: "johnsmith@yahoo.com",
        //   isValid: true,
        //   isDomainAvailable: true,
        //   isActice: true
        // }])

        // setTimeout(() => {
        //   setIsLoading(false)
        // }, 2000);

        // const formData = new FormData();
        // formData.append('file', selectedFile);

        // await fetch('http://localhost:3001/maily/validator/validateSingleEmail', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ email: textValue }),
        // })
        // console.log("Body for sinle mail checking -->>", body)
        //   .then((response) => console.log("response.json() -->> ", response.json()))
        //   .then((data) => setIsValid(data.isValid))
        //   .catch((error) => console.error(error))
        //   .finally(() => setIsLoading(false));

        // try {
        //   const response = await axios.post('http://localhost:3001/maily/validator/validateSingleEmail', { textValue });
        //   setEmailResult(response.data);
        // } catch (error) {
        //   console.error(error);
        //   // Handle error
        // }

        console.log('Text value:', textValue);
    };

    return (
        <>
            <div className='title-container'>
                <h2 className='title'>Validate Single Email</h2>
            </div>
            <div className="text-section">
                <input
                    type="text"
                    value={textValue}
                    placeholder='Enter an email address'
                    onChange={(e) => setTextValue(e.target.value)}
                />
            </div>
            <div className='btn-container'>
                <button onClick={handleSubmit}>Validate Email</button>
            </div>
        </>
    )
}

export default SingleEmail