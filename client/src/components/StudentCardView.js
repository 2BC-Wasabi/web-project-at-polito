import React from 'react';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Student from "../api/Student";
import {Card} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import ListControls from "./ListControls";

//
class StudentCardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {mode:this.props.mode ? this.props.mode : 0,checked:false};
    }
    componentDidMount() {  }
    componentWillUnmount() {  }
    handleChange = (event) => {
        if(this.state.checked)this.props.deleteStudent(this.props.student.sid,0);
        else this.props.insertStudent(new Student(this.props.student.sid,this.props.student.sname),0);
        this.setState({checked:event.target.checked});
    };


    render() {
        if(this.state.mode === 1) {
            return (

                <ListItem>
                    <Card variant="outlined" style={{width:'90%',textAlign :'center'}}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {this.props.student.sname}
                            </Typography>
                            <Typography variant="body2">
                                {this.props.student.sid}
                            </Typography>
                        </CardContent>
                        <CardActions style={{alignSelf:'center',alignContent:'center'}}>
                            {this.props.shouldHideControls  &&<>
                                <Checkbox edge="end" checked={this.state.checked} onChange={(event)=>this.handleChange(event)}/>
                            </>}
                        </CardActions>
                    </Card>
                </ListItem>
            );
        }else {
            return (
                <ListItem>
                    <Card variant="outlined" style={{width:'90%',textAlign:'center'}}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {this.props.student.sname}
                            </Typography>
                            <Typography color="textSecondary">
                                {this.props.student.statusString}
                            </Typography>
                            <Typography variant="body2">
                                {this.props.student.sid}
                            </Typography>
                        </CardContent>
                    </Card>
                </ListItem>
            );
        }
    }
}

export default StudentCardView;

/**
 * shown in execute exam and in create exam
 * mode 0 - 2 in execute
 * mode 0 show name and student number along side date and time
 * mode 1 show name and student number along side the score
 * mode 2 show name and student number along side not yet booked
 * mode 3 show name and student number along side a check box used in selecting students for exam ...
 *
 *
 *
 *
 */

/**
    three diffrent views
 with date and time
 score  or  not booked yet
 <Checkbox
 edge="end"
 onChange={handleToggle(value)}
 checked={checked.indexOf(value) !== -1}
 inputProps={{ 'aria-labelledby': labelId }}
 />

 */