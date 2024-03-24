import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2 , FiEye} from 'react-icons/fi';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import Footer from '../../components/footer';
import SideNav from '../../components/side-nav';
import Header from '../../components/header';
import { toast } from 'react-toastify';

export default function FaqList() {
    const [faqs, setFaqs] = useState([]);
    const navigate = useNavigate();
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    const fetchFAQsData = () => {
        try {
            axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/faqs/getAllFaq` : `${process.env.REACT_APP_LOCAL_API_URL}/faqs/getAllFaq`, apiConfig)
            .then((response) => {
                console.log('response', response);
                if(response.data.success){
                    setFaqs(response.data.faqs);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
        } catch (error) {
            toast.error(error);
        }
    }

    const deleteFaq = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this faq!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((isConfirm) => {
            if(isConfirm){
                const apiConfig = {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        'Content-Type': 'application/json',
                    }
                };
                axios.delete(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/faqs/delete/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/faqs/delete/${id}`, apiConfig)
                .then((response) => {
                    if(response.data.success){
                        fetchFAQsData();
                        toast.success("Faq Deleted Successfully");
                    } else {
                        fetchFAQsData();
                        toast.error("Invalid Request");
                    }
                }).catch((error) => {
                    toast.error(error.code);
                });
            }
        })
    }

    useEffect(() => {
        fetchFAQsData();
    },[])  
    return (
        <>
            <Header/>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                            <h1></h1>
                            </div>
                            <div className="col-sm-6">
                                <div className="float-sm-right">
                                    <span className='btn btn-primary' onClick={()=>navigate(`/add-faq`)}>Add Faq</span>
                                </div>
                            </div>
                        </div>
                    </div>{/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <div className='row'>
                            <div className='col-md-12'>
                                <h2>Faqs List</h2>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Value</th>
                                            <th>Created At</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {(faqs && faqs.length > 0) ? faqs.map((f, index) => (
                                        <tr>
                                            <td>{f.title ?? 'N/A'}</td>
                                            <td>{f.value ?? 'N/A'}</td>
                                            <td>{moment(f.created_at).format('MMM Do YY') ?? 'N/A'}</td>
                                            <td>{f.status === 1 ? 'Active' : 'In-Active' }</td>
                                            <td width="100"> 
                                                <Link to={`/edit-faq/${f.id}`} title="Edit" type="button" className='mr-2'>
                                                    <i class="fa fa-edit"></i>
                                                </Link>
                                                <button className="btn btn-danger btn-sm ms-2" title="View" type="button" onClick={() => {deleteFaq(f.id)}}>
                                                    <FiTrash2/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={5} className='text-center'>
                                                No Faqs
                                            </td>
                                        </tr>
                                    }
                                    </tbody>
                                </Table>
                            </div>
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
