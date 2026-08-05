import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector,useAppDispatch } from '../store/hooks';
import { setSearchQuery } from '../store/slices/productSlice';

export const Header:React.FC = () => {
    const dispatch = useAppDispatch();
    const { searchQuery } = useAppSelector((state) => state.products);
    const { isAuthenticated,currentUser } = useAppSelector((state) => state.auth );

    return(
        <header>
            <div>
                {/* MegaMart Logo */}
                <Link to="/">
                    MegaMart
                </Link>

                {/* Search Bar */}
                <div>
                    <div>
                        <span>
                            <i></i>
                        </span>
                        <input
                            type="text"
                            placeholder="Search essentials,groceries..."
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        />
                    </div>
                </div>
                {/* Sign In/ User Profile */}
                <div>
                    {isAuthenticated ? (
                        <Link to="/orders">
                            <i></i>{currentUser?.email}
                        </Link>
                    ):(
                        <Link to="/login">
                            <i></i>Sign In/Up
                        </Link>
                    )}

                    <Link to="/cart">
                        <i></i>Cart 
                    </Link>
                </div>
            </div>
        </header>
    );
};