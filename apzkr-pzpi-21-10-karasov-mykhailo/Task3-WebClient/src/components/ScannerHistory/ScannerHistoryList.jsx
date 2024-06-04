import React, {useContext} from 'react';
import {Button, Container, Table} from "react-bootstrap";
import {formatTime} from "../../utils/formatTime";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {hasUserRole} from "../../utils/hasUserRole";
import {getRoleTitles} from "../../utils/getRoleTitles";
import {RoleEnum} from "../../utils/enums/RoleEnum";
import {deleteScannerHistoryById} from "../../API/scannerHistoryApi";

const ScannerHistoryList = observer(({ scannerHistories, showUser, onUpdate, children }) => {
    const { t } = useTranslation();
    const { userStore } = useContext(Context);

    const handleDeleteScannerHistory = async (scannerHistoryId) => {
        try {
            await deleteScannerHistoryById(scannerHistoryId);
            onUpdate(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        scannerHistories.length > 0  ?
                <Table striped bordered hover className={"mt-3"}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>{t('pulse')}</th>
                        <th>{t('workingTimeBeforeScanning')}</th>
                        <th>{t('temperature')}</th>
                        {showUser && <th>{t('worker')}</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {scannerHistories.map((history, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{history.pulse} {t('beatsPerMinute')}</td>
                            <td>{formatTime(history.activeWorkedTime) || '-'}</td>
                            <td>{history.temperature} °C</td>
                            <td className={"d-flex align-items-center"}>
                                <img
                                    src={process.env.REACT_APP_API_URL + history.user.userImage}
                                    alt={"Image not found"}
                                    className={"rounded-circle m-2"}
                                    style={{width: '50px', height: '50px'}}
                                />
                                <p>{history.user.email}</p>
                            </td>
                            { hasUserRole(getRoleTitles(userStore.user.roles), [RoleEnum.SUBSCRIBER, RoleEnum.COMPANY_ADMIN]) &&
                                <td className={""}>
                                    <Button
                                        className={"m-2"}
                                        variant={"danger"}
                                        onClick={() => handleDeleteScannerHistory(history.id)}
                                    >
                                        {t('deleteButton')}
                                    </Button>
                                </td>
                            }
                        </tr>
                    ))}
                    </tbody>
                </Table>
                :
                <Container
                    className={"d-flex justify-content-center align-items-center mt-5"}
                >
                    <strong>{t('noInfoFromScanner')}</strong>
                </Container>

    );
});

export default ScannerHistoryList;