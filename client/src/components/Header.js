import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Link, NavLink} from 'react-router-dom';
import {LoggedInUserContext} from "../auth/LoggedInUserContext";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {styled} from "@material-ui/core/styles";

const StyledButton = styled(Button)({
    border: '2px',
    borderColor:'black',
    textAlign:'center',
    borderRadius: '4px',
    backgroundColor: '#00bcd4',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    padding: '7px 14px',
});
const Header = (props) => {

    return (
        <LoggedInUserContext.Consumer>
            {(context) => (


                <AppBar position="static">
                    <Toolbar>
                        <Grid
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Link to={'/exams'}><StyledButton variant="outlined">My exams</StyledButton></Link>

                            <Typography variant="h6">
                                {props.location}
                            </Typography>


                                {context.authUser &&
                                <>
                                    <Typography variant="h4">
                                        Welcome {context.authUser.mode === 0 ? context.authUser.username : context.authUser.name}!
                                    </Typography>
                                    <Button onClick={() => {
                                        context.logoutUser()
                                    }}>Logout</Button>
                                </>}

                                {!context.authUser &&
                                <Link to={'/exams'}><StyledButton variant="outlined">Login</StyledButton></Link>}

                        </Grid>
                    </Toolbar>
                </AppBar>

            )}
        </LoggedInUserContext.Consumer>
    );
}

export default Header;
