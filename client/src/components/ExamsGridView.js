import React from 'react';
import GridListTile from "@material-ui/core/GridListTile";
import GridList from "@material-ui/core/GridList";
import ExamCardView from "./ExamCardView";
import API from "../api/API";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import {LoggedInUserContext} from "../auth/LoggedInUserContext";
import {Redirect} from 'react-router-dom';
import styled from "@material-ui/core/styles/styled";
const MyGridList = styled(GridList)({
    background: 'transparent',
    alignSelf:'center',
    alignContent: 'center',
    borderRadius: 0,
    color: 'red',
    padding: 'normal',
    margin: 'auto',
    height:'auto',
});
const Myfab = styled(Fab)({
    position:'absolute',
    right: 0,
    bottom: 0,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'black',
    backgroundColor: '#00bcd4',
    margin: '0 1.5rem 1.5rem 0',
});
class ExamsGridView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {exams: [], didLoad: false,newExam:false};
        this.props.setTitle('My Exam');
    }

    componentDidMount() {
        console.log("this.props.user")
        console.log(this.props.user)
        console.log(this.props.exams)

        if(this.props.user){
            const uid = this.props.user.type === 0 ? this.props.user.username:this.props.user.sid
            this.props.getExams(uid,this.props.user.type === 0)
        }
        if(this.props.exams===null)this.props.getExams()
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <LoggedInUserContext.Consumer>
                {(context) => (
                    <>
                        {console.log(context.authUser)}
                        {(context.authErr|| !context.authUser) && <Redirect to = "/login"></Redirect>}
                        {this.state.newExam && <Redirect to="/new-exam"/>}
                        {

                                this.props.exams && <div>
                                    <MyGridList cellHeight={'auto'} className=".gridview" cols={this.props.exams.length < 4?this.props.exams.length:3 }>
                                        {
                                            this.props.exams.map((exam) => <GridListTile key={`${exam.id}`} cols={1}><ExamCardView exam={exam} isTeacher={this.props.isTeacher} booking={this.props.booking}/></GridListTile>)
                                        }
                                    </MyGridList>

                                    {
                                        // could have used link but at this point i don't wanna break anything
                                        this.props.isTeacher?<Myfab className="fixed-right-bottom" onClick={() => this.setState({newExam:true})}><AddIcon/></Myfab>:false
                                    }
                                </div>

                        }
                    </>
                )}
            </LoggedInUserContext.Consumer>

        );
    }
}
export default ExamsGridView;


/*


                                <Backdrop style={{color: '#fff'}} open={!this.state.didLoad}>
                                    <CircularProgress color="inherit"/>
                                </Backdrop>
 */
