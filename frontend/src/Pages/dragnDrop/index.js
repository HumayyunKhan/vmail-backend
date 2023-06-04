import React, { useEffect, useState } from 'react';
import './dragndrop.css';

import { LoadingSpinner } from '../../Components/LoadingSpinner';
import SingleEmail from '../../Components/SingleEmail';
import BulkEmail from '../../Components/BulkEmail';
import ValidationStatus from '../../Components/ValidationStatus';

const FileHandler = () => {

  const [consoleText, setConsoleText] = useState('');

  const [isLoading, setIsLoading] = useState(false)

  const [emailsData, setEmailsData] = useState(null);

  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  const statusCheck = async (batchId) => {
    try {
        const response = await fetch('http://localhost:3000/validate/checkStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                batchId: batchId
            }),
        });

        if (response.ok) {
            const json = await response.json();
            // Process the response data
            console.log(json);
            console.log(json.status);
            console.log(json.success);
            return json.status;

        } else {
            throw new Error('Failed to upload CSV');
        }
    } catch (error) {
        console.error(error);
    }

}

const emailResult = async (batchId) => {
    try {
        const response = await fetch('http://localhost:3000/validate/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                batchId: batchId
            }),
        });

        console.log(JSON.stringify({
            batchId: batchId
        }))

        if (response.ok) {
            const json = await response.json();
            // Process the response data
            console.log(json);

            setEmailsData(json.data)
            // console.log(json.data);

        } else {
            throw new Error('emailResult error');
        }
    } catch (error) {
        console.error(error);
    }
}

const validateEmails = async (csvFile) => {

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

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
        const response = await fetch('http://localhost:3000/validate/bulkValidate', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const json = await response.json();
            // Process the response data
            console.log(json);
            console.log(json.data.batchId);

            if (await statusCheck(json.data.batchId) === 'PENDING') {
              return
            }

            await emailResult(json.data.batchId);

        } else {
            throw new Error('Failed to upload CSV');
        }
    } catch (error) {
        console.error(error);
    }
};

  const tabs = [
    { title: 'Validate Bulk Emails', content: <BulkEmail validateEmails={validateEmails}></BulkEmail> },
    { title: 'Check Validation Status', content: <ValidationStatus statusCheck={statusCheck}></ValidationStatus> },
    // { title: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];


  return (
    <div className="container">

      <div className="tabs-container">
        <div className="tab-titles">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`tab-title ${currentTab === index ? 'active' : ''}`}
              onClick={() => handleTabChange(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`tab-pane ${currentTab === index ? 'active' : ''}`}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>




      <div className="console-section">
        {!isLoading ?
          // <EmailTable
          //   emailResult={emailResult}
          // ></EmailTable> 
          emailsData && (
            <div className='email-table'>
              <h2 className='table-heading'>Validation Result</h2>
              <table>
                <thead>
                  <tr>
                    <th className='column-heading'>No.</th>
                    <th className='column-heading'>Emails</th>
                    {/* <th className='column-heading'>IsValid</th>
                    <th className='column-heading'>IsDomainAvailable</th>
                    <th className='column-heading'>IsActive</th> */}
                  </tr>
                </thead>
                <tbody>
                  {emailsData.map((email, index) => (
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>{email.email}</td>
                      {/* <td>{email.isValid ? 'Yes' : 'No'}</td> */}
                      {/* <td>{email.isDomainAvailable ? 'Yes' : 'No'}</td> */}
                      {/* <td>{email.isActive ? 'Yes' : 'No'}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>)
          : <LoadingSpinner></LoadingSpinner>
        }
      </div>
    </div>
  );
};

export default FileHandler;
