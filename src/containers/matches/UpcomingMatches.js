import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function UpcomingMatches() {
    const [matchesData, setMatchesData] = useState([]);
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    useEffect(() => {
        fetchUpcomingList()
    },[])
    
    const fetchUpcomingList = () => {
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/upcomingMatches` : `${process.env.REACT_APP_LOCAL_API_URL}/upcomingMatches`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setMatchesData(response.data.data);
            }
        }).catch((error) => {
            console.log("fetchUpcomingList", error)
        });
    }

    const sendToLive = (id, category) => {
        const params = {
            match_id: id,
            match_category: category
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatch`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                let match = response.data.data;
                match.team_a_score = {
                    1: {
                        ball: '',
                        score: '',
                        wicket: '',
                    },
                    team_id:  match && match.team_a_id ? match.team_a_id : '',
                };
                match.team_a_scores_over = [
                    {
                        over: '',
                        score: '',
                    }  
                ];
                match.team_b_score = {
                    2: {
                        ball: '',
                        score: '',
                        wicket: '',
                    },
                    team_id: match && match.team_b_id ? match.team_b_id : '',
                };
                match.team_b_scores_over = [
                    {
                        over: '',
                        score: '',
                    }  
                ];
                match.batsman = [
                    {
                        ball: '',
                        fours: '',
                        name: '',
                        run: '',
                        sixes: '',
                        strike_rate: ''
                    },
                    {
                        ball: '',
                        fours: '',
                        name: '',
                        run: '',
                        sixes: '',
                        strike_rate: ''
                    }
                ];
                match.bowler = {
                    economy: '',
                    name: '',
                    over: '',
                    run: '',
                    wicket: ''
                }; 
                match.match_completed = {
                    status: false,
                    t1: 'YES',
                    t2: 'NO',
                    t1_back: '',
                    t1_lay: '',
                    t2_back: '',
                    t2_lay: '',
                };
                match.match_tied = {
                    status: false,
                    t1: 'YES',
                    t2: 'NO',
                    t1_back: '',
                    t1_lay: '',
                    t2_back: '',
                    t2_lay: '',
                }
                console.log("sendToLive", match)
                setDoc(doc(db, "matchdata", String(response.data.data.match_id)), response.data.data, {merge: true});
                fetchUpcomingList();
            }
        }).catch((error) => {
            console.log("sendToLive", error)
        });
    }
    
    const sendToRecent = (id, category) => {
        const params = {
            match_id: id,
            match_category: category
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatch`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchUpcomingList();
            }
        }).catch((error) => {
            console.log("sentToRecent", error)
        });
    }

    const changeAstrologyStatus = (id, status) => {
        const params = {
            match_id: id,
            astrology_status: status
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatchAstroStatus` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatchAstroStatus`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchUpcomingList();
            }
        }).catch((error) => {
            console.log("sentToRecent", error)
        });
    }
    
    return (
        <>
            <Header/>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Upcoming Matches</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Upcoming Matches</li>
                        </ol>
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
                            <h3 className="card-title">Upcoming Matches List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <table id="example3" className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Matches</th>
                                        <th>Date/Time</th>
                                        <th>Match No.</th>
                                        <th>Series</th>
                                        <th>Move To</th>
                                        <th>Astrology</th>
                                        <th className="text-center">Manage Astrology</th>
                                        <th className="text-center">Edit Match</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(matchesData && matchesData.length > 0) ? matchesData.map((match, index) => (
                                        <tr>
                                            <td> {index+1} </td>
                                            <td> {match.team_a && match.team_b ? match.team_a + ' VS ' + match.team_b : 'N/A'} </td>
                                            <td> {match.date_wise ? match.date_wise : 'N/A'} </td>
                                            <td> {match.match_id ? match.match_id : 'N/A'} </td>
                                            <td> {match.series_name ? match.series_name : 'N/A'} </td>
                                            <td> <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToLive(match.match_id, 'live')}}>Live</span> | <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToRecent(match.match_id, 'recent')}}>Recent</span> </td>
                                            <td className='text-center'>
                                                {match.astrology_status === 'enable' ?
                                                <span className='badge badge-danger text-bold cursor-pointer' onClick={()=>{changeAstrologyStatus(match.match_id, 'disable')}}>
                                                    Click to Disable
                                                </span> :
                                                <span className='badge badge-success text-bold cursor-pointer' onClick={()=>{changeAstrologyStatus(match.match_id, 'enable')}}>
                                                    Click to Enable
                                                </span> 
                                                }
                                            </td>
                                            <td className='text-center'> 
                                                <Link to={`/add-match-astrology/${match.match_id}/${match.team_a + ' VS ' + match.team_b}`}>
                                                    <i className='fa fa-eye'></i>
                                                </Link> 
                                            </td>
                                            <td className='text-center'> 
                                                <Link to={`/edit-match/${match.match_id}`}>
                                                    <i class="fa fa-edit"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={8}>
                                                No Upcoming Matches
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Matches</th>
                                        <th>Date/Time</th>
                                        <th>Match No.</th>
                                        <th>Series</th>
                                        <th>Move To</th>
                                        <th>Astrology</th>
                                        <th className="text-center">Manage Astrology</th>
                                        <th className="text-center">Edit Match</th>
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
