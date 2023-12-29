import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';
import { useParams } from 'react-router-dom';

export default function ManageTeams() {
  const {id} = useParams();
  var accessToken = localStorage.getItem('auth_token');
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm();
  const [teams, setTeams] = useState([]);

  const fetchTeamList = (id) => {
    setValue('match_id', id);
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    };
    axios
      .get(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/getAllTeams/${id}`
          : `${process.env.REACT_APP_LOCAL_API_URL}/getAllTeams/${id}`,
        apiConfig
      )
      .then((response) => {
        if (response.data.success) {
          setTeams(response.data.data);
        }
      })
      .catch((error) => {
        toast.error('Oh Snap!' + error.code);
      });
  };

  const onSubmit = async (data) => {
    data.match_id = id;
    const positions = ['bowler', 'batsman', 'wicket_keeper', 'all_rounder'];
    const positionCount = {};
    
    positions.forEach((position) => {
      if (Array.isArray(data[position])) {
        data[position] = data[position].join(', ');
      }
    });
  
    let hasDuplicates = false;
    Object.values(positionCount).forEach((count) => {
      if (count > 1) {
        hasDuplicates = true;
      }
    });
  
    if (hasDuplicates) {
      toast.error('Duplicate player positions are not allowed.');
      return;
    }

    const apiConfig = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    };

    axios
      .put(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/team${data.id ? '/' + data.id : ''}`
          : `${process.env.REACT_APP_LOCAL_API_URL}/team${data.id ? '/' + data.id : ''}`,
        data,
        apiConfig
      )
      .then((response) => {
        if (response.data.success) {
          fetchTeamList(id);
          toast.success(response.data.msg);
        } else {
          fetchTeamList(id);
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error(error.code);
      });
  };

  const editTeam = (t_id) => {
    const apiConfig = {
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    };
    axios
      .get(
        process.env.REACT_APP_DEV === 'true'
          ? `${process.env.REACT_APP_DEV_API_URL}/team/${t_id}`
          : `${process.env.REACT_APP_LOCAL_API_URL}/team/${t_id}`,
        apiConfig
      )
      .then((response) => {
        if (response.data.success) {
          let teamData = response.data.data;
          if (teamData.id) {
            setValue('id', teamData.id);
          }
          setValue('team_name', teamData.team_name);
          setValue('p1', teamData.p1);
          setValue('p2', teamData.p2);
          setValue('p3', teamData.p3);
          setValue('p4', teamData.p4);
          setValue('p5', teamData.p5);
          setValue('p6', teamData.p6);
          setValue('p7', teamData.p7);
          setValue('p8', teamData.p8);
          setValue('p9', teamData.p9);
          setValue('p10', teamData.p10);
          setValue('p11', teamData.p11);
          setValue('captain', teamData.captain);
          setValue('vice_captain', teamData.vice_captain);
          setValue('bowler', teamData.bowler);
          setValue('batsman', teamData.batsman);
          setValue('wicket_keeper', teamData.wicket_keeper);
          setValue('all_rounder', teamData.all_rounder);
          setValue('status', teamData.status);
          
          fetchTeamList(id);
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        toast.error(error.code);
      });
  };

  const deleteTeam = (id) => {
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this team!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        const apiConfig = {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          },
        };
        axios
          .delete(
            process.env.REACT_APP_DEV === 'true'
              ? `${process.env.REACT_APP_DEV_API_URL}/team/${id}`
              : `${process.env.REACT_APP_LOCAL_API_URL}/team/${id}`,
            apiConfig
          )
          .then((response) => {
            if (response.data.success) {
              fetchTeamList(id);
              toast.success(response.data.msg);
            } else {
              fetchTeamList(id);
              toast.error(response.data.msg);
            }
          })
          .catch((error) => {
            toast.error(error.code);
          });
      }
    });
  };

  useEffect(() => {
    fetchTeamList(id);
    setValue('match_id', id);
  }, []);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  return (
    <>
        <Header/>
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Manage Teams</h1>
                        </div>
                        <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"><a href={`${process.env.REACT_APP_PUBLIC_URL}/`}>Dashboard</a></li>
                            <li className="breadcrumb-item active">Upcoming Matches</li>
                        </ol>
                        </div>
                    </div>
                </div>
                {/* /.container-fluid */}
            </section>
            <section className="content">
                <div className="container-fluid">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input type="hidden" {...register('id')} value={null} />
                      <input type="hidden" {...register('match_id')} value={null} />
                      <div className="row">
                          <div className="col-md-6">
                              <label className="form-label fw-bold">Team Name:</label>
                              <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter Team Name"
                                  required
                                  {...register('team_name')}
                              />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 1:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 1" {...register('p1')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 2:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 2" {...register('p2')} />
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 3:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 3" {...register('p3')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 4:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 4" {...register('p4')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 5:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 5" {...register('p5')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 6:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 6" {...register('p6')} />
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 7:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 7" {...register('p7')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 8:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 8" {...register('p8')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 9:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 9" {...register('p9')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 10:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 10" {...register('p10')} />
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Player 11:</label>
                              <input className="form-control" type="text" placeholder="Enter Player 11" {...register('p11')} />
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Captain:</label>
                              <select className='form-control' {...register("captain")} required>   
                                  <option value={1} key='1'>Player 1</option>
                                  <option value={2} key='2'>Player 2</option>
                                  <option value={3} key='3'>Player 3</option>
                                  <option value={4} key='4'>Player 4</option>
                                  <option value={5} key='5'>Player 5</option>
                                  <option value={6} key='6'>Player 6</option>
                                  <option value={7} key='7'>Player 7</option>
                                  <option value={8} key='8'>Player 8</option>
                                  <option value={9} key='9'>Player 9</option>
                                  <option value={10} key='10'>Player 10</option>
                                  <option value={11} key='11'>Player 11</option>
                              </select>
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Vice Captain:</label>
                              <select className='form-control' {...register("vice_captain")} required>   
                                  <option value={1} key='1'>Player 1</option>
                                  <option value={2} key='2'>Player 2</option>
                                  <option value={3} key='3'>Player 3</option>
                                  <option value={4} key='4'>Player 4</option>
                                  <option value={5} key='5'>Player 5</option>
                                  <option value={6} key='6'>Player 6</option>
                                  <option value={7} key='7'>Player 7</option>
                                  <option value={8} key='8'>Player 8</option>
                                  <option value={9} key='9'>Player 9</option>
                                  <option value={10} key='10'>Player 10</option>
                                  <option value={11} key='11'>Player 11</option>
                              </select>
                          </div>
                          <div className='col-md-3'>
                              <label className="form-label fw-bold">Status:</label>
                              <select className='form-control' {...register("status")} required>   
                                  <option value={0} key='1'>In Active</option>
                                  <option value={1} key='2'>Active</option>
                              </select>
                          </div>
                          
                      </div>
                      <div className="row">
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Batsman:</label>
                              <select className='form-control' {...register("batsman")} multiple required>   
                                  <option value={1} key='1'>Player 1</option>
                                  <option value={2} key='2'>Player 2</option>
                                  <option value={3} key='3'>Player 3</option>
                                  <option value={4} key='4'>Player 4</option>
                                  <option value={5} key='5'>Player 5</option>
                                  <option value={6} key='6'>Player 6</option>
                                  <option value={7} key='7'>Player 7</option>
                                  <option value={8} key='8'>Player 8</option>
                                  <option value={9} key='9'>Player 9</option>
                                  <option value={10} key='10'>Player 10</option>
                                  <option value={11} key='11'>Player 11</option>
                              </select>
                          </div>
                          <div className="col-md-3">
                              <label className="form-label fw-bold">Bowler:</label>
                              <select className='form-control' {...register("bowler")} multiple required>   
                                  <option value={1} key='1'>Player 1</option>
                                  <option value={2} key='2'>Player 2</option>
                                  <option value={3} key='3'>Player 3</option>
                                  <option value={4} key='4'>Player 4</option>
                                  <option value={5} key='5'>Player 5</option>
                                  <option value={6} key='6'>Player 6</option>
                                  <option value={7} key='7'>Player 7</option>
                                  <option value={8} key='8'>Player 8</option>
                                  <option value={9} key='9'>Player 9</option>
                                  <option value={10} key='10'>Player 10</option>
                                  <option value={11} key='11'>Player 11</option>
                              </select>
                          </div>
                          <div className='col-md-3'>
                              <label className="form-label fw-bold">Wicket Keeper:</label>
                              <select className='form-control' {...register("wicket_keeper")} multiple required>   
                                  <option value={1} key='1'>Player 1</option>
                                  <option value={2} key='2'>Player 2</option>
                                  <option value={3} key='3'>Player 3</option>
                                  <option value={4} key='4'>Player 4</option>
                                  <option value={5} key='5'>Player 5</option>
                                  <option value={6} key='6'>Player 6</option>
                                  <option value={7} key='7'>Player 7</option>
                                  <option value={8} key='8'>Player 8</option>
                                  <option value={9} key='9'>Player 9</option>
                                  <option value={10} key='10'>Player 10</option>
                                  <option value={11} key='11'>Player 11</option>
                              </select>
                          </div>
                          <div className='col-md-3'>
                              <label className="form-label fw-bold">All Rounder:</label>
                              <select className='form-control' {...register("all_rounder")} multiple required>   
                                  <option value={1} key='1'>Player 1</option>
                                  <option value={2} key='2'>Player 2</option>
                                  <option value={3} key='3'>Player 3</option>
                                  <option value={4} key='4'>Player 4</option>
                                  <option value={5} key='5'>Player 5</option>
                                  <option value={6} key='6'>Player 6</option>
                                  <option value={7} key='7'>Player 7</option>
                                  <option value={8} key='8'>Player 8</option>
                                  <option value={9} key='9'>Player 9</option>
                                  <option value={10} key='10'>Player 10</option>
                                  <option value={11} key='11'>Player 11</option>
                              </select>
                          </div>
                          
                      </div>
                      <div className="row mt-3">
                          <div className="col-md-3">
                          <div className="row">
                              <div className="col-md-6">
                              <input type="reset" value="CLEAR" className="btn btn-secondary w-100" />
                              </div>
                              <div className="col-md-6">
                              <input type="submit" value="SUBMIT" className="btn btn-primary w-100" />
                              </div>
                          </div>
                          </div>
                      </div>
                    </form>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                            <h2>Teams List</h2>
                            <hr />
                            <Table className='table-responsive' striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Team Name</th>
                                    <th>Player 1</th>
                                    <th>Player 2</th>
                                    <th>Player 3</th>
                                    <th>Player 4</th>
                                    <th>Player 5</th>
                                    <th>Player 6</th>
                                    <th>Player 7</th>
                                    <th>Player 8</th>
                                    <th>Player 9</th>
                                    <th>Player 10</th>
                                    <th>Player 11</th>
                                    <th>Captain</th>
                                    <th>Vice Captain</th>
                                    <th>Batsman</th>
                                    <th>Bowler</th>
                                    <th>Wicket Keeper</th>
                                    <th>All Rounder</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams && teams.length > 0 ? (
                                teams.map((team, index) => (
                                    <tr key={index}>
                                    <td>{team.team_name ?? 'N/A'}</td>
                                    <td>{team.p1 ?? 'N/A'}</td>
                                    <td>{team.p2 ?? 'N/A'}</td>
                                    <td>{team.p3 ?? 'N/A'}</td>
                                    <td>{team.p4 ?? 'N/A'}</td>
                                    <td>{team.p5 ?? 'N/A'}</td>
                                    <td>{team.p6 ?? 'N/A'}</td>
                                    <td>{team.p7 ?? 'N/A'}</td>
                                    <td>{team.p8 ?? 'N/A'}</td>
                                    <td>{team.p9 ?? 'N/A'}</td>
                                    <td>{team.p10 ?? 'N/A'}</td>
                                    <td>{team.p11 ?? 'N/A'}</td>
                                    <td>{team.captain ?? 'N/A'}</td>
                                    <td>{team.vice_captain ?? 'N/A'}</td>
                                    <td>{team.batsman ?? 'N/A'}</td>
                                    <td>{team.bowler ?? 'N/A'}</td>
                                    <td>{team.wicket_keeper ?? 'N/A'}</td>
                                    <td>{team.all_rounder ?? 'N/A'}</td>
                                    <td>{team.status ?? 'N/A'}</td>
                                    {/* Add more TDs for other team properties */}
                                    <td width="100">
                                        <button
                                        className="btn btn-info btn-sm ms-2 text-white"
                                        title="Edit"
                                        type="button"
                                        onClick={() => {
                                            editTeam(team.id);
                                        }}
                                        >
                                        <FiEdit2 />
                                        </button>
                                        <button
                                        className="btn btn-danger btn-sm ms-2"
                                        title="Delete"
                                        type="button"
                                        onClick={() => {
                                            deleteTeam(team.id);
                                        }}
                                        >
                                        <FiTrash2 />
                                        </button>
                                    </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan={20} className="text-center">
                                    No Teams
                                    </td>
                                </tr>
                                )}
                            </tbody>
                            </Table>
                        </div>
                    </div>
                </div> 
            </section>
        </div>
        <SideNav/>
        <Footer/>
    </>
  );
}
