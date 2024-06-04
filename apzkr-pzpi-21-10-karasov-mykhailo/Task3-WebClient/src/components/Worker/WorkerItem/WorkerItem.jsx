import React from 'react';
import { Container, Image, ListGroup } from "react-bootstrap";
import { calculateAge } from "../../../utils/calculateAge";
import { useTranslation } from "react-i18next";

const WorkerItem = ({ worker, educations }) => {

    const { t } = useTranslation();

    return (
        <Container className="w-100 mt-3 mb-3 p-4">
            <div className="w-100 d-flex align-items-center justify-content-between">
                <div className="w-100">
                    <Image width={250} src={process.env.REACT_APP_API_URL + worker.userImage} />
                </div>
                <div className="w-100 text-lg" style={{ fontSize: "22px" }}>
                    <p className="bg-body">{t('userData')}</p>
                    <p>{t('emailAddress')}: {worker.email}</p>
                    <p>{t('secondName')}: {worker.secondName}</p>
                    <p>{t('firstName')}: {worker.firstName}</p>
                    <p>{t('birthday')}: {worker.birthday}</p>
                    <p>{t('age')}: {calculateAge(worker.birthday)}</p>
                </div>
                <div className="w-100" style={{ fontSize: "22px" }}>
                    <p>{t('educations')}:</p>
                    {educations.length > 0
                        ? <div>
                            <ListGroup as="ul">
                                {educations.map(education => (
                                    <ListGroup.Item
                                        key={education.educationTitle}
                                        as="li"
                                        className="mb-3"
                                    >
                                        {education.educationTitle}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                        : <div>
                            <p>{t('noEducations')}</p>
                        </div>
                    }
                </div>
            </div>
        </Container>
    );
};

export default WorkerItem;
