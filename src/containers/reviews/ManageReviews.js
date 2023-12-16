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

export default function ManageReviews() {
    var accessToken = localStorage.getItem('auth_token');
    const { register, handleSubmit, setValue, getValues, watch, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    const [reviewsData, setReviewsData] = useState([]);
    
    const fetchReviewsList = () => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getAllReviews` : `${process.env.REACT_APP_LOCAL_API_URL}/getAllReviews`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setReviewsData(response.data.data);
            }
        }).catch((error) => {
            toast.error("Oh Snap!" + error.code);
        });
    } 
    
    const onSubmit = async (data) => {    
        const formData = new FormData();
        formData.append("user_name", data.user_name);
        formData.append("user_img", data.user_img);
        formData.append("review", data.review);
        formData.append("rating", data.rating);
        formData.append("status", data.status);
        
        if(data.file && data.file[0]){
            formData.append("file", data.file[0]);
            let fileSizeMB = data.file[0].size / (1024 ** 2)
            if(fileSizeMB > 10) {
                return toast.error('Select File Less than 10 MB');
            } 
        }
        
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'multipart/form-data',
            }
        };

        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/review${data.id ? '/' + data.id : ''}` : `${process.env.REACT_APP_LOCAL_API_URL}/review${data.id ? '/' + data.id : ''}`, formData, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchReviewsList();
                toast.success(response.data.msg);
            } else {
                fetchReviewsList();
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const editReview = (id) => {
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/review/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/review/${id}`, apiConfig)
        .then((response) => {
            if(response.data.success){
                let reviewData = response.data.data;
                if(reviewData.id) {
                    setValue('id', reviewData.id)
                } 
                setValue('user_name', reviewData.user_name); 
                setValue('user_img', reviewData.user_img); 
                setValue('review', reviewData.review); 
                setValue('rating', reviewData.rating); 
                setValue('status',reviewData.status); 
                fetchReviewsList();
            } else {
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const deleteReview = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this review!",
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
                axios.delete(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/review/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/review/${id}`, apiConfig)
                .then((response) => {
                    if(response.data.success){
                        fetchReviewsList();
                        toast.success(response.data.msg);
                    } else {
                        fetchReviewsList();
                        toast.error(response.data.msg);
                    }
                }).catch((error) => {
                    toast.error(error.code);
                });
            }
        })
    }

    useEffect(() => {
        fetchReviewsList();
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
                            <h1>Manage Reviews</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Manage Reviews</li>
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
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">User Name:</label>
                                    <input className="form-control" type="text" placeholder="Enter User Name" required {...register("user_name")} />
                                </div>
                                <div className='col-md-6'>
                                    <label className="form-label fw-bold">Review:</label>
                                    <textarea className='form-control' placeholder="Enter Review" required {...register("review")}></textarea>
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Status:</label>
                                    <select className='form-control' {...register("status")} required>   
                                        <option value={0} key='1'>In Active</option>
                                        <option value={1} key='2'>Active</option>
                                    </select>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Rating:</label>
                                    <select className='form-control' {...register("rating")} required>   
                                        <option value='' key="1">-- Select Rating --</option>
                                        <option value={5} key="2">5</option>
                                        <option value={4} key="3">4</option>
                                        <option value={3} key="4">3</option>
                                        <option value={2} key="5">2</option>
                                        <option value={1} key="6">1</option>
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <label className="form-label fw-bold">User Image/Video:</label>
                                    <input className="form-control" type="file" {...register("file")} />
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Actions:</label>
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
                                <h2>Reviews List</h2>
                                <hr/>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>User Image</th>
                                            <th>User Name</th>
                                            <th>Review</th>
                                            <th>Rating</th>
                                            <th>Review Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {(reviewsData && reviewsData.length > 0) ? reviewsData.map((rd, index) => (
                                        <tr>
                                            <td>
                                                {rd.user_img ?
                                                    <a href={rd.user_img} target='_blank'>
                                                        <span className="btn btn-secondary btn-sm ms-2 text-white" title="View">
                                                            <FiEye/>
                                                        </span>
                                                    </a>
                                                :
                                                'No Image'
                                                }
                                            </td>
                                            <td>{rd.user_name ?? 'N/A'}</td>
                                            <td>{rd.review ?? 'N/A'}</td>
                                            <td>{rd.rating ?? 'N/A'}</td>
                                            <td>{moment(rd.created_at).format('MMM Do YY') ?? 'N/A'}</td>
                                            <td>{rd.status === 1 ? 'Active' : 'In-Active' }</td>
                                            <td width="100"> 
                                                <button className="btn btn-info btn-sm ms-2 text-white" title="View" type="button" onClick={() => {editReview(rd.id)}}>
                                                    <FiEdit2/>
                                                </button>
                                                <button className="btn btn-danger btn-sm ms-2" title="View" type="button" onClick={() => {deleteReview(rd.id)}}>
                                                    <FiTrash2/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={7} className='text-center'>
                                                No Reviews
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
