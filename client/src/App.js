import React from 'react';
import logo from './logo.svg';
import './App.css';
import API from "./api/API";
import ExamsGridView from "./components/ExamsGridView";
import ExamDetailsView from "./components/ExamDetailsView";
import CreateExamView from "./components/CreateExamView";
import {Redirect, Route, Link, BrowserRouter} from 'react-router-dom';
import {Switch} from 'react-router';
import Container from "@material-ui/core/Container";
import Login from "./components/Login";
import {LoggedInUserContext} from "./auth/LoggedInUserContext";
import CssBaseline from "@material-ui/core/CssBaseline";
import Header from "./components/Header";
import { withRouter } from 'react-router-dom';
import { StylesProvider } from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { styled } from '@material-ui/core/styles';
import ExamBooking from "./api/ExamBooking";
import ExamMarking from "./api/ExamMarking";
const MyContainer = styled(Container)({
    border: 0,
    height: '100%',
    color: 'black',
    borderRadius: '4px',
    background: '#fff',
    boxShadow: '0 6px 10px rgba(0,0,0,.08), 0 0 6px rgba(0,0,0,.05)',
    padding: '14px 80px 18px 36px',
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {didLoad: false, exams: null, exam: null, students: null, columnCount: 0, isTeacher: false,location:'Login'};
        /*
        this.getExams(97824,1);
        this.getExam(9,1);
        this.getCourseStudents("01TXYOV");
         */

    }
    componentDidMount() {
        console.log("checking authintication");
        API.isAuthenticated().then(
            (user) => {
                this.setState({authUser: user, isTeacher: true,didLoad:true});
                this.getExams(user.username,true)
            }
        ).catch((err) => {
            this.setState({authErr: err.errorObj,didLoad:true});
            this.props.history.push("/login");
        });

    }
    getCourseStudents = (cid) => {
        API.getStudents(this.state.authUser.course)
            .then((students) => {
                this.setState({students: students});
                console.log(students);
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });
    }
    getExams = (username, mode) => {
        // we don't use the user id if it's a teacher because it's already in the cookies
        //const uid = username === undefined ? this.state.authUser.mode === 0 ? this.state.authUser.username : this.state.authUser.sid : username
        //const mod2 = this.state.authUser.type === 0;
        API.getExams(username, mode)
            .then((exams) => {
                if (exams.length !== 0)this.setState({exams: exams})
                this.setState({didLoad:true});
            })
            .catch((errorObj) => {
                this.handleErrors(errorObj);
            });

    }
    getExam = (examId, mode) => {
        if (this.state.authUser) {
            API.getExam(examId, mode)
                .then((exam) => {
                    console.log(`getExam`);
                    console.log(exam);

                    const columnCount = exam.sessions.length + (this.state.authUser.mode === 0 ? 1 : 0)
                    this.setState({exam: exam, columnCount: columnCount,didLoad:true,location:exam.name})
                })
                .catch((errorObj) => {
                    this.handleErrors(errorObj);
                });
        }
    }
    bookExam = (booking, sid, mode) => {
        API.bookingExam(booking).then((response) => {
            this.getExams(sid, false);
            //todo don't request info based on response update current info/ or maybe not
        }).catch((errorObj) => {
            this.handleErrors(errorObj);
        });
    }
    createExam = (exam) => {
        API.createExam(exam).then((response) => {

            this.getExams(this.state.authUser.username,true);
            //todo don't request info based on response update current info/ or maybe not
        }).catch((errorObj) => {
            this.handleErrors(errorObj);
        });
    }
    markExam = (mark, examID) => {
        return new Promise((resolve, reject) => {
            API.markStudent(mark).then((response) => {
                console.log(`marking and id = ${examID}`);
                this.getExam(examID,true)
                //todo don't request info based on response update current info/ or maybe not
            }).catch((errorObj) => {
                this.handleErrors(errorObj);
            });
        });
    }
    logout = () => {
        if(this.state.authUser.mode ===0) {
            API.userLogout().then(() => {
                this.setState({authUser: null, authErr: null, exams: [], exam: null, students: [], columnCount: 0, isTeacher: false,didLoad:true});
            });
        }else{
            this.setState({authUser: null, authErr: null, exams: [], exam: null, students: [], columnCount: 0, isTeacher: false,didLoad:true});
        }
        this.props.history.push("/login");
    }

    // Add a login method
    login = (username, password, mode) => {
        console.log("APPP");
        console.log(username);
        API.userLogin(username, password, mode ? 0 : 1).then(
            (user) => {
                console.log(mode);
                console.log(user);
                this.setState({authUser: user, authErr: null, isTeacher: mode,didLoad:true});
                this.getExams(username, mode)
                this.props.history.push("/exams");
            }
        ).catch(
            (errorObj) => {
                const err = errorObj.errors[0];
                this.setState({authErr: errorObj});
            }
        );
    }
    handleErrors(err) {
        if (err) {
            if (err.status && err.status === 401) {
                this.setState({authErr: err.errorObj});
                this.props.history.push("/login");
            }
        }
    }

    render() {
        const value = {
            authUser: this.state.authUser,
            authErr: this.state.authErr,
            loginUser: this.login,
            logoutUser: this.logout
        }

        return (

            <LoggedInUserContext.Provider value={value}>
                <StylesProvider injectFirst>

                <Header location={this.state.location}/>
                {this.state.didLoad ? <div><MyContainer fluid className='container' >
                    <Switch>

                        <Route exact path='/login'>
                            <Login setTitle={this.setTitle}/>
                        </Route>
                        <Route path="/exams">

                            <ExamsGridView isTeacher={this.state.isTeacher} user={this.state.authUser}
                                           booking={this.bookExam} exams={this.state.exams} getExams={this.getExams} setTitle={this.setTitle}/>
                        </Route>

                        <Route path="/new-exam">

                            <CreateExamView isTeacher={this.state.isTeacher} studentList={this.state.students}
                                            user={this.state.authUser} getStudentList={this.getCourseStudents}
                                            createExam={this.createExam} setTitle={this.setTitle}/>
                        </Route>
                        <Route path='/exam'>

                            <Switch>
                                <Route path='/exam/id/:id/reservation/:esid' render={(props) => {
                                    console.log("in app route");
                                    console.log(props.match.params.esid)
                                    return (
                                        <ExamDetailsView isTeacher={this.state.isTeacher}
                                                         columnCount={this.state.columnCount}
                                                         esid={props.match.params.esid}
                                                         examID={props.match.params.id} user={this.state.authUser}
                                                         markOrBook={this.state.isTeacher ? this.markExam : this.bookExam}
                                                         exam={this.state.exam} getExam={this.getExam} setTitle={this.setTitle}/>
                                    )
                                }}/>
                                <Route path='/exam/id/:id' render={(props) => {
                                    return (

                                        <ExamDetailsView isTeacher={this.state.isTeacher}
                                                         columnCount={this.state.columnCount}
                                                         examID={props.match.params.id} user={this.state.authUser}
                                                         markOrBook={this.state.isTeacher ? this.markExam : this.bookExam}
                                                         exam={this.state.exam} getExam={this.getExam} setTitle={this.setTitle}/>
                                    )
                                }}/>
                            </Switch>
                        </Route>


                        <Route>
                            <Redirect to='/exams'/>
                        </Route>
                    </Switch>


                </MyContainer></div> :
                    <Backdrop open={!this.state.didLoad}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                }

                </StylesProvider>
            </LoggedInUserContext.Provider>


        );
    }
    setTitle = (title)=>{
        this.setState({location:title});
    }

}

export default withRouter(App);