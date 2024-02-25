import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function PanditsList() {
    const [pandits, setPandits] = useState([]);
    const navigate = useNavigate();
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    const fetchPanditsData = () => {
        try {
            axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/pandits/getAllPandits` : `${process.env.REACT_APP_LOCAL_API_URL}/pandits/getAllPandits`, apiConfig)
            .then((response) => {
                console.log('response', response);
                if(response.data.success){
                    setPandits(response.data.pandits);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
        } catch (error) {
            toast.error(error);
        }
    }

    const deletePandit = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this pandit!",
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
                axios.delete(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/pandits/delete/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/pandits/delete/${id}`, apiConfig)
                .then((response) => {
                    if(response.data.success){
                        fetchPanditsData();
                        toast.success("Pandit Deleted Successfully");
                    } else {
                        fetchPanditsData();
                        toast.error("Invalid Request");
                    }
                }).catch((error) => {
                    toast.error(error.code);
                });
            }
        })
    }

    useEffect(() => {
        fetchPanditsData();
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
                        <h1>Pandits</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="float-sm-right">
                                <span className='btn btn-primary' onClick={()=>navigate(`/add-pandit`)}>Add Pandit</span>
                            </div>
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
                            <h3 className="card-title">Pandits List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <table id="example4" className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Avatar Image</th>
                                        <th>Name</th>
                                        <th>Experience</th>
                                        <th>Rating</th>
                                        <th>Match Astrology Price</th>
                                        <th>Description</th>
                                        <th className="text-center" style={{width: '100px'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(pandits && pandits.length > 0) ? pandits.map((pandit, index) => (
                                        <tr>
                                            <td> {index+1} </td>
                                            <td> {pandit.avatar_image ? pandit.avatar_image : 'N/A'} </td>
                                            <td> {pandit.name ? pandit.name : 'N/A'} </td>
                                            <td> {pandit.experience ? pandit.experience + ' Years' : 'N/A'} </td>
                                            <td> {pandit.rating ? pandit.rating : 'N/A'} </td>
                                            <td> {pandit.match_astrology_price ? pandit.match_astrology_price : 'N/A'} </td>
                                            <td> {pandit.description ? pandit.description : 'N/A'} </td>
                                            <td className='text-center' style={{width: '100px'}}> 
                                                <Link to={`/edit-pandit/${pandit.id}`} title="Edit" type="button" className='mr-2'>
                                                    <i class="fa fa-edit"></i>
                                                </Link>
                                                |
                                                <span onClick={() => {deletePandit(pandit.id)}} title="Delete" type="button" className='ml-2 text-danger'>
                                                    <i class="fa fa-trash"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={7}>
                                                No Recent Matches
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Avatar Image</th>
                                        <th>Name</th>
                                        <th>Experience</th>
                                        <th>Rating</th>
                                        <th>Match Astrology Price</th>
                                        <th>Description</th>
                                        <th className="text-center" style={{width: '100px'}}>Action</th>
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
