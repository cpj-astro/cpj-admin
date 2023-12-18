import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { setDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../../auth-files/fbaseconfig';
import { toast } from 'react-toastify';
import {
    useNavigate,
} from 'react-router-dom'
import axios from 'axios';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function AddMatch() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    const [series, setSeries] = useState([])
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };
    const onSubmit = async (matchData) => {    
        console.log('onSubmit', matchData);    
        axios.post(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/addMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/addMatch`, 
            matchData , 
            apiConfig
        ).then((response) => {
            if(response.data.success){
                toast.success(response.data.msg);
            }
        }).catch((error) => {
            toast.error(error);
        });
    }
    const fetchSeriesData = () => {
        try {
            axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/seriesList` : `${process.env.REACT_APP_LOCAL_API_URL}/seriesList`, apiConfig)
            .then((response) => {
                if(response.data.success){
                    setSeries(response.data.data);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
        } catch (error) {
            toast.error(error);
        }
    }
    
    useEffect(() => {
        fetchSeriesData();
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
                        <h1>Add Match</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Add Match</li>
                        </ol>
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
                                    <h3 className="card-title">Add Match Form</h3>
                                    </div>
                                    {/* /.card-header */}
                                    {/* form start */}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_a">Team A</label>
                                                        <input type="text" className="form-control" id="team_a" placeholder="Team A" {...register("team_a")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_b">Team B</label>
                                                        <input type="text" className="form-control" id="team_b" placeholder="Team B" {...register("team_b")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_a_short">Team A Short</label>
                                                        <input type="text" className="form-control" id="team_a_short" placeholder="Team A Short" {...register("team_a_short")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_b_short">Team B Short</label>
                                                        <input type="text" className="form-control" id="team_b_short" placeholder="Team B Short" {...register("team_b_short")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_a_id">Team A ID</label>
                                                        <input type="text" className="form-control" id="team_a_id" placeholder="Team A ID" {...register("team_a_id")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_b_id">Team B ID</label>
                                                        <input type="text" className="form-control" id="team_b_id" placeholder="Team B ID" {...register("team_b_id")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="date">Date</label>
                                                        <input type="date" className="form-control" id="date" {...register("date")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="time">Time</label>
                                                        <input type="time" className="form-control" id="time" {...register("time")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="day">Day</label>
                                                        <input type="text" className="form-control" id="day" placeholder="Day" {...register("day")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="ground_name">Ground Name</label>
                                                        <input type="text" className="form-control" id="ground_name" placeholder="Ground Name" {...register("ground_name")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_a_img">Team A Image</label>
                                                        <input type="text" className="form-control" id="team_a_img" placeholder="Team A Image" {...register("team_a_img")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="team_b_img">Team B Image</label>
                                                        <input type="text" className="form-control" id="team_b_img" placeholder="Team B Image" {...register("team_b_img")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="toss">Toss</label>
                                                        <input type="text" className="form-control" id="toss" placeholder="Toss" {...register("toss")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="umpire">Umpire</label>
                                                        <input type="text" className="form-control" id="umpire" placeholder="Umpire" {...register("umpire")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="third_umpire">Third Umpire</label>
                                                        <input type="text" className="form-control" id="third_umpire" placeholder="Third Umpire" {...register("third_umpire")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="referee">Referee</label>
                                                        <input type="text" className="form-control" id="referee" placeholder="Referee" {...register("referee")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="matchs">Match Name</label>
                                                        <input type="text" className="form-control" id="matchs" placeholder="Match Name" {...register("matchs")}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="series_name">Series Name</label>
                                                        <select className="form-control" id="series_name" {...register("series_name")}>
                                                        <option value="">-- Select Series --</option>
                                                        {series.length > 0 ? series.map((series) => { 
                                                            return <option value={series.series_id} key={series.series_id}>{series.series_name}</option>; 
                                                        }) : null}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="match_category">Match Status</label>
                                                        <select className="form-control" id="match_category" {...register("match_category")}>
                                                            <option value="">-- Select Match Status --</option>
                                                            <option value="recent">Recent</option>
                                                            <option value="upcoming">Upcoming</option>
                                                            <option value="live">Live</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="match_id">Match ID <span className="text-danger font-italic font-underline">(Important)</span></label>
                                                        <input type="text" className="form-control" id="match_id" placeholder="Match ID" {...register("match_id")}/>
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
                    </div>{/* /.container-fluid */}
                </section>
                {/* /.content */}
            </div>
            <SideNav/>
            <Footer/>
        </>
    )
}
