import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import SideNav from '../../components/side-nav'
import Footer from '../../components/footer'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';
import Kundli from '../../components/Kundli';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import AstroloyReport from '../../components/AstroloyReport';

export default function UserDetails() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [user, setUserData] = useState([]);
  const [payments, setPaymentsDetails] = useState([]);
  const [show, setShow] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [matchData, setMatchData] = useState([]);

  var accessToken = localStorage.getItem('auth_token');
  const apiConfig = {
      headers: {
        Authorization: "Bearer " + accessToken,
        'Content-Type': 'application/json',
      }
  };

  const fetchUserData = () => {
    axios.get(
      process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getUserDetails/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/getUserDetails/${id}`,
      apiConfig
    )
    .then((response) => {
      console.log("Response: ", response);
      if(response.data.success){
          setUserData(response.data.data);
          setPaymentsDetails(response.data.payment_details);
      }
    }).catch((error) => {
      if(error.response.data.status_code == 401){
        localStorage.removeItem('client_token');
        navigate('/sign-in');
      } else {
        toast.error(error.code);
      }
    });
  }

  const formatDate = (createdAt) => {
    // Check if createdAt is defined and not null
    if (createdAt) {
      const originalDate = new Date(createdAt);
      const dd = String(originalDate.getDate()).padStart(2, '0');
      const mm = String(originalDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const yy = String(originalDate.getFullYear()).slice(-2);
      const hh = String(originalDate.getHours()).padStart(2, '0');
      const ii = String(originalDate.getMinutes()).padStart(2, '0');
      const ss = String(originalDate.getSeconds()).padStart(2, '0');

      return `${dd}-${mm}-${yy} ${hh}:${ii}:${ss}`;
    }
    // If createdAt is undefined or null, return an empty string or handle accordingly
    return '';
  };

  const handleClose = () => setShow(false);
    
  const handleShow = (a_data, m_data) => {
      if(a_data) {
        setReportData(a_data);
        setMatchData(m_data);
        setShow(true);
      }
      return false;
  }
  
  useEffect(() => {
    fetchUserData();
  },[]);
  return (
    <>
      <Header/>
      <Modal size="xl" show={show} onHide={handleClose}>
          <Modal.Header>
              <Modal.Title>Astrology Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className="astrology-chart">
                <AstroloyReport astrologyData={reportData} matchData={matchData} userData={user}/>
              </div>
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
      </Modal>
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>User Details</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                  <li className="breadcrumb-item active">User Details</li>
                </ol>
              </div>
            </div>
          </div>{/* /.container-fluid */}
        </section>
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="callout callout-info">
                  <h5><b>User Name: </b>{user.first_name + ' ' + user.last_name}</h5>
                  User Registered at: {formatDate(user.created_at)}
                </div>
                {/* Main content */}
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <h3>User Information</h3>
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>First Name:</strong> {user.first_name || ''}</li>
                            <li className="list-group-item"><strong>Last Name:</strong> {user.last_name || ''}</li>
                            <li className="list-group-item"><strong>Email:</strong> {user.email || ''}</li>
                            <li className="list-group-item"><strong>Date of Birth:</strong> {user.birth_date || ''}</li>
                            <li className="list-group-item"><strong>Birth Time:</strong> {user.birth_time || ''}</li>
                            <li className="list-group-item"><strong>Birth Place:</strong> {user.birth_place || ''}</li>
                          </ul>
                        </div>
                        {user && user.kundli ?
                          <div className="col-md-8">
                            <h3>Kundli Information</h3>
                            <div className='row'>
                              <div className='col-md-4 mt-5'>
                                  <Kundli housesData={user && user.kundli_data ? user.kundli_data : []}/>
                              </div>
                              <div className='col-md-8'>
                                  <ul>
                                  {user && user.house_details ? user.house_details.map((detail, index) => (
                                      <li key={index}>{detail}</li>
                                  )) : <li></li>}
                                  </ul>
                              </div>
                            </div>
                          </div> : <></>}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <h3>Payment Details</h3>
                        <div className="table-responsive">
                          <table className="widget-table table table-striped no-border">
                              <thead>
                                  <tr>
                                      <th scope="col" className="text-12">CPJ ID</th>
                                      <th scope="col" className="text-12">Transaction ID</th>
                                      <th scope="col" className="text-12">Price</th>
                                      <th scope="col" className="text-12">Status</th>
                                      <th scope="col" className="text-12">Match</th>
                                      <th scope="col" className="text-12">Opponents</th>
                                      <th scope="col" className="text-12">Date</th>
                                      <th scope="col" className="text-12">Time</th>
                                      <th scope="col" className="text-12">Venue</th>
                                      <th scope="col" className="text-12">Pandit Name</th>
                                      <th scope="col" className="text-12">Astrology Report</th>
                                  </tr>
                              </thead>
                              <tbody>
                              {(payments && payments.length > 0) ? payments.map((payment, index) => (
                                  <tr key={index}>
                                      <td className='text-capitalize'>{payment && payment.merchant_transaction_id}</td>
                                      <td className='text-capitalize'>{(payment && payment.transaction_id) ?? 'N/A'}</td>
                                      <td className='text-capitalize'>₹ {payment && payment.amount}</td>
                                      <td className='text-capitalize'><span className='badge badge-success'>Paid</span></td>
                                      <td className='text-capitalize'>{payment && payment.match && payment.match.matchs}</td>
                                      <td>
                                          <div className="country-info text-capitalize">
                                              <span className="country-name text-13">{payment && payment.match && payment.match.team_a_short}</span>
                                              <span className="country-name text-12 mx-2">VS</span>
                                              <span className="country-name text-13">{payment && payment.match && payment.match.team_b_short}</span>
                                          </div>
                                      </td>
                                      <td>{payment && payment.match && payment.match.match_date}</td>
                                      <td>{payment && payment.match && payment.match.match_time}</td>
                                      <td>{payment && payment.match && payment.match.venue}</td>
                                      <td>Report By: <b>{payment && payment.pandit && payment.pandit.name}</b></td>
                                      <td className='text-center'>
                                          {payment && payment.match_id && payment.match_astrology_details ?
                                          <span className="cricnotch-btn btn-filled py-05 cursor-pointer" onClick={()=>handleShow(payment.match_astrology_details, payment.match)}>
                                              <i className='fa fa-eye'></i> View Report
                                          </span>
                                          : 
                                          <span>
                                              No Report
                                          </span>}
                                      </td>
                                  </tr>
                              )) : 
                              <tr>
                                  <td colSpan={10}>No Reports Yet</td>    
                              </tr>}
                              </tbody>
                          </table>
                        </div>
                        {/* /.col */}
                      </div>
                    </div>
                  </div>
                {/* /.invoice */}
              </div>{/* /.col */}
            </div>{/* /.row */}
          </div>{/* /.container-fluid */}
        </section>
        {/* /.content */}
      </div>
      <SideNav/>
      <Footer/>
    </>
  )
}
