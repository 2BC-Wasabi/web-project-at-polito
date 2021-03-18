import React from 'react';
import GridList from "@material-ui/core/GridList";
import ListView from "./ListView";
import GridListTile from "@material-ui/core/GridListTile";
import API from "../api/API";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {withRouter} from 'react-router';
import {LoggedInUserContext} from "../auth/LoggedInUserContext";
import {Redirect} from 'react-router-dom';

class ExamDetailsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode: 0, submitted: false,columnCount:0,userToShare:'',exam: {}};


        console.log(this.props.exam);
    }
    componentDidMount() {

        this.props.getExam(this.props.examID,this.props.isTeacher);
        console.log(this.props.exam);

    }
    componentWillUnmount() {  }

    render() {
        return (
            <LoggedInUserContext.Consumer>
                {(context) => (
                    <>
                        {console.log("ontext.authErr")}
                        {context.authErr && <Redirect to = "/login"></Redirect>}
                        {
                                this.props.exam === null? false:
                                <GridList cellHeight={'auto'} cols={this.props.columnCount} spacing={10}>
                                    { this.props.isTeacher? <GridListTile key={"students"} cols={1}><ListView data={this.props.exam.students} title={"Students"} isTeacher={this.props.isTeacher} mode={1} studentMode={0}/></GridListTile> : false}
                                    {this.props.exam.sessions.map((session, index) => <GridListTile key={session.id} cols={1}><ListView data={session} title={`Session ${session.sdate}`} isTeacher={this.props.isTeacher} mode={0} markOrBook={this.props.markOrBook} cid={this.props.exam.cid} esid={this.props.esid} examID={this.props.examID} user={this.props.user}/></GridListTile>)}
                                </GridList>

                        }
                    </>
                )}
            </LoggedInUserContext.Consumer>
        )
    }
}
export default ExamDetailsView;

/*


 */