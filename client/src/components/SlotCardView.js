import React from 'react';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListControls from "./ListControls";
import ExamMarking from "../api/ExamMarking";
import ExamBooking from "../api/ExamBooking";
import {Redirect} from 'react-router-dom';
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";


class SlotCardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({submitted:false});
        //states here
    }
    componentDidMount() {  }
    componentWillUnmount() {  }

    render() {
        if (this.state.submitted) return <Redirect to='/exams'/>;
        const primaryText = `${this.props.slot.time}${this.props.slot.sid > 0 ? `, ${this.props.slot.sid}` : ''}`;
        const secondaryText = `${this.props.slot.name}`;
        const text = `${this.props.slot.sid > 0 ? `, ${this.props.slot.sid}` : ''}`
        return (
            <ListItem>
                <Card variant="outlined" style={{width:'90%',textAlign:'center'}}>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            {secondaryText}
                        </Typography>
                        <Typography color="textSecondary">
                            {text}
                        </Typography>
                        <Typography variant="body2">
                            {primaryText}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <ListControls mode={this.props.mode} isTeacher={this.props.isTeacher}
                                      actionFunction={this.getDataFromControl}
                                      data={this.props.mode === 3 ? this.props.slot : this.props.slot.score}/>
                    </CardActions>
                </Card>
            </ListItem>
        );

    }
    getDataFromControl = (action)=>{
        console.log(action);
        if(this.props.mode === 3){

            const book = new ExamBooking(this.props.esid,this.props.user.sid,this.props.user.name,this.props.slot.id,this.props.date,this.props.slot.time)
            this.setState({submitted:true});
            this.props.markOrBook(book,this.props.user.sid,false);


        }else {
            const mark = new ExamMarking(this.props.slot.esid,this.props.slot.sid,action,this.props.cid,this.props.slot.id)
            console.log(mark)
            this.props.markOrBook(mark,this.props.examID);
        }
    }

}

export default SlotCardView;

/**
 this.status
 0 = present/absent
 1 = needs a score
 2 = just show score
 3 = free slot to be used with isteacher
 4 = booked slot student show booked sid == 0 only when student requests from server


    todo make five diffrent slots for names  component for control abstent/present mark the score as present then show waiting for score in the student exams page
    todo component for scoring with a drop down and one with score text
*/
