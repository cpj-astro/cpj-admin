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

export default function ManageAds() {
    var accessToken = localStorage.getItem('auth_token');
    const { register, handleSubmit, setValue, getValues, watch, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    const [adListData, setAdListData] = useState([]);
    
    const fetchAdsList = () => {
        var accessToken = localStorage.getItem('auth_token');
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getAllPrivateAds` : `${process.env.REACT_APP_LOCAL_API_URL}/getAllPrivateAds`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setAdListData(response.data.data);
            }
        }).catch((error) => {
            toast.error("Oh Snap!" + error.code);
        });
    } 
    
    const onSubmit = async (data) => {    
        const formData = new FormData();
        formData.append("ad_type", data.ad_type);
        formData.append("category", data.category);
        formData.append("expiry_date", data.expiry_date);
        formData.append("link", data.link);
        formData.append("status", data.status);
        formData.append("title", data.title);
        
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

        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/privateAd${data.id ? '/' + data.id : ''}` : `${process.env.REACT_APP_LOCAL_API_URL}/privateAd${data.id ? '/' + data.id : ''}`, formData, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchAdsList();
                toast.success(response.data.msg);
            } else {
                fetchAdsList();
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const editAd = (id) => {
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'application/json',
            }
        };
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/privateAd/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/privateAd/${id}`, apiConfig)
        .then((response) => {
            if(response.data.success){
                let adData = response.data.data;
                if(adData.id) {
                    setValue('id', adData.id)
                } 
                setValue('ad_type', adData.ad_type); 
                setValue('category', adData.category); 
                setValue('link', adData.link); 
                setValue('title', adData.title); 
                setValue('status',adData.status); 
                setValue('expiry_date', moment(adData.expiry_date).format('YYYY-DD-MM')); 
                fetchAdsList();
            } else {
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const deleteAd = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this ad!",
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
                axios.delete(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/privateAd/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/privateAd/${id}`, apiConfig)
                .then((response) => {
                    if(response.data.success){
                        fetchAdsList();
                        toast.success(response.data.msg);
                    } else {
                        fetchAdsList();
                        toast.error(response.data.msg);
                    }
                }).catch((error) => {
                    toast.error(error.code);
                });
            }
        })
    }

    useEffect(() => {
        fetchAdsList();
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
                            <h1>Manage Ads</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Manage Ads</li>
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
                                    <label className="form-label fw-bold">Title:</label>
                                    <input className="form-control" type="text" placeholder="Enter Title" required {...register("title")} />
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Category:</label>
                                    <select className='form-control' {...register("category")} required>
                                        <option value='' key='1'>-- Select Ad Category --</option>
                                        <option value='app' key='2'>App</option>
                                        <option value='website' key='3'>Website</option>
                                        <option value='others' key='4'>Others</option>
                                    </select>
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Link:</label>
                                    <input className="form-control" type="text" placeholder="Enter Link" required {...register("link")} />
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Expiry Date:</label>
                                    <input className="form-control" type="date" required {...register("expiry_date")} />
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Type:</label>
                                    <select className='form-control' {...register("ad_type")} required>   
                                        <option value='' key="1">-- Select Ad Type --</option>
                                        <option value='image_banner' key="2">Image Banner</option>
                                        <option value='image_fullscreen' key="3">Image Fullscreen</option>
                                        <option value='video_tv' key="4">Video TV</option>
                                        <option value='image_tv' key="5">Image TV</option>
                                        <option value='dashboard_silder' key="6">Dashboard Silder</option>
                                        <option value='image_listing' key="7">Image Listing</option>
                                        <option value='video_native' key="8">Video Native</option>
                                        <option value='others' key="9">Others</option>
                                    </select>
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Select Image/Video:</label>
                                    <input className="form-control" type="file" {...register("file")} />
                                </div>
                                <div className='col-md-3'>
                                    <label className="form-label fw-bold">Status:</label>
                                    <select className='form-control' {...register("status")} required>   
                                        <option value={0} key='1'>In Active</option>
                                        <option value={1} key='2'>Active</option>
                                    </select>
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
                                <h2>Ads List</h2>
                                <hr/>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Type</th>
                                            <th>Link</th>
                                            <th>Added At</th>
                                            <th>Expiry Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {(adListData && adListData.length > 0) ? adListData.map((ad, index) => (
                                        <tr>
                                            <td>
                                                <a href={ad.media_file} target='_blank'>
                                                    <span className="btn btn-secondary btn-sm ms-2 text-white" title="View">
                                                        <FiEye/>
                                                    </span>
                                                </a>
                                            </td>
                                            <td>{ad.title ?? 'N/A'}</td>
                                            <td>{ad.category ?? 'N/A'}</td>
                                            <td>{ad.ad_type ?? 'N/A'}</td>
                                            <td>{ad.link ?? 'N/A'}</td>
                                            <td>{moment(ad.created_at).format('MMM Do YY') ?? 'N/A'}</td>
                                            <td>{moment(ad.expiry_date).format('MMM Do YY') ?? 'N/A'}</td>
                                            <td>{ad.status === 1 ? 'Active' : 'In-Active' }</td>
                                            <td width="100"> 
                                                <button className="btn btn-info btn-sm ms-2 text-white" title="View" type="button" onClick={() => {editAd(ad.id)}}>
                                                    <FiEdit2/>
                                                </button>
                                                <button className="btn btn-danger btn-sm ms-2" title="View" type="button" onClick={() => {deleteAd(ad.id)}}>
                                                    <FiTrash2/>
                                                </button>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={9} className='text-center'>
                                                No Ads
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
