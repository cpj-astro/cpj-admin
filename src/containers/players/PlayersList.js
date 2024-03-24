import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import PlanetaryHouses from '../../components/PlanetaryHouses';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import Kundli from '../../components/Kundli';

export default function PlayersList() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([])
    const [planetaryData, setPlanetaryData] = useState([]);
    const [show, setShow] = useState(false);

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

    const fetchPlayersData = () => {
        try {
            axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getPlayersList` : `${process.env.REACT_APP_LOCAL_API_URL}/getPlayersList`, apiConfig)
            .then((response) => {
                if(response.data.success){
                    setPlayers(response.data.data);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
        } catch (error) {
            toast.error(error);
        }
    }

    const deletePlayer = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this player!",
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
                axios.delete(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/deletePlayer/${id}` : `${process.env.REACT_APP_LOCAL_API_URL}/deletePlayer/${id}`, apiConfig)
                .then((response) => {
                    if(response.data.success){
                        fetchPlayersData();
                        toast.success("Player Deleted Successfully");
                    } else {
                        fetchPlayersData();
                        toast.error("Invalid Request");
                    }
                }).catch((error) => {
                    toast.error(error.code);
                });
            }
        })
    }

    useEffect(() => {
        fetchPlayersData();
    },[])  
    return (
        <>
            <Header/>
            <div className="content-wrapper">
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
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Players List</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="float-sm-right">
                                <span className='btn btn-primary' onClick={()=>navigate(`/add-player`)}>Add Player</span>
                            </div>
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
                            <h3 className="card-title">Players List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <table id="example5" className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Image</th>
                                        <th>Kundli</th>
                                        <th>Name</th>
                                        <th>Date</th>
                                        <th>Current Age</th>
                                        <th>Birth Place</th>
                                        <th>Birth Time</th>
                                        <th>Height</th>
                                        <th>Role</th>
                                        <th>Batting Style</th>
                                        <th>Bowling Style</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(players && players.length > 0) ? players.map((player, index) => (
                                        <tr>
                                            <td> {index+1} </td>
                                            <td> 
                                                <a href={player.avatar_image} target='_blank'><i className='fa fa-eye'></i></a> 
                                            </td>
                                            <td> 
                                                <span onClick={()=>handleShow(player.kundli_data)}><i className='fa fa-eye'></i></span>
                                            </td>
                                            <td>{player.name ?? 'N/A'}</td>
                                            <td>{(player.date + '/' + player.month + '/' + player.year) ?? 'N/A'}</td>
                                            <td>{player.current_age ?? 'N/A'}</td>
                                            <td>{player.birthplace ?? 'N/A'}</td>
                                            <td>{(player.hours + ':' + player.minutes + ':' + player.seconds) ?? 'N/A'}</td>
                                            <td>{player.height ?? 'N/A'}</td>
                                            <td>{player.role ?? 'N/A'}</td>
                                            <td>{player.batting_style ?? 'N/A'}</td>
                                            <td>{player.bowling_style ?? 'N/A'}</td>
                                            <td className='text-center'> 
                                                <Link to={`/edit-player/${player.id}`} title="Edit" type="button" className='mr-1'>
                                                    <i class="fa fa-edit"></i>
                                                </Link>
                                                |
                                                <span onClick={() => {deletePlayer(player.id)}} title="Delete" type="button" className='ml-1 text-danger'>
                                                    <i class="fa fa-trash"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={13}>
                                                No Players Found
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Image</th>
                                        <th>Kundli</th>
                                        <th>Date</th>
                                        <th>Name</th>
                                        <th>Current Age</th>
                                        <th>Birth Place</th>
                                        <th>Birth Time</th>
                                        <th>Height</th>
                                        <th>Role</th>
                                        <th>Batting Style</th>
                                        <th>Bowling Style</th>
                                        <th className="text-center">Action</th>
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
