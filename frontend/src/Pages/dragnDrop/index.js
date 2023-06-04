import React, { useEffect, useState } from 'react';
import './dragndrop.css';

import { LoadingSpinner } from '../../Components/LoadingSpinner';
import SingleEmail from '../../Components/SingleEmail';
import BulkEmail from '../../Components/BulkEmail';
import ValidationStatus from '../../Components/ValidationStatus';
import AllBatchIDs from '../../Components/AllBatchIDs';
import EmailsResult from '../../Components/EmailsResult';

const FileHandler = () => {

  const [consoleText, setConsoleText] = useState('');

  const [isLoading, setIsLoading] = useState(false)

  const [emailsData, setEmailsData] = useState(null);
  const [discardedEmails, setDiscardedEmails] = useState(null)

  const [allBatchIDs, setAllBatchIDs] = useState(null)

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

  const getDiscardedEmails = async (batchId) => {
    try {
      const response = await fetch('http://localhost:3000/validate/getDiscardedMails', {
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

        console.log("Discarded Emails: " + json.data);
        return json.data;

      } else {
        throw new Error('emailResult error');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const emailResult = async (batchId) => {
    if (await statusCheck(batchId) === "PENDING") {
      return "PENDING";
    } 

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

        setDiscardedEmails(await getDiscardedEmails(batchId))
        setEmailsData(json.data)
        // setDiscardedEmails()
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

        return json.data.batchId

      } else {
        throw new Error('Failed to upload CSV');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllBatchIds = async () => {
    fetch('http://localhost:3000/validate/getBatches')
      .then(response => response.json())
      .then(json => {
        // Process the data received from the API
        setAllBatchIDs(json.data)
        console.log(json);
      })
      .catch(error => {
        // Handle any errors that occurred during the API request
        console.error('Error:', error);
      });


  }

  const tabs = [
    { title: 'Validate Bulk Emails', content: <BulkEmail validateEmails={validateEmails}></BulkEmail> },
    { title: 'Check Validation Status', content: <ValidationStatus statusCheck={statusCheck}></ValidationStatus> },
    { title: 'Emails Result', content: <EmailsResult emailResult={emailResult}></EmailsResult> },
    { title: 'Get All Batch IDs', content: <AllBatchIDs getAllBatchIds={getAllBatchIds}></AllBatchIDs> },
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
        {currentTab === 2 ?
          // <EmailTable
          //   emailResult={emailResult}
          // ></EmailTable> 
          (emailsData || discardedEmails) && (
            <div className='email-table'>
              <h2 className='table-heading'>Validation Result</h2>
              <table>
                <thead>
                  <tr>
                    <th className='column-heading'>No.</th>
                    <th className='column-heading'>Emails</th>
                    {discardedEmails.length !== 0 && discardedEmails !== null ? <th className='column-heading'>Discarded Emails</th>: null}
                    {/* <th className='column-heading'>IsValid</th>
                    <th className='column-heading'>IsDomainAvailable</th>
                    <th className='column-heading'>IsActive</th> */}
                  </tr>
                </thead>
                <tbody>
                  {emailsData.length >= discardedEmails.length ? 
                  (emailsData.length > 0 ? emailsData.map((email, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{email.email}</td>
                      {discardedEmails.length > index && discardedEmails !== null ? <td>{discardedEmails[index].email}</td> : null}
                      {/* <td>{email.isValid ? 'Yes' : 'No'}</td> */}
                      {/* <td>{email.isDomainAvailable ? 'Yes' : 'No'}</td> */}
                      {/* <td>{email.isActive ? 'Yes' : 'No'}</td> */}
                    </tr>
                  )) : null )
                    : 
                    discardedEmails.length > 0 ? discardedEmails.map((email, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {emailsData.length > index && emailsData !== null ? <td>{email.email}</td> : null}
                        <td>{discardedEmails[index].email}</td>
                        {/* <td>{email.isValid ? 'Yes' : 'No'}</td> */}
                        {/* <td>{email.isDomainAvailable ? 'Yes' : 'No'}</td> */}
                        {/* <td>{email.isActive ? 'Yes' : 'No'}</td> */}
                      </tr>
                    )) : null
                }
                </tbody>
              </table>
            </div>)
          : currentTab === 3 ?
            allBatchIDs && (
              <div className='email-table'>
                <h2 className='table-heading'>All Batch IDs</h2>
                <table>
                  <thead>
                    <tr>
                      <th className='column-heading'>No.</th>
                      <th className='column-heading'>Batch IDs</th>
                      <th className='column-heading'>Status</th>
                      {/* <th className='column-heading'>IsValid</th>
                    <th className='column-heading'>IsDomainAvailable</th>
                    <th className='column-heading'>IsActive</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {allBatchIDs.map((batchId, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{batchId.batchId}</td>
                        <td className={batchId.status === 'PENDING' ? 'pending' : 'finalized'}>{batchId.status}</td>
                        {/* <td>{email.isValid ? 'Yes' : 'No'}</td> */}
                        {/* <td>{email.isDomainAvailable ? 'Yes' : 'No'}</td> */}
                        {/* <td>{email.isActive ? 'Yes' : 'No'}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null
        }
      </div>
    </div>
  );
};

export default FileHandler;
