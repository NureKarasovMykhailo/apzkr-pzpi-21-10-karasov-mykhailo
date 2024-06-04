import React from 'react';
import {Button, Card, Col} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {deleteScanner} from "../../API/scannerApi";
import {useNavigate} from "react-router-dom";
import {ONE_SCANNER_PAGE} from "../../utils/consts";

const ScannerItemList = ({ scanner, onDelete }) => {
    const { t } = useTranslation();
    const navigation = useNavigate();

    const handleDeleteScanner = async () => {
        try {
            await deleteScanner(scanner.id);
            onDelete(true);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Col md={3}>
            <Card className={"p-2 mb-3"}>
                <p>{t('scannerId')}: {scanner.id}</p>
                <p>{t('description')}: {scanner.description}</p>
                <hr />
                <Button
                    className={"mb-2"}
                    variant={"outline-primary"}
                    onClick={() => navigation(ONE_SCANNER_PAGE.replace(':id', scanner.id))}
                >
                    {t('seeDetailButton')}
                </Button>
                <Button
                    variant={"outline-danger"}
                    onClick={handleDeleteScanner}
                >
                    {t('deleteButton')}
                </Button>
            </Card>
        </Col>
    );
};

export default ScannerItemList;