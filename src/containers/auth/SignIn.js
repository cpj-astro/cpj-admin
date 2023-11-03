import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function SignIn() {
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate();
    const auth = getAuth();
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {  
        console.log(data);
        const params = {
            email: data.email,
            password: data.password
        }
        setLoader(true);
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            axios.post(process.env.REACT_APP_DEV === 'true' ? `${process.env.REACT_APP_DEV_API_URL}/login` : `${process.env.REACT_APP_LOCAL_API_URL}/login`, params)
            .then((response) => {
                if(response.status == true) {
                    setLoader(false);
                }
                localStorage.setItem('fb_token', userCredential.user.accessToken);
                localStorage.setItem('auth_token', response.data.access_token);
                localStorage.setItem('header_active', 'home');
                navigate('/');
            }).catch((error) => {
                toast.error(error.code);
                navigate('/login');
            });
        })
        .catch((error) => {
            if(error.code === 'auth/user-not-found'){
                toast.error("Your Email ID is incorrect");
            } else {
                toast.error("Your Password is incorrect");
            }
            setLoader(false);
        });
    }
    return (
        <div className='hold-transition login-page'>
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <span className="h1"><b>CPJ</b>-ADMIN</span>
                    </div>
                    <div className="card-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form method="post" onSubmit={handleSubmit(onSubmit)}>
                        <div className="input-group mb-3">
                        <input type="email" className="form-control" placeholder="Email" required="required" {...register("email")}/>
                        <div className="input-group-append">
                            <div className="input-group-text">
                            <span className="fas fa-envelope" />
                            </div>
                        </div>
                        </div>
                        <div className="input-group mb-3">
                        <input type="password" className="form-control" placeholder="Password" required="required" {...register("password")}/>
                        <div className="input-group-append">
                            <div className="input-group-text">
                            <span className="fas fa-lock" />
                            </div>
                        </div>
                        </div>
                        <div className="row">
                        {/* /.col */}
                            <div className="col-md-12">
                                <button type="submit" className="btn btn-primary btn-block">{loader ? 'Loading...' : 'Sign In'}</button>
                            </div>
                        {/* /.col */}
                        </div>
                    </form>
                    {/* /.social-auth-links */}
                    {/* <p className="mb-1">
                        <a href="forgot-password.html">I forgot my password</a>
                    </p> */}
                    </div>
                    {/* /.card-body */}
                </div>
            </div>
        </div>
    )
}
