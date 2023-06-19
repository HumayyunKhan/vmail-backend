import React, { useEffect, useState } from 'react'
import './adminPanel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faHouse, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [port, setPort] = useState(Number);
    const [domain, setDomain] = useState('');

    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isUpdate, setIsUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(Number);
     // const url='localhost:3000'
  const url='185.215.165.189'


    useEffect(() => {
        fetchAccounts();


    }, []);


    const fetchAccounts = async () => {
        try {
            const response = await fetch(`http://${url}/admin/getAccounts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAccounts(data.data);
                setIsLoading(false);
            } else {
                console.log('API call failed');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setIsLoading(false);
        }
    };

    const renderAddModal = () => {
        setEmail('');
        setPassword('');
        setPort(null);
        setDomain('')

        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        console.log("Dialog Closed")
        setIsModalOpen(false);
    }

    const openUpdateModal = (id, email) => {
        
        setIsUpdate(true);
        setUpdateId(id);

        setEmail(email);
        setPassword('');
        setPort(null);
        setDomain('');
        
        setIsModalOpen(true);
    }

    const closeUpdateModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setIsUpdate(false);
        }, 500);
        setEmail('');
    }

    const onAddAccount = async () => {

        if(email === '' || password === '' || port === null || domain === '')
        {
            alert("Please enter all the fields");
            return;
        }

        try {
            const response = await fetch(`http://${url}/admin/registerAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({
                    email: email,
                    password: password,  
                    port: port,
                    domain: domain
                }),
            });

            console.log(JSON.stringify({
                email: email,
                password: password,
                port: port,
                domain: domain
            }));

            if (response.ok) {
                const json = await response.json();
                // Process the response data
                console.log(json);
                alert("Record Added Successfully");
                handleCloseModal();
                fetchAccounts();
            } else {
                alert("Failed to Add Account");
                // throw new Error('Failed to Add Account');
            }
        } catch (error) {
            console.error(error);
            alert("Error: ", error);
        }

    }

    const handleDelete = async (id) => {
        console.log("Account id: " + id)
        try {
            const response = await fetch(`http://${url}/admin/deleteAccount/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Record deleted successfully');
                alert("Record Deleted Succesfully");
                fetchAccounts();
            } else {
                console.log('Record deletion failed');
                alert("Record Deletion Failed")
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred:', error)
        }
    }

    const handleUpdate = async (id) => {
        console.log("Update Account id: " + id)
        if(email === '' || password === '' || port === null || domain === '')
        {
            alert("Please enter all the fields");
            return;
        }

        try {
            const response = await fetch(`http://${url}/admin/updateAccount/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    port: port,
                    domain: domain
                })
            });

            if (response.ok) {
                console.log('Record Update successfully');
                alert("Record Updated Successfully");
                closeUpdateModal();
                fetchAccounts();
            } else {
                console.log('Record Updation failed');
                alert('Record Updation Failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred:', error);
        }
    }

    return (
        <>
            <div className='container'>
                <div className='crud-buttons'>
                    <div className='title-container'>
                        <h3 className='title m-0'>Admin Panel</h3>
                        <button className='btn add-button' onClick={()=> {navigate('/')}}>
                            <FontAwesomeIcon icon={faHouse} style={{ color: "#ffffff", }} /> Homepage
                        </button>
                        {/* <button></button> */}
                        {/* <button></button> */}
                    </div>
                </div>

                {/* <!-- Modal --> */}
                <Modal show={isModalOpen}>
                    <Modal.Header closeButton onClick={isUpdate ? closeUpdateModal : handleCloseModal}>
                        <Modal.Title>{isUpdate ? "Update Account" : "Add Account"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='row'>
                            <div className='input-container'>
                                <label>Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='input-container'>
                                <label>Password</label>
                                <input type="password" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-container'>
                                <label>Port</label>
                                <input type="number" onChange={(e) => setPort(e.target.value)} />
                            </div>
                            <div className='input-container'>
                                <label>Domain</label>
                                <input type="text" onChange={(e) => setDomain(e.target.value)} />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={isUpdate ? () => handleUpdate(updateId) : onAddAccount}>{isUpdate ? "Update Account" : "Add Account"}</Button>
                    </Modal.Footer>
                </Modal>

                <div className='accounts-list-container'>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div className='title-container'>
                                <h3 className='m-0'>Accounts</h3>
                                <button className='btn add-button' onClick={renderAddModal}>
                                    <FontAwesomeIcon icon={faCirclePlus} style={{ color: "#ffffff", }} /> Add TestAccount
                                </button>
                            </div>
                            <div className='header-container'>
                                <div className='header'>
                                    <p style={{ width: '37%' }}>Emails</p>
                                    <p style={{ width: '10.2%' }}>Port</p>
                                    <p style={{ width: '26.7%' }}>Created At</p>
                                    <p style={{ width: '21%' }}>Updated At</p>
                                </div>
                            </div>

                            {accounts.length > 0 ? (
                                <div>
                                    {accounts.map((account) => (
                                        <div className='account-container'>
                                            <div className='account' key={account.id}>
                                                <p style={{ width: '30%' }}>{account.email}</p>
                                                <p style={{ width: '7%' }}>{account.port}</p>
                                                <p style={{ width: '21%' }}>{account.createdAt}</p>
                                                <p style={{ width: '21%' }}>{account.updatedAt}</p>
                                                <button className='btn update-button' onClick={() => openUpdateModal(account.id , account.email)}>
                                                    <FontAwesomeIcon icon={faPen} style={{ color: "#363636", }} /> Edit
                                                </button>
                                                <button className='btn delete-button' onClick={() => handleDelete(account.id)}>
                                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff", }} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No accounts found.</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminPanel