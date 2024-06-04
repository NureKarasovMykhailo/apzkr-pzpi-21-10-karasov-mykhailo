import React from 'react';
import {Row} from "react-bootstrap";
import ScannerItemList from "./ScannerItemList";

const ScannerList = ({ scanners, onDelete }) => {
    return (
        <Row className={"p-3"}>
            { scanners.map(scanner => (
                <ScannerItemList scanner={scanner} onDelete={onDelete} />
            )) }
        </Row>
    );
};

export default ScannerList;