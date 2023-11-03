import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import axios from 'axios';
import swal from 'sweetalert';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function CupRates() {
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };
    const [cupRate, setCupRate] = useState([
        {
            id: null,
            title: '',
            sub_title: '',
            sequence_number: null,
            status: 1,
            get_all_cup_rates_teams: [
                {
                    id: null,
                    team_name: '',
                    back: '',
                    lay: '',
                    status: 1,
                }
            ]
        },
    ]);
    const [deleteIds, setDeteleIds] = useState([]);
    const [deleteTeamIds, setDeleteTeamIds] = useState([]);
    const { register, handleSubmit, reset, formState, formState: { isSubmitSuccessful } } = useForm();
    const onSubmit = async () => {        
        let cupRateData = {
            data: cupRate,
            delete_id: deleteIds,
            delete_team_id: deleteTeamIds 
        }
        
        axios.post(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/cupRates` : `${process.env.REACT_APP_LOCAL_API_URL}/cupRates`, 
            cupRateData,
            apiConfig
        ).then((response) => {
            if(response.data.success){
                getAllCupRatesData();
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }
    useEffect(() => {
        if (formState.isSubmitSuccessful) {
          reset();
        }
    }, [formState, reset]);

    const getAllCupRatesData = () => {
        axios.get(
            process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/getAllCupRates` : `${process.env.REACT_APP_LOCAL_API_URL}/getAllCupRates`, 
            apiConfig
        ).then((response) => {
            if(response.data.success){
                let cupRateData = response.data.data
                cupRateData.map((item, index)=>{
                    delete item.created_at
                    delete item.updated_at
                    item.get_all_cup_rates_teams && item.get_all_cup_rates_teams.length > 0 && item.get_all_cup_rates_teams.map((itemCup, indexCup)=>{
                        delete itemCup.created_at
                        delete itemCup.updated_at
                    })
                })
                setCupRate(cupRateData)
            }
        }).catch((error) => {
            toast.error(error.code);
        });
    }
    const addCupRate = () => {
        let cupRateItem = {
            id: null,
            title: '',
            sub_title: '',
            sequence_number: null,
            status: 1,
            get_all_cup_rates_teams: [
                {
                    id: null,
                    team_name: '',
                    back: '',
                    lay: '',
                    status: 1,
                }
            ]
        }
        let updatedCupRateData = [...cupRate, cupRateItem];
        setCupRate(updatedCupRateData);
    }
    const itemAddtoCupRate = (i) => {
        let updatedCupRateData = [...cupRate];
        updatedCupRateData[i].get_all_cup_rates_teams.push({
            id: null,
            team_name: '',
            back: '',
            lay: '',
            status: 1,
        })
        setCupRate(updatedCupRateData); 
    }
    const removeCupRateInfo = (i) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this info!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((isConfirm) => {
            if(isConfirm){
                let updatedCupRateData = [...cupRate];
                let deleteArr = [...deleteIds]
                if(updatedCupRateData[i].id){
                    deleteArr = [...deleteIds, updatedCupRateData[i].id];
                }
                updatedCupRateData.splice(i, 1);
                setCupRate(updatedCupRateData);
                setDeteleIds(deleteArr);
            }
        })
    }
    const removeCupRateItem = (i, item) => {
        let updatedCupRateData = [...cupRate];
        let deleteArr = [...deleteTeamIds]
        if(updatedCupRateData[i].get_all_cup_rates_teams[item].id){
            deleteArr = [...deleteTeamIds, updatedCupRateData[i].get_all_cup_rates_teams[item].id];
        }
        updatedCupRateData[i].get_all_cup_rates_teams.splice(item, 1);
        setCupRate(updatedCupRateData);
        setDeleteTeamIds(deleteArr);
    }
    const setCupRateIndexWise = (index, item, itemType) => {
        let cupRateData = [...cupRate];
        if(itemType == 'title') {
            cupRateData[index].title = item
        } else if(itemType == 'sub_title') {
            cupRateData[index].sub_title = item
        } else if(itemType == 'sequence_number') {
            cupRateData[index].sequence_number = Number(item)
        } else if(itemType == 'status') {
            cupRateData[index].status = item
        }
        setCupRate(cupRateData);
    }

    const setCupRateArrIndexWise = (index, cupIndex, item, itemType) => {
        let cupRateData = [...cupRate];
        if(itemType == 'back') {
            cupRateData[index].get_all_cup_rates_teams[cupIndex].back = item
        } else if(itemType == 'lay') {
            cupRateData[index].get_all_cup_rates_teams[cupIndex].lay = item
        } else if(itemType == 'team_name') {
            cupRateData[index].get_all_cup_rates_teams[cupIndex].team_name = item
        } else if(itemType == 'status') {
            cupRateData[index].get_all_cup_rates_teams[cupIndex].status = item
        }
        setCupRate(cupRateData);
    }

    useEffect(() => {
        getAllCupRatesData()
    }, [])

    return (
        <>
            <Header/>
            <div className="content-wrapper">
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Create Cuprates</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active">Create Cuprates</li>
                        </ol>
                        </div>
                    </div>
                    </div>{/* /.container-fluid */}
                </section>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            {/* left column */}
                            <div className="col-md-12">
                                <div className='card card-secondary'>
                                    <div className="card-header">
                                        <h3 className="card-title">Manage Cuprates</h3>
                                        <i className='fa fa-plus float-right cursor-pointer' onClick={() => addCupRate()}></i>
                                    </div>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                    {cupRate && cupRate.length > 0  && cupRate.map((item, index) => (
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col-md-3'>
                                                    <input className="form-control" type="text" placeholder="Enter Title" value={item.title} onChange={(e) => {setCupRateIndexWise(index, e.target.value, 'title')}}/>
                                                </div>
                                                <div className='col-md-3'>
                                                    <input className="form-control" type="text" placeholder="Enter Start Date" value={item.sub_title} onChange={(e) => {setCupRateIndexWise(index, e.target.value, 'sub_title')}}/>
                                                </div>
                                                <div className='col-md-3'>
                                                    <input className="form-control" type="number" min={0} placeholder="Enter Sequence" value={item.sequence_number} onChange={(e) => {setCupRateIndexWise(index, e.target.value, 'sequence_number')}}/>
                                                </div>
                                                <div className='col-md-3 mt-2'>
                                                    <div className='d-flex float-right'>
                                                        <label className="form-label fw-bold d-flex">Show Cup Rate Data:
                                                            <div className="form-check mx-2">
                                                                <input className="form-check-input" type="checkbox" checked={item.status} onChange={() => {setCupRateIndexWise(index, !item.status , 'status')}}/>
                                                            </div>
                                                        </label>
                                                        <span className='btn btn-secondary custom-btn' onClick={()=>{itemAddtoCupRate(index)}}>Add Item</span>
                                                        <span className='mx-1 btn btn-danger cross-btn' onClick={() => {removeCupRateInfo(index)}}>X</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row mt-1'>
                                            {item && item.get_all_cup_rates_teams.length > 0 && item.get_all_cup_rates_teams.map((itemCup, indexCup) => (
                                                <div className='col-md-6 mt-1'>
                                                    <div className='row'>
                                                        <div className='col-md-4'>
                                                            <label className="form-label fw-bold d-flex">
                                                                Team #{indexCup+1}
                                                                <div className="form-check mx-1">
                                                                    <input className="form-check-input" type="checkbox" checked={itemCup.status} onChange={() => {setCupRateArrIndexWise(index, indexCup, !itemCup.status , 'status')}}/>
                                                                </div>
                                                            </label>
                                                            <input className="form-control" type="text" placeholder="Enter Team" value={itemCup.team_name} onChange={(e) => {setCupRateArrIndexWise(index, indexCup, e.target.value, 'team_name')}}/>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <label className="form-label fw-bold">Back:</label>
                                                            <input className="form-control" type="text" placeholder="Enter Back" value={itemCup.back} onChange={(e) => {setCupRateArrIndexWise(index, indexCup, e.target.value, 'back')}}/>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <label className="form-label fw-bold">Lay:</label>
                                                            <span className='mx-1 btn btn-danger cross-btn float-right mt-1' onClick={()=>{removeCupRateItem(index, indexCup)}}>X</span>
                                                            <input className="form-control" type="text" placeholder="Enter Lay" value={itemCup.lay} onChange={(e) => {setCupRateArrIndexWise(index, indexCup, e.target.value, 'lay')}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="card-footer">
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <input type="submit" value="SUBMIT" className='btn btn-primary w-100'/>
                                            </div>
                                        </div>
                                    </div>
                                    </form>
                                </div>
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
