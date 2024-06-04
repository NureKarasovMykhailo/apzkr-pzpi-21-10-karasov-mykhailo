import React from 'react';
import {Button} from "react-bootstrap";
import {deleteUserEducation} from "../../../../API/userApi";
import {useTranslation} from "react-i18next";

const EducationList = ({ educations, onDeleteSuccess }) => {
    const handleDeleteEducation = async (e) => {
        try {
            const formData = new FormData();
            formData.append('educationTitle', e.target.id);
            const response = await deleteUserEducation(formData);
            onDeleteSuccess(true);

        } catch (error) {
            console.log(error);
        }
    }
    const { t } = useTranslation();

    return (
        <ul>
            <div className={"w-100 d-flex flex-column justify-content-start"}>
                {educations.map(education => (
                    <div className={"m-3 d-flex justify-content-between"}>
                        <li>
                            {education.educationTitle}
                        </li>
                        <div>
                            <Button
                                id={education.educationTitle}
                                variant={"danger"}
                                type={"button"}
                                onClick={handleDeleteEducation}
                            >
                                {t('deleteButton')}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </ul>
    );
};

export default EducationList;