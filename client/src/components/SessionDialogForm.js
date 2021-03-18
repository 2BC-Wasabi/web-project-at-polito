import React from 'react'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment";

import tempSession from "../api/tempSession";


//todo check over lapping sessions !!?

class SessionDialogForm extends React.Component {
    constructor(props) {
        super(props);
        const time = this.props.isNew ? moment().add(30,'minutes').format('HH:mm'):this.props.toEdit.time;
        const date = this.props.isNew ? moment().format('YYYY-MM-DD'):this.props.toEdit.date;
        const duration = this.props.isNew ? 1 :this.props.toEdit.duration;
        const endTime = this.props.isNew ? moment().add(moment.duration(this.props.slotDuration).asMinutes() + 30,'minutes').format('DD/MM/YYYY HH:mm'):this.props.toEdit.endTime;
        const availableSlots = this.props.availableSlots + (this.props.isNew ? 1 : 0);
        console.log(availableSlots);
        this.state = {open:this.props.open,time:time,date:date,duration:duration, endTime:endTime, availableSlots:availableSlots};

        this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount() {
    }
    updateField = (name, value) => {
        //todo we will not allow creation of exam unless there is half an hour differance between now and the first slot
        // note for teacher i already implemented this by the time i got answered on slack
        let value2 = value;
        let endTime = ' ';
        let calcSlots = 0;
        if(name === 'time'){

            if(moment(this.state.date,'YYYY-MM-DD').isSame(moment().format('YYYY-MM-DD'))){
                const nowPlus30 = moment().add(30,'minutes');
                console.log(value)
                value2 = moment(value,'HH:mm').isBefore(nowPlus30) || value === '' ? nowPlus30.format('HH:mm') : value;
            }
            endTime = moment(this.state.date+value2,'YYYY-MM-DDHH:mm').add(moment.duration(this.props.slotDuration).asMinutes() * (this.state.duration),'minutes').format('DD/MM/YYYY HH:mm');
        }else if(name === 'date'){
            value2 = value === '' || !moment(value,'YYYY-MM-DD').isAfter(moment()) ? moment().format('YYYY-MM-DD') : value;
            endTime = moment(value2+this.state.time,'YYYY-MM-DDHH:mm').add(moment.duration(this.props.slotDuration).asMinutes() * (this.state.duration),'minutes').format('DD/MM/YYYY HH:mm');
        }else {
            endTime = moment(this.state.date+this.state.time,'YYYY-MM-DDHH:mm').add(moment.duration(this.props.slotDuration).asMinutes() * (value),'minutes').format('DD/MM/YYYY HH:mm');
            calcSlots = value - this.state.duration
        }
        this.setState({[name]: value2,endTime:endTime,availableSlots:this.state.availableSlots + calcSlots});
    }
    handleClose =(mode)=>{

        if(mode === 0){
            this.props.handleClose(0,9);
            this.setState({open:false});
        }else{
            if(this.props.isNew){
                console.log(this.state.date);
                const obj = new tempSession(this.state.date,this.state.time,this.state.endTime,this.state.duration,0,moment(this.state.date+this.state.time,'YYYY-MM-DDHH:mm'))
                this.props.insertSession(obj,1);
                this.setState({open:false});
            }else{
                const obj = new tempSession(this.state.date,this.state.time,this.state.endTime,this.state.duration,this.state.duration - this.props.toEdit.duration ,moment(this.state.date+this.state.time,'YYYY-MM-DDHH:mm'));
                this.props.updateSession(obj,this.props.toEditIndex);
                this.setState({open:false});
            }
        }

    }
    render() {
        return(
            <Dialog open={this.state.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Session</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.state.availableSlots >= 0 ? `there is ${this.state.availableSlots} extra slots available`:`there is ${this.state.availableSlots * -1} students that can't book`}
                    </DialogContentText>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField id="date" label="Date" type="date" name="date" value={this.state.date} InputLabelProps={{shrink: true}} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField type='time' label='Start time' id="time" name="time" value={this.state.time} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} error={this.state.time === ''}
                                           helperText={this.state.time === "" ? 'Empty field!' : ''}/>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField id="standard-number" label="Number of slots" type="number" name='duration' value={this.state.duration} onChange={(ev)=>this.updateField(ev.target.name, ev.target.value)} InputProps={{ inputProps: { min: 1 } }} InputLabelProps={{shrink: true}}/>
                            </Grid>
                            <Grid item xs={6}>
                                <label>{`You will finish at ${this.state.endTime}`}</label>
                            </Grid>
                        </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>this.handleClose(0)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>this.handleClose(1)} color="primary">
                        {this.props.isNew?'Add':'Update'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
export default SessionDialogForm;