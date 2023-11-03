import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function RecentMatches() {
    const [matchesData, setMatchesData] = useState([]);
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    useEffect(() => {
      fetchRecentList();  
    },[])
    
    const fetchRecentList = () => {
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/recentMatches` : `${process.env.REACT_APP_LOCAL_API_URL}/recentMatches`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setMatchesData(response.data.data);
            }
        }).catch((error) => {
            toast.error(error.code);
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
                setMatchesData(response.data.data);
                fetchRecentList();
            }
        }).catch((error) => {
            console.log("sendToLive", error)
        });
    }
    
    const sendToUpcoming = (id, category) => {
        const params = {
            match_id: id,
            match_category: category
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatch`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                setMatchesData(response.data.data);
                fetchRecentList();
            }
        }).catch((error) => {
            toast.error(error.code);
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
                        <h1>Recent Matches</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Recent Matches</li>
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
                            <h3 className="card-title">Recent Matches List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <table id="example1" className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Matches</th>
                                        <th>Date/Time</th>
                                        <th>Match No.</th>
                                        <th>Series</th>
                                        <th>Move To</th>
                                        <th>Action</th>
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
                                            <td> <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToLive(match.match_id, 'live')}}>Live</span> | <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToUpcoming(match.match_id, 'upcoming')}}>Recent</span> </td>
                                            <td> 
                                                <Link to={`/edit-match/${match.match_id}`} title="Edit" type="button">
                                                    <i class="fa fa-edit"></i>
                                                </Link>
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
                                        <th>Matches</th>
                                        <th>Date/Time</th>
                                        <th>Match No.</th>
                                        <th>Series</th>
                                        <th>Move To</th>
                                        <th>Action</th>
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
