import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import Cookie from "js-cookie";
import "./Navbar.css"; // We'll create this CSS file

class Navbar extends Component {
    state = {
        loggedOut: false,
        isMenuOpen: false,
    };

    handleLogout = () => {
        Cookie.remove("jwt_token");
        this.setState({ loggedOut: true });
    };

    toggleMenu = () => {
        this.setState(prevState => ({ isMenuOpen: !prevState.isMenuOpen }));
    };

    render() {
        if (this.state.loggedOut) {
            return <Navigate to="/login" replace />;
        }

        const isLoggedIn = Cookie.get("jwt_token") !== undefined;
        const userInfo = JSON.parse(localStorage.getItem("user_info") || "null");
        const role = userInfo?.role || "USER";

        return (
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        <img
                            src="https://res.cloudinary.com/dasm9k1z9/image/upload/v1755321852/WhatsApp_Image_2025-08-15_at_09.37.55_d1af3ebe_c55vgs.jpg"
                            alt="Logo"
                        />
                        <span>FreshMart</span>
                    </Link>

                    <div className={`nav-menu ${this.state.isMenuOpen ? "active" : ""}`}>
                        {!isLoggedIn && (
                            <div className="nav-item">
                                <Link to="/login" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                    Login
                                </Link>
                            </div>
                        )}
                        {isLoggedIn && (
                            <>
                                <div className="nav-item">
                                    <Link to="/" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                        Home
                                    </Link>
                                </div>
                                <div className="nav-item">
                                    <Link to="/cart" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                        <span className="cart-icon">🛒</span> Cart
                                        {this.props.cartCount > 0 && (
                                            <span className="cart-count">{this.props.cartCount}</span>
                                        )}
                                    </Link>
                                </div>
                                {role === "ADMIN" && (
                                    <>
                                        <div className="nav-item">
                                            <Link to="/admin" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                                Products
                                            </Link>
                                        </div>
                                        <div className="nav-item">
                                            <Link to="/admin/categories" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                                Categories
                                            </Link>
                                        </div>
                                        <div className="nav-item">
                                            <Link to="/admin/orders" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                                Orders
                                            </Link>
                                        </div>
                                    </>
                                )}
                                {role === "DELIVERY" && (
                                    <div className="nav-item">
                                        <Link to="/delivery" className="nav-link" onClick={() => this.setState({ isMenuOpen: false })}>
                                            Delivery Portal
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="nav-right">
                        {isLoggedIn && (
                            <button
                                onClick={this.handleLogout}
                                className="logout-btn"
                            >
                                Logout
                            </button>
                        )}
                        <div className="hamburger" onClick={this.toggleMenu}>
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;