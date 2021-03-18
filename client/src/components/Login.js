import React from 'react';
import {Redirect} from 'react-router-dom';
import {LoggedInUserContext} from '../auth/LoggedInUserContext'
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Alert from "@material-ui/lab/Alert";
import {Typography} from "@material-ui/core";
import {styled} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
const MyContainer = styled(Container)({
    border: 0,
    textAlign:'center',
    height: '100%',
    color: 'black',
    borderRadius: '4px',
    background: '#fff',
    boxShadow: '0 6px 10px rgba(0,0,0,.08), 0 0 6px rgba(0,0,0,.05)',
    padding: '14px 80px 18px 36px',
});
const StyledButton = styled(Button)({
    border: '2px',
    borderColor:'black',
    textAlign:'center',
    color: 'black',
    borderRadius: '4px',
    backgroundColor: '#6772e5',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    padding: '7px 14px',
});


class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {username: '', password: '', submitted: false,checked:true};
       /*
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        */
        this.props.setTitle('Login');

    }

    onChangeUsername = (event) => {
        this.setState({username : event.target.value});
    };

    onChangePassword = (event) => {
        this.setState({password : event.target.value});
    };
    onSwitchClick = ()=>{
        this.setState({checked:!this.state.checked,username:'',password:''})
    }
    handleSubmit = (event, onLogin) => {
        event.preventDefault();
        console.log(`aaaaaaaa ${this.state.username},${this.state.password},${this.state.checked}`)
        onLogin(this.state.username,this.state.password,this.state.checked);
        this.setState({submitted : true});
    }

    render() {
       if (this.state.submitted)return <Redirect to='/exams'/>;
        return (
            <LoggedInUserContext.Consumer>
                {(context) => (

                    <MyContainer fluid>
                        {(context.authUser) && <Redirect to = "/exams"/>}
                        <div style={{ padding: 20}}>
                        <Grid direction="column" justify="space-evenly" alignItems="center" container spacing={1} >
                            <Typography variant="h3">Log In to Your account</Typography>

                                <Grid container
                                        direction="row"
                                      justify="center"
                                        alignItems="center" spacing={1}>

                                        <Typography variant="h6">{this.state.checked?'Teacher:':'Student:'}</Typography>

                                        <Switch
                                            checked={this.state.checked}
                                            onChange={()=>this.onSwitchClick()}
                                            color="primary"
                                            name="checkedB"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />

                                </Grid>


                            <form onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                                <Grid direction="column" justify="space-between" alignItems="center" container spacing={1}>

                                    <TextField required={true} id="filled-basic" type={'text'} value={this.state.username} label={this.state.checked  ? 'Teacher ID':'Student Number'} variant="filled" onChange={(ev)=>this.onChangeUsername(ev)}/>

                                    {this.state.checked && <TextField id="filled-basic" required={this.state.checked} value={this.state.password} type={'password'} label="Password" variant="filled" onChange={(ev)=>this.onChangePassword(ev)}/>}

                                    <StyledButton type='submit'>Login</StyledButton>
                                </Grid>
                            </form>

                            {context.authErr && <Alert severity="error">{context.authErr.errors[0].msg}</Alert>}
                        </Grid>
                        </div>

                    </MyContainer>
                )}
            </LoggedInUserContext.Consumer>
        );
    }



}

export default LoginForm;



/*
        {context.authErr &&
        <Alert variant= "danger">
            {context.authErr.msg}
        </Alert>
        }
                                            <Form method="POST" onSubmit={(event) => this.handleSubmit(event, context.loginUser)}>
                                        <Form.Group controlId="username">
                                            <Form.Label>E-mail</Form.Label>
                                            <Form.Control type="email" name="email" placeholder="E-mail" value = {this.state.username} onChange={(ev) => this.onChangeUsername(ev)} required autoFocus/>
                                        </Form.Group>

                                        <Form.Group controlId="password">
                                            <Form.Label>Password</Form.Label>
                                            <TextField type="password" name="password" placeholder="Password" value = {this.state.password} onChange={(ev) => this.onChangePassword(ev)} required/>
                                        </Form.Group>

                                        <Button variant="primary" type="submit">Login</Button>

                                    </Form>
        */