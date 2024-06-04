import AppRouter from "./components/AppRouter";
import {BrowserRouter} from "react-router-dom";
import './styles/App.css';
import Header from "./components/header/Header";
import {observer} from "mobx-react-lite";
import {useContext, useEffect} from "react";
import {Context} from "./index";
import {checkAuth} from "./API/authApi";
import Footer from "./components/footer/Footer";

const App = observer(() => {
    const { userStore } = useContext(Context);

    useEffect(() => {
        const getUserData = async () => {
            try {
                console.log('update')
                const data = await checkAuth();
                userStore.setUser(data);
                userStore.setIsAuth(true);
            } catch (error) {
                userStore.setUser(null);
                userStore.setIsAuth(false);
            }
        }

        getUserData().then();
    }, [userStore, localStorage]);

    return (
        <BrowserRouter >
            <div className={'app__container'} >
                <div className={'app__header-container'}>
                    <Header />
                </div>
                <div className={'app__main-container'}>
                    <AppRouter />
                </div>
                <div className={'app__footer-container'}>
                    <Footer />
                </div>
            </div>
        </BrowserRouter>
      );
});

export default App;
