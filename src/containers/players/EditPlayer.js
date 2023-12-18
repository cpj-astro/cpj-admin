import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import {
    useNavigate,
    useParams
} from 'react-router-dom'
import axios from 'axios';
import LocationSearch from '../../components/LocationSearch';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function EditPlayer() {
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
        formData.append("id", id);
        formData.append("name", data.name);
        formData.append("date", data.date);
        formData.append("month", data.month);
        formData.append("year", data.year);
        formData.append("timezone", data.timezone);
        formData.append("latitude", data.latitude);
        formData.append("longitude", data.longitude);
        formData.append("hours", data.hours);
        formData.append("minutes", data.minutes);
        formData.append("seconds", data.seconds);
        formData.append("birthplace", data.birthplace);
        formData.append("height", data.height);
        formData.append("role", data.role);
        formData.append("batting_style", data.batting_style);
        formData.append("bowling_style", data.bowling_style);
        formData.append("current_age", data.current_age);
        
        if(data.avatar_image && data.avatar_image[0]){
            formData.append("avatar_image", data.avatar_image[0]);
            let fileSizeMB = data.avatar_image[0].size / (1024 ** 2)
            if(fileSizeMB > 10) {
                return toast.error("Select File Less than 10 MB");
            } 
        }
        
        const apiConfig = {
            headers: {
                Authorization: "Bearer " + accessToken,
                'Content-Type': 'multipart/form-data',
            }
        };

        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/savePlayer` : `${process.env.REACT_APP_LOCAL_API_URL}/savePlayer`, formData, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchPlayerDetails();
                toast.success("Player Successfully Updated");
            } else {
                fetchPlayerDetails();
                toast.error(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }

    const fetchPlayerDetails = () => {
        axios.get(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getPlayer/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/getPlayer/${id}`,
            apiConfig
        ).then((response) => {
            if(response.data.success){
                let player = response.data.data;
                setValue("name", player.name);
                setValue('date', player.date); 
                setValue('month', player.month); 
                setValue('year', player.year); 
                setValue("birthplace", player.birthplace);
                setValue("hours", player.hours);
                setValue("minutes", player.minutes);
                setValue("seconds", player.seconds);
                setValue("latitude", player.latitude);
                setValue("longitude", player.longitude);
                setValue("height", player.height);
                setValue("role", player.role);
                setValue("batting_style", player.batting_style);
                setValue("bowling_style", player.bowling_style);
                setValue("current_age", player.current_age);
            }
        }).catch((error) => {
            toast.error(error);
        });
    } 

    const setCurrentsAge = (e) => {
        const currentYear = new Date().getFullYear(); // Get the current year
        const yearOfBirth = parseInt(e.target.value); // Extract the year and convert it to an integer
        const calculatedAge = currentYear - yearOfBirth;
        setValue('current_age', calculatedAge);
    }
    
    const handleLocationSelect = (data) => {
        setValue('latitude', data.lat);
        setValue('longitude', data.lng);
        setValue('birthplace', data.location);        
    } 

    useEffect(() => {
        fetchPlayerDetails();
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
                        <h1>Edit Player</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="float-sm-right">
                                <span className='btn btn-primary' onClick={()=>navigate(`/players-list`)}>View Players</span>
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
                                        <h3 className="card-title">Edit Player Form</h3>
                                    </div>
                                    {/* /.card-header */}
                                    {/* form start */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="name">Player Name</label>
                                                        <input className="form-control" type="text" placeholder="Enter Name" required {...register("name")} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="role">Role</label>
                                                        <input className="form-control" type="text" placeholder="Enter Role" required {...register("role")} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="date">Date</label>
                                                        <input className="form-control" type="number" placeholder='Enter Date' {...register("date")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="month">Month</label>
                                                        <input className="form-control" type="number" placeholder='Enter Month' {...register("month")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="year">Year</label>
                                                        <input className="form-control" type="number" placeholder='Enter Year' {...register("year")} onChange={(e)=>setCurrentsAge(e)}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="hours">Hours</label>
                                                        <input className="form-control" type="number" placeholder='Enter Hours' {...register("hours")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="minutes">Minutes</label>
                                                        <input className="form-control" type="number" placeholder='Minutes' {...register("minutes")}/>
                                                    </div>
                                                </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group">
                                                            <label htmlFor="height">Height</label>
                                                            <input className="form-control" type="number" placeholder="Enter Height (in cm)" {...register("height")} />
                                                        </div>
                                                    </div> 
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="birth_place">Birth Place</label>
                                                        <LocationSearch onLocationSelect={handleLocationSelect}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="batting_style">Batting Style</label>
                                                        <input className="form-control" type="text" placeholder="Enter Batting Style" {...register("batting_style")} />
                                                    </div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="bowling_style">Bowling Style</label>
                                                        <input className="form-control" type="text" placeholder="Enter Bowling Style" {...register("bowling_style")} />
                                                    </div>
                                                </div> 
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="batting_style">Select Image</label>
                                                        <input className="form-control" type="file" {...register("avatar_image")} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="latitude">Latitude</label>
                                                        <input className="form-control" type="text" placeholder="Latitude" {...register("latitude")} disabled />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="longitude">Longitude</label>
                                                        <input className="form-control" type="text" placeholder="Longitude" {...register("longitude")} disabled />
                                                    </div>
                                                </div>  
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="longitude">Current Age</label>
                                                        <input className="form-control" type="number" placeholder="Current Age" {...register("current_age")} disabled />
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
