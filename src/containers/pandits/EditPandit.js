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

export default function EditPandit() {
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
        formData.append("name", data.name);    
        formData.append("experience", data.experience);    
        formData.append("rating", data.rating);    
        formData.append("match_astrology_price", data.match_astrology_price);    
        formData.append("description", data.description);    
        
        if(data.avatar_image && data.avatar_image[0]){
            formData.append("avatar_image", data.avatar_image[0]);
            let fileSizeMB = data.avatar_image[0].size / (1024 ** 2)
            if(fileSizeMB > 10) {
                return toast.error("Select File Less than 10 MB");
            } 
        }    

        axios.put(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/pandits/update/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/pandits/update/${id}`, 
            formData , 
            apiConfig
        ).then((response) => {
            if(response.data.success){
                toast.success("Pandit Updated Successfully");
                navigate('/pandits-list');
            }
        }).catch((error) => {
            console.log(error);
            toast.error(error);
        });
    }

    const fetchPanditDetails = () => {
        axios.get(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/pandits/getPanditById` : `${process.env.REACT_APP_LOCAL_API_URL}/pandits/getPanditById/${id}`,
            apiConfig
        ).then((response) => {
            if(response.data.success){
                setValue('name', response.data.data.name)
                setValue('experience', response.data.data.experience)
                setValue('rating', response.data.data.rating)
                setValue('match_astrology_price', response.data.data.match_astrology_price)
                setValue('description', response.data.data.description)
            }
        }).catch((error) => {
            toast.error(error);
        });
    } 

    useEffect(() => {
        fetchPanditDetails();
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
                        <h1>Edit Pandit</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="float-sm-right">
                                <span className='btn btn-primary' onClick={()=>navigate(`/pandits-list`)}>View Pandits</span>
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
                                        <h3 className="card-title">Edit Pandit Form</h3>
                                    </div>
                                    {/* /.card-header */}
                                    {/* form start */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="name">Pandit Name</label>
                                                        <input type="text" className="form-control" id="name" placeholder="Pandit Name" {...register("name")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="experience">Experience</label>
                                                        <input type="text" className="form-control" id="experience" placeholder="Experience" {...register("experience")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="rating">Rating</label>
                                                        <input type="text" className="form-control" id="rating" placeholder="Rating" {...register("rating")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="match_astrology_price">Match Astrology Price</label>
                                                        <input type="text" className="form-control" id="match_astrology_price" placeholder="Match Astrology Price" {...register("match_astrology_price")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Avatar Image</label>
                                                        <div className="input-group">
                                                            <div className="custom-file">
                                                                <input type="file" className="custom-file-input" {...register("avatar_image")}/>
                                                                <label className="custom-file-label" for="avatar_image">Choose file</label>
                                                            </div>
                                                            <div className="input-group-append">
                                                                <span className="input-group-text">Upload</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label htmlFor="description">Description</label>
                                                        <textarea className="form-control" {...register("description")}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /.card-body */}
                                        <div className="card-footer">
                                            <input type="submit" value="SUBMIT" className='btn btn-primary w-100'/>
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
