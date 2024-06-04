import React from 'react';
import {Nav} from "react-bootstrap";
import '../../styles/AdminNavigation.css';

const AdminNavigation = ({ links, onSelectEntity }) => {
    return (
        <Nav className="flex-column admin-navigation">
            {links.map((link, index) => (
                <Nav.Item key={index}>
                    <Nav.Link
                        className={"text-light admin-navigation-link"}
                        href={link.url}
                        onClick={() => onSelectEntity(link.entity)}
                    >
                        {link.label}
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
};

export default AdminNavigation;