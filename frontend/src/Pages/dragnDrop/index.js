import React, { useEffect, useState } from 'react';
import './dragndrop.css';

import EmailTable from '../../Components/EmailTable'
import axios from 'axios';
import { LoadingSpinner } from '../../Components/LoadingSpinner';
import SingleEmail from '../../Components/SingleEmail';
import BulkEmail from '../../Components/BulkEmail';

const FileHandler = () => {

  const [consoleText, setConsoleText] = useState('');

  const [isLoading, setIsLoading] = useState(false)

  const [emailResult, setEmailResult] = useState(null);

  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (index) => {
    setCurrentTab(index);
  };

  const tabs = [
    { title: 'Validate Single Email', content: <SingleEmail></SingleEmail> },
    { title: 'Validate Bulk Emails', content: <BulkEmail></BulkEmail> },
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
          emailResult && (
            <div className='email-table'>
              <h2 className='table-heading'>Validation Result</h2>
              <table>
                <thead>
                  <tr>
                    <th className='column-heading'>Email</th>
                    <th className='column-heading'>IsValid</th>
                    <th className='column-heading'>IsDomainAvailable</th>
                    <th className='column-heading'>IsActive</th>
                  </tr>
                </thead>
                <tbody>
                  {emailResult.map((email, index) => (
                    <tr key={index}>
                      <td>{email.email}</td>
                      <td>{email.isValid ? 'Yes' : 'No'}</td>
                      <td>{email.isDomainAvailable ? 'Yes' : 'No'}</td>
                      <td>{email.isActive ? 'Yes' : 'No'}</td>
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
