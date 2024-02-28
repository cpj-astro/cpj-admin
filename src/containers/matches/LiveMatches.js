import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import { Button } from 'react-bootstrap';
import Kundli from '../../components/Kundli';

export default function LiveMatches() {
    const [matchesData, setMatchesData] = useState([]);
    const [show, setShow] = useState(false);
    const [planetaryData, setPlanetaryData] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = (data) => {
        setPlanetaryData(data);
        setShow(true);
    }
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

    const createMatchKundli = (data) => {
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/saveMatchKundli` : `${process.env.REACT_APP_LOCAL_API_URL}/saveMatchKundli`, data, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchLiveList();
            }
        }).catch((error) => {
            console.log("createMatchKundli", error)
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
                setDoc(doc(db, "matchdata", String(id)), {astrology_status: status, astro_on_live: true}, {merge: true});
                fetchLiveList();
            }
        }).catch((error) => {
            console.log(error)
        });
    }
    return (
        <>
            <Header/>
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Kundli Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="astrology-chart">
                        <Kundli housesData={planetaryData}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
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
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
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
                                        <th className='text-center'>Create Kundli</th> 
                                        <th>Astrology</th>
                                        <th className="text-center">Manage Astrology</th>
                                        <th className="text-center">Fantacy Teams</th>
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
                                            <td> 
                                                <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToUpcoming(match.match_id, 'upcoming')}}>Upcoming</span> | <span className='text-primary text-bold cursor-pointer' onClick={()=>{sendToRecent(match.match_id, 'recent')}}>Recent</span> 
                                            </td>
                                            <td className='text-center'> 
                                            {
                                                match && match.kundli_data ?
                                                    <span className='text-primary text-bold cursor-pointer' onClick={()=>handleShow(match.kundli_data)}><i className='fa fa-eye'></i></span>
                                                :
                                                    <span className='text-primary text-bold cursor-pointer' onClick={()=>{createMatchKundli(match)}}>
                                                        <i className='fa fa-plus-square'></i>
                                                    </span>
                                            }
                                            </td> 
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
                                                <Link to={`/manage-teams/${match.match_id}`}>
                                                    <i className='fa fa-eye'></i>
                                                </Link> 
                                            </td>
                                            <td className='text-center'> 
                                                <Link to={`/live-match-control/${match.match_id}`} title="Edit" type="button">
                                                    <i class="fa fa-eye"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={11}>
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
                                        <th className='text-center'>Create Kundli</th>
                                        <th>Astrology</th>
                                        <th className="text-center">Manage Astrology</th>
                                        <th className="text-center">Fantacy Teams</th>
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
