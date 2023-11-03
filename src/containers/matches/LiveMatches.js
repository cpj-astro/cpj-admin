import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function LiveMatches() {
    const [matchesData, setMatchesData] = useState([]);
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    const fetchLiveList = () => {
        axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/liveMatches` : `${process.env.REACT_APP_LOCAL_API_URL}/liveMatches`, apiConfig)
        .then((response) => {
            if(response.data.success){
                setMatchesData(response.data.data);
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }
    
    useEffect(() => {
        fetchLiveList();
    },[])
    
    const sendToUpcoming = (id, category) => {
        const params = {
            match_id: id,
            match_category: category
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateMatch` : `${process.env.REACT_APP_LOCAL_API_URL}/updateMatch`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                setMatchesData(response.data.data);
                fetchLiveList();
            }
        }).catch((error) => {
            console.log("sentToUpcoming", error)
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
                setMatchesData(response.data.data);
                fetchLiveList();
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
                        <h1>Live Matches</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Live Matches</li>
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
                            <h3 className="card-title">Live Matches List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <table id="example1" className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Team A</th>
                                        <th>Team B</th>
                                        <th>Match No.</th>
                                        <th>Match Name.</th>
                                        <th>Series</th>
                                        <th>Move To</th>
                                        <th className='text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matchesData && matchesData.length > 0 ? matchesData.map((match, index) => (
                                        <tr>
                                            <td> {match.team_a} </td>
                                            <td> {match.team_b} </td>
                                            <td> {match.match_id} </td>
                                            <td> {match.matchs} </td>
                                            <td> {match.series_name} </td>
                                            <td> <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToUpcoming(match.match_id, 'upcoming')}}>Upcoming</span> | <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToRecent(match.match_id, 'recent')}}>Recent</span> </td>
                                            <td className='text-center'> 
                                                <Link to={`/live-match-control/${match.match_id}`} title="Edit" type="button">
                                                    <i class="fa fa-eye"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={7}>
                                                No Live Matches
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Team A</th>
                                        <th>Team B</th>
                                        <th>Match No.</th>
                                        <th>Match Name.</th>
                                        <th>Series</th>
                                        <th>Move To</th>
                                        <th className='text-center'>Action</th>
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
