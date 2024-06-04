import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {hasUserRole} from "../../../utils/hasUserRole";
import {getRoleTitles} from "../../../utils/getRoleTitles";
import {RoleEnum} from "../../../utils/enums/RoleEnum";
import {Button, Card} from "react-bootstrap";
import {useTranslation} from "react-i18next";

const WorkerList = observer(({ workers, onDelete }) => {
    const { userStore } = useContext(Context);
    const { t } = useTranslation();
    const isUserAdmin = hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN, RoleEnum.ADMIN]);

    return (
        workers.length > 0 ?
            <div>
                {workers.map(worker => (
                    <Card key={worker.id} className="mt-3">
                        <Card.Header>{worker.email}</Card.Header>
                        <Card.Body>
                            <Card.Title>{`${worker.firstName} ${worker.secondName}`}</Card.Title>
                            <Card.Text>
                                <img
                                    src={process.env.REACT_APP_API_URL + worker.userImage}
                                    className={"rounded-circle"}
                                    alt="User Avatar" style={{ width: '150px', height: '150px' }}
                                />
                            </Card.Text>
                            { isUserAdmin &&
                                <div className={'w-100 d-flex justify-content-end'}>
                                    <Button
                                        variant={"danger"}
                                        onClick={() => onDelete(worker.id)}
                                    >
                                        Видалити
                                    </Button>
                                </div>
                            }
                        </Card.Body>
                    </Card>
                ))}
            </div>
            :
            <div className={"mt-3 mb-3 w-100 d-flex flex-column align-items-center justify-content-center"}>
                <strong>За даною активностю, не закрпілені робітники</strong>
            </div>
    );
});

export default WorkerList;