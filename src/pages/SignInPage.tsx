import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useAppDispatch } from '../store/hooks'
import { setUser } from '../store/slices/authSlice';


export const SignInPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Local form state
    const [email,setEmail] = useState<string>('');
    const [password,setPassword] = useState<string>('');
    const [error,setError]  = useState<string | null >(null);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // if (!email || !password) {
        //     setError('Please fill in all fields.');
        //     return;
        // }

        if(!email.trim() || !password.trim()){
            setError('Please enter both email and password.');
            return;
        }

        // Dispatch the user detailst to your authSlice
        dispatch(
            setUser({
                id:1,
                name:email.trim().split('@')[0],
                email:email.trim(),
                role:'Customer'
            })
        );

        // Redirect to home catalog after sucessful sign-in
        navigate('/');
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-light">
            <Header />

            <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div
                    className="card shadow-sm border-0 p-4 p-md-5 bg-white"
                    style = {{ maxWidth:'400px', width: '100%'}}
                >
                    {/* Card Header */}
                    <div className="text-center mb-4">
                        <h5 className="text-primary fw-bold mb-1">MegaMart</h5>
                        <h4 className="fw-bold text-dark mb-1">Welcome Back!</h4>
                        <p className="text-muted small">Sign In to continue your account</p>
                    </div>

                    {/* Validation Feedback */}
                    {error && (
                        <div className="alert alert-danger py-2 small" role="alert">
                            {error}
                        </div>
                    )}

                    {/* Login In Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="mb-3">
                            <label className="form-label small fw-semibold text-muted" htmlFor="loginEmail">
                                Email Address
                            </label>

                            <input
                                id = "loginEmail"
                                type= "email"
                                className= "form-control form-control-sm"
                                placeholder= "user@example.com"
                                value={email}
                                onChange = {(e) => setEmail(e.target.value)}
                                required
                            />    
                        </div>

                        {/* Password Field */}
                        <div className="mb-2">
                            <label className="form-label small fw-semibold text-muted" htmlFor="loginPassword">
                                Password
                            </label>
                            <input
                                id="loginPassword"
                                type="password"
                                className = "form-control form-control-sm"
                                placeholder="••••••••••••"
                                value={password}
                               onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-end mb-4">
                            <a href="#" className="text-decoration-none small text-muted">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className = "btn btn-primary w-100 fw-semibold py-2 text-uppercase"
                        >
                            Sign In
                        </button>
                    </form>    

                    {/* Redirect to registration */}
                    <div className = "text-center mt-4 pt-3 border-top">
                        <span className="small text-muted">Don't have an account?</span>
                        <Link
                            to="/register"
                            className= "small text-primary fw-semibold text-decoration-none">
                            Sign Up
                        </Link>
                    </div>
                </div>        
            </main>

            <Footer />

        </div>
    );
};