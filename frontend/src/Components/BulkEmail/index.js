import React, { useState } from 'react'
import './bulkEmail.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

const BulkEmail = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);


    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(files);
    };

    // const appendToConsole = (text) => {
    //     setConsoleText((prevText) => prevText + '\n' + text);
    // };

    const handleCancelUpload = (file) => {
        const updatedFiles = selectedFiles.filter((f) => f !== file);
        setSelectedFiles(updatedFiles);
    };


    return (
        <>
            <div className='title-container'>
                <h2 className='title'>Validate Bulk Emails</h2>
            </div>
            <div className="bulk-email-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                <p>Upload CSV file here</p>
                <input type="file" multiple onChange={handleFileSelect} />
                <button
                    onClick={() => {
                        document.querySelector('input[type="file"]').click();
                    }}
                >
                    <span>
                        <FontAwesomeIcon icon={faFileUpload} /> Select Files
                    </span>
                </button>
                <div className='files-list-container'>
                    {selectedFiles.map((file, index) => (
                        <li key={index} className='files-list-items'>
                            <p className='file-name'>{file.name}</p>
                            <button onClick={() => handleCancelUpload(file)}>Cancel</button>
                        </li>
                    ))}
                </div>
            </div>
            <div className='btn-container'>
                <button>Validate Emails</button>
            </div>
        </>
    )
}

export default BulkEmail