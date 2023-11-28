import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import PlanetaryHouses from '../../components/PlanetaryHouses';
import { Button } from 'react-bootstrap';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import Kundli from '../../components/Kundli';

export default function Users() {
    const [usersData, setUsersData] = useState([]);
    const [show, setShow] = useState(false);
    const [planetaryData, setPlanetaryData] = useState([]);

    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    const fetchUsers = () => {
        try {
            axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/users` : `${process.env.REACT_APP_LOCAL_API_URL}/users`, apiConfig)
            .then((response) => {
                if(response.data.success){
                    console.log(response.data.data);
                    setUsersData(response.data.data);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
        } catch (error) {
            console.log(error);   
        }
    }
    
    const handleClose = () => setShow(false);
    
    const handleShow = (data) => {
        if(data.length > 0) {
            setPlanetaryData(data);
            setShow(true);
        }
        return false;
    }
    
    useEffect(() => {
        fetchUsers();
    },[]);
    return (
        <>
            <Header/>
            <div className="content-wrapper">
                <Modal size="lg" show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Kundli Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="astrology-chart">
                            <Kundli housesData={planetaryData}/>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Users List</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Users List</li>
                        </ol>
                        </div>
                    </div>
                    </div>{/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                        {/* /.card */}
                        <div className="card">
                            <div className="card-header">
                            <h3 className="card-title">Series List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                                <table id="example7" className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Sr. No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Birth Date-Time</th>
                                            <th>Birth Place</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                            <th>Kundli</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {(usersData && usersData.length > 0) ? usersData.map((user, index) => (
                                        <tr>
                                            <td> {index+1} </td>
                                            <td> {(user.first_name || user.last_name) ? user.first_name + ' ' + user.last_name : 'N/A'} </td>
                                            <td> {user.email ? user.email : 'N/A'} </td>
                                            <td> {(user.birth_date || user.birth_time) ? user.birth_date + ' | ' + user.birth_time : 'N/A'} </td>
                                            <td> {user.birth_place ? user.birth_place : 'N/A'} </td>
                                            <td> {user.latitude ? user.latitude : 'N/A'} </td>
                                            <td> {user.longitude ? user.longitude : 'N/A'} </td>
                                            <td> 
                                                {user && user.kundli_data.length > 0 ? (
                                                <span onClick={()=>handleShow(user.kundli_data)}>
                                                    <span className='badge badge-primary w-100 cursor-pointer'><i class="fa fa-eye"></i></span>
                                                </span>) : 'No Data'}
                                            </td>
                                            <td> {user.status == 1 ? <span className='badge badge-success w-100'>Active</span> : <span className='badge badge-danger w-100'>In-Active</span>} </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={9}>
                                                No Users Found
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Birth Date-Time</th>
                                        <th>Birth Place</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Kundli</th>
                                        <th>Status</th>
                                    </tr>
                                </tfoot>
                            </table>
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                    </div>
                    {/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            <SideNav/>
            <Footer/>
        </>
    )
}
