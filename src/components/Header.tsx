import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector,useAppDispatch } from '../store/hooks';
import { setSearchQuery } from '../store/slices/productSlice';

export const Header:React.FC = () => {
    const dispatch = useAppDispatch();
    const { searchQuery } = useAppSelector((state) => state.products);
    const { isAuthenticated,currentUser } = useAppSelector((state) => state.auth );

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
                        />
                    </div>
                </div>
                {/* Sign In/ User Profile */}
                <div className="d-flex align-items-center gap-3">
                    {isAuthenticated ? (
                        <Link to="/orders" className="text-decoration-none text-dark fw-semibold">
                            <i className="bi bi-person-circle fs-5 me-1"></i>{currentUser?.email}
                        </Link>
                    ):(
                        <Link to="/login" className="btn btn-outline-primary fw-semibold rounded-pill px-3">
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