import { Alert, Snackbar } from "@mui/material";
import { useContext } from "react";
import useAuth from '../../hooks/useAuth';
import { GlobalContext, MyContextState } from "../../pages/_app";

const MainLayout = ({children}: {children: JSX.Element}) => {
    //Check if the user is logged an if there is in the correct path
    useAuth();
    
    const {myContext, setMyContext} = useContext<MyContextState>(GlobalContext)
    const {open, msg, severity} = myContext.snackbar
    const handleClose = () => {
        setMyContext({...myContext, snackbar: {open: false, severity: 'info', msg: ''}})
    }
    return (
        <>
            {children}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </>
    );
}

export default MainLayout;