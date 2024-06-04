import React from 'react';
import {useTranslation} from "react-i18next";

const SmallWorkerItem = ({ worker, children }) => {
    const { t } = useTranslation();

    return (
        <div className={"p-3 border mt-3 d-flex align-items-center justify-content-between"}>
            <div>
                <img
                    className={"rounded-circle"}
                    style={{height: "100px", width: "100px"}}
                    src={process.env.REACT_APP_API_URL + worker.userImage}
                    alt={"Error while loading photo"}
                />
            </div>
            <div>
                <p className="mb-0"><strong>Email:</strong> {worker.email}</p>
            </div>
            <div>
                <p className="mb-0"><strong>{t('name')}:</strong> {worker.firstName}</p>
                <p className="mb-0"><strong>{t('surname')}:</strong> {worker.secondName}</p>
            </div>
            <div>
                {children}
            </div>
        </div>

    );
};

export default SmallWorkerItem;