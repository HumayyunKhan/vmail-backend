import React, { useState, useEffect } from 'react';
import './emailTable.css'
import axios from 'axios';

const EmailTable = (props) => {
  const [emails, setEmails] = useState(null);

  useEffect(() => {
    setEmails(props.emailResult)
    console.log ("emails -->> ", emails)
  }, []);

  return (
    <div className='email-table'>
      <h2 className='table-heading'>Email Table</h2>
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
          {emails.map((email, index) => (
            <tr key={index}>
              <td>{email.email}</td>
              <td>{email.isValid ? 'Yes' : 'No'}</td>
              <td>{email.isDomainAvailable ? 'Yes' : 'No'}</td>
              <td>{email.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTable;
