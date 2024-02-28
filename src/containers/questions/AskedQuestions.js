import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, onSnapshot , doc, updateDoc, setDoc} from "firebase/firestore";
import { db } from '../../auth-files/fbaseconfig';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import { Button } from 'react-bootstrap';
import Header from '../../components/header';
import SideNav from '../../components/side-nav';
import Footer from '../../components/footer';

export default function AskedQuestions() {
    const [questionData, setQuestionData] = useState([]);
    const [questions, setAskedQuestions] = useState([]);
    const [answer, setAnswer] = useState(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    var accessToken = localStorage.getItem('auth_token');
    const apiConfig = {
        headers: {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        }
    };

    const fetchAskedQuestionsData = () => {
        try {
            axios.get(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/asked-questions` : `${process.env.REACT_APP_LOCAL_API_URL}/asked-questions`, apiConfig)
            .then((response) => {
                if(response.data.success){
                    setAskedQuestions(response.data.data);
                }
            }).catch((error) => {
                toast.error(error.code);
            });
        } catch (error) {
            toast.error(error);
        }
    }

    const changeQuestionStatus = (id, status) => {
        const params = {
            id: id,
            status: status
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/updateQuestionStatus` : `${process.env.REACT_APP_LOCAL_API_URL}/updateQuestionStatus`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchAskedQuestionsData();
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleClose = () => {
        setShow(false);
        setQuestionData([]);
        setAnswer(null);
    };
    
    const handleShow = (data) => {
        if(data) {
            setQuestionData(data);
            setShow(true);
        }
        return false;
    }

    const sumbitAnswer = () => {
        const params = {
            id: questionData.id,
            answer: answer
        }
        axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/sumbitAnswer` : `${process.env.REACT_APP_LOCAL_API_URL}/sumbitAnswer`, params, apiConfig)
        .then((response) => {
            if(response.data.success){
                fetchAskedQuestionsData();
                setShow(false);
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    useEffect(() => {
        fetchAskedQuestionsData();
    },[])  
    return (
        <>
            <Header/>
            <div className="content-wrapper">
                <Modal size="lg" show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>
                            Reply Wtsp No.: {questionData.wtsp_number ? questionData.wtsp_number : 'N/A'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea
                            rows={10}
                            className='form-control'
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={sumbitAnswer}>Submit</Button>
                    </Modal.Footer>
                </Modal>
                {/* Content Header (Page header) */}
                <section className="content-header">
                    <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                        <h1>Questions</h1>
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
                            <h3 className="card-title">Questions List</h3>
                            </div>
                            {/* /.card-header */}
                            <div className="card-body">
                            <table id="example4" className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>WhatsApp Number</th>
                                        <th>View User</th>
                                        <th>Question</th>
                                        <th>Answer</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(questions && questions.length > 0) ? questions.map((question, index) => (
                                        <tr>
                                            <td> {question.wtsp_number ? question.wtsp_number : 'N/A'} </td>
                                            <td> 
                                                <Link to={`/user-details/${question.user_id}`}>
                                                    <i className='fa fa-eye'></i>
                                                </Link>
                                            </td>
                                            <td> {question.question ? question.question : 'N/A'} </td>
                                            <td> 
                                                {question && !question.answer ? (
                                                <span onClick={()=>handleShow(question)}>
                                                    <span className='badge badge-primary cursor-pointer'><i class="fa fa-reply"></i></span>
                                                </span>) : question.answer}
                                            </td>
                                            <td> 
                                                {question.status ?
                                                    <span className='badge badge-danger text-bold cursor-pointer' onClick={()=>{changeQuestionStatus(question.id, question.status)}}>
                                                        Click to In-Active
                                                    </span> :
                                                    <span className='badge badge-success text-bold cursor-pointer' onClick={()=>{changeQuestionStatus(question.id, question.status)}}>
                                                        Click to Active
                                                    </span> 
                                                }   
                                            </td>
                                        </tr>
                                    )) : 
                                        <tr>
                                            <td colSpan={5}>
                                                No questions
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>WhatsApp Number</th>
                                        <th>View User</th>
                                        <th>Question</th>
                                        <th>Answer</th>
                                        <th>Status</th>
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
