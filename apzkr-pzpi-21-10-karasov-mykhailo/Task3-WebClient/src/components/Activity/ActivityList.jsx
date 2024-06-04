import React from 'react';
import ActivityListItem from "./ActivityListItem";
import {Row} from "react-bootstrap";

const ActivityList = ({ activities, onDelete }) => {
    return (
        <Row className={"mp-3 h-100"}>
            { activities.map(activity => (
                < ActivityListItem activity={activity} onDelete={onDelete} />
            )) }
        </Row>
    );
};

export default ActivityList;