import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector,useAppDispatch } from '../store/hooks';
import { setSearchQuery } from '../store/slices/productSlice';
import { logout } from '../store/slices/authSlice';

export const Header:React.FC = () => {
    const dispatch = useAppDispatch();
    const { searchQuery } = useAppSelector((state) => state.products);
    const { isAuthenticated,currentUser } = useAppSelector((state) => state.auth );



    const handleLogout = () => {
        // 1. Clear token from the local storage
        localStorage.removeItem('token');
        // 2. Clear user state in Redux
        dispatch(logout());

        // 3. Redirect to sign-in or home page
        navigate('/signin');
    };

    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter'){
            navigate('/products'); // Jump to the products page on Enter key press
        }
    }


    return(
        <header className="bg-white border-bottom sticky-top py-2 shadow-sm">
            <div className="container d-flex align-items-center justify-content-between gap-3">
                {/* MegaMart Logo */}
                <Link to="/" className="navbar-brand fw-bold text-primary fs-3 m-0">
                    MegaMart
                </Link>

                {/* Search Bar */}
                <div className="flex-grow-1" style={{maxWidth:'600px'}}>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                            <i className="bi bi-search text-body-secondary"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control bg-light border-0 shadow-none"
                            placeholder="Search essentials,groceries..."
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                {/* Sign In/ User Profile */}
                <div className="d-flex align-items-center gap-3">
                    {isAuthenticated && currentUser ?
                        // (
                        //     <Link to="/orders" className="text-decoration-none text-dark fw-semibold">
                        //         <i className="bi bi-person-circle fs-5 me-1"></i>{currentUser?.email}
                        //     </Link>
                        // )
                        <div className="dropdown">
                            {/* Email acts as the dropdown button */}
                            <button
                                className="btn btn-link text-decoration-none text-dark fw-semibold dropdown-toggle p-0 border-0 bg-transparent"
                                type="button"
                                id="userDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-person-circle fs-5 me-1"></i>
                                {currentUser?.email}
                            </button>

                            {/* Dropdown Menu */}
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
                                <li>
                                    <Link className="dropdown-item small fw-semibold" to="/orders">
                                        <i className="bi bi-box-seam me-2"></i> My Orders
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger small d-flex align-items-center fw-semibold"
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                                    </button>
                                </li>
                            </ul>
                        </div>
                        :
                        (
                        <Link to="/signin" className="btn btn-outline-primary fw-semibold rounded-pill px-3">
                            <i></i>Sign In/Up
                        </Link>
                    )}

                    <Link to="/cart" className="btn btn-primary text-white rounded-pill px-3">
                        <i className="bi bi-cart3 me-1"></i>Cart 
                    </Link>
                </div>
            </div>
        </header>
    );
};