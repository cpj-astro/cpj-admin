import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import { FiEdit2, FiTrash2 , FiEye} from 'react-icons/fi';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import Footer from '../../components/footer';
import SideNav from '../../components/side-nav';
import Header from '../../components/header';
import { toast } from 'react-toastify';

export default function ManageGameJob() {
    var accessToken = localStorage.getItem('auth_token');
    const { register, handleSubmit, setValue, getValues, watch, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    const [gameJobs, setGameJobs] = useState([]);
    
    const fetchGameJobList = () => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getAllGameJobs` : `${process.env.REACT_APP_LOCAL_API_URL}/getAllGameJobs`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setGameJobs(response.data.data);
            }
        }).catch((error) => {
            toast.error("Oh Snap!" + error.code);
        });
    } 
    
    const onSubmit = async (data) => {    
        const formData = new FormData();
        formData.append("game_link", data.game_link);
        formData.append("status", data.status);
        
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'multipart/form-data',
            }
        };

        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/gameJob${data.id ? '/' + data.id : ''}` : `${process.env.REACT_APP_LOCAL_API_URL}/gameJob${data.id ? '/' + data.id : ''}`, formData, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchGameJobList();
                toast.success(response.data.msg);
            } else {
                fetchGameJobList();
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const editGameJob = (id) => {
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/gameJob/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/gameJob/${id}`, apiConfig)
        .then((response) => {
            if(response.data.success){
                let gameJobData = response.data.data;
                if(gameJobData.id) {
                    setValue('id', gameJobData.id)
                } 
                setValue('game_link', gameJobData.game_link); 
                setValue('status',gameJobData.status); 
                fetchGameJobList();
            } else {
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const deleteGameJob = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this game job!",
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
                axios.delete(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/gameJob/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/gameJob/${id}`, apiConfig)
                .then((response) => {
                    if(response.data.success){
                        fetchGameJobList();
                        toast.success(response.data.msg);
                    } else {
                        fetchGameJobList();
                        toast.error(response.data.msg);
                    }
                }).catch((error) => {
                    toast.error(error.code);
                });
            }
        })
    }

    useEffect(() => {
        fetchGameJobList();
    }, [])

    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset();
        }
    }, [formState, reset]);
    return (
        <>
            <Header/>
            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Manage GameZop</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>GameZop</a></li>
                            <li className="breadcrumb-item active">Manage GameZop</li>
                            </ol>
                        </div>
                        </div>
                    </div>
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="hidden" {...register("id")} value={null}/>    
                
                        <div className='row'>
                                <div className='col-md-8'>
                                    <label className="form-label fw-bold">Game Link:</label>
                                    <input className="form-control" type="text" placeholder="Enter User Name" required {...register("game_link")} />
                                </div>
                                <div className='col-md-4'>
                                    <label className="form-label fw-bold">Status:</label>
                                    <select className='form-control' {...register("status")} required>   
                                        <option value={0} key='1'>In Active</option>
                                        <option value={1} key='2'>Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col-md-3'>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <input type="reset" value="CLEAR" className='btn btn-secondary w-100'/>
                                        </div>
                                        <div className='col-md-6'>
                                            <input type="submit" value="SUBMIT" className='btn btn-primary w-100'/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className='row'>
                            <div className='col-md-12'>
                                <hr/>
                                <h2>GameZop List</h2>
                                <hr/>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Game Link</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {(gameJobs && gameJobs.length > 0) ? gameJobs.map((rd, index) => (
                                        <tr>
                                            <td>{rd.game_link ?? 'N/A'}</td>
                                            <td>{rd.status === 1 ? 'Active' : 'In-Active' }</td>
                                            <td width="100"> 
                                                <button className="btn btn-info btn-sm ms-2 text-white" title="View" type="button" onClick={() => {editGameJob(rd.id)}}>
                                                    <FiEdit2/>
                                                </button>
                                                <button className="btn btn-danger btn-sm ms-2" title="View" type="button" onClick={() => {deleteGameJob(rd.id)}}>
                                                    <FiTrash2/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={7} className='text-center'>
                                                No GameJobs
                                            </td>
                                        </tr>
                                    }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <SideNav/>
            <Footer/>
        </>
    )
}
