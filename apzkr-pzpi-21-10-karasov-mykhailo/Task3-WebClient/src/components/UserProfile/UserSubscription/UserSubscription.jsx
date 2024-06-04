import React, {useEffect, useState} from 'react';
import {Button, Container} from "react-bootstrap";
import {subscribeRequest} from "../../../API/userApi";
import Loader from "../../UI/Loader/Loader";
import {fetchSubscribe} from "../../../API/subscribeApi";
import {useTranslation} from "react-i18next";

const UserSubscription = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [subscribe, setSubscribe] = useState({});
    const { t } = useTranslation();

    const handleSubscribeBtnClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await subscribeRequest();
            if (response.links) {
                window.location.href = response.links[0].href;
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        fetchSubscribe(user.id).then(response => {
            setSubscribe(response);
            console.log(subscribe)
        });
    }, []);


    return (
        isLoading ?
            <Container className={"w-100 h-100 border " } style={{minHeight: "250px"}}>
                <Loader />
            </Container>
            :
            <Container className={"w-100 h-100 border "}>
                <div className="w-100 d-flex justify-content-center p-3">
                    <h2>{t('subscribe')}</h2>
                </div>
                {subscribe ?
                    <div>
                        <div>
                            <p>{t('subscribeStatus')}: { subscribe.isValid ? <b>{t('active')}</b> : <b>{t('dontActive')}</b> }</p>
                        </div>
                    </div>
                    :
                    <div className={"d-flex flex-column align-items-center p-4"}>
                        <div className={"w-100 d-flex justify-content-center align-items-center"}>
                            <p className={"m-3 fs-5"}>{t('noSubscribe')}</p>
                        </div>
                        <div>
                            <Button
                                className={"m-3"}
                                variant={"primary"}
                                onClick={handleSubscribeBtnClick}
                            >
                                {t('makeSubscribe')}
                            </Button>
                        </div>
                    </div>
                }
            </Container>
    );
}

export default UserSubscription;