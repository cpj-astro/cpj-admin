import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import {
    useNavigate,
    useParams
} from 'react-router-dom'
import axios from 'axios';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function EditFaq() {
    const {id} = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, getValues, watch, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);    
        formData.append("value", data.value);    
        formData.append("status", data.status);          

        axios.put(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/faqs/update/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/faqs/update/${id}`, 
            formData , 
            apiConfig
        ).then((response) => {
            if(response.data.success){
                toast.success("FAQ Updated Successfully");
                navigate('/faqs-list');
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error);
        });
    }

    const fetchFaqDetails = () => {
        axios.get(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/faqs/getFaqById/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/faqs/getFaqById/${id}`,
            apiConfig
        ).then((response) => {
            if(response.data.success){
                setValue('title', response.data.data.title)
                setValue('value', response.data.data.value)
                setValue('status', response.data.data.status)
            }
        }).catch((error) => {
            toast.error(error);
        });
    } 

    useEffect(() => {
        fetchFaqDetails();
    }, []);
    return (
        <>
            <Header/>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Add FAQ</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="float-sm-right">
                                <span className='btn btn-primary' onClick={()=>navigate(`/faqs-list`)}>View FAQs</span>
                            </div>
                        </div>
                    </div>
                    </div>{/* /.container-fluid */}
                </section>
                {/* Main content */}
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            {/* left column */}
                            <div className="col-md-12">
                                {/* general form elements */}
                                <div className="card card-secondary">
                                    <div className="card-header">
                                        <h3 className="card-title">Add FAQ Form</h3>
                                    </div>
                                    {/* /.card-header */}
                                    {/* form start */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="title">FAQ Title</label>
                                                        <input type="text" className="form-control" id="title" placeholder="FAQ Title" {...register("title")}/>
                                                    </div>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label className="form-label fw-bold">Status:</label>
                                                    <select className='form-control' {...register("status")} required>   
                                                        <option value={0} key='1'>In Active</option>
                                                        <option value={1} key='2'>Active</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="value">Value</label>
                                                        <textarea className="form-control" {...register("value")}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /.card-body */}
                                        <div className="card-footer">
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <input type="reset" value="CLEAR" className='btn btn-secondary w-100'/>
                                                </div>
                                                <div className='col-md-6'>
                                                    <input type="submit" value="SUBMIT" className='btn btn-primary w-100'/>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
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
