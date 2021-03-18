import React from 'react';
import List from "@material-ui/core/List";
import SlotCardView from "./SlotCardView";
import ListSubheader from "@material-ui/core/ListSubheader";
import StudentCardView from "./StudentCardView";
import SessionCardView from "./SessionCardView";

import {Typography} from "@material-ui/core";



class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open:false};
        console.log("this.props.data");
        console.log(this.props.data);
    }
    componentDidMount() {  }
    componentWillUnmount() {  }

    render() {
        return (

                <List aria-labelledby="nested-list-subheader" subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        <Typography variant="h6" component="h2" gutterBottom>{this.props.title}</Typography>
                    </ListSubheader>}>

                    {this.getListContent(this.props.mode)}

                </List>
        );
    }


    getListContent = (mode)=>{
        /**
         * 0 for slots used when viewing an exam both teachers and students(if they still need to book)
         * 1 for student used for teachers to select students for exam or view list of student of an exam
         * 2 for sessions used as a preview of session when creating the exam
         */
        switch (mode){
            case 0:
                return (this.props.data.slots.map((slot) => <SlotCardView key={slot.id} slot={slot} mode={slot.status} isTeacher={this.props.isTeacher} markOrBook={this.props.markOrBook} cid={this.props.cid} date={this.props.data.sdate} esid={this.props.esid} examID={this.props.examID} user={this.props.user}/>));
            case 1:
                return (this.props.data.map((student) => <StudentCardView key={student.sid} student={student} mode={this.props.studentMode} insertStudent ={this.props.insertStudent} deleteStudent={this.props.deleteStudent} shouldHideControls={this.props.shouldHideControls}/>));
            case 2:
                return (this.props.data.map((session,index)=><SessionCardView key={index} session={session} index={index}  openToEdit={this.props.openToEdit} deleteSession={this.props.deleteSession} shouldHideControls={this.props.shouldHideControls}/>));

            default:
                return <Typography>error</Typography>;
        }
    }
}

export default ListView;



/*
{this.props.mode === 0 ?'Students':`Session #${this.props.data.sorder} at ${this.props.data.sdate}`}
                <GridListTile key={"newBoard"} cols={1}>
                    <Board_CardView/>
                </GridListTile>
 */