import React from 'react';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ListView from "./ListView";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Alert from '@material-ui/lab/Alert';
import  { uniqueNamesGenerator, adjectives, colors, starWars } from 'unique-names-generator';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SessionDialogForm from "./SessionDialogForm";
import Grid from "@material-ui/core/Grid";
import ExamCreating from "../api/ExamCreating";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {LoggedInUserContext} from "../auth/LoggedInUserContext";
import {Redirect} from 'react-router-dom';
import styled from "@material-ui/core/styles/styled";
import Container from "@material-ui/core/Container";
const Myfab = styled(Fab)({
    position:'fixed',
    right: 0,
    bottom: 0,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'black',
    backgroundColor: '#00bcd4',
    margin: '0 1.5rem 1.5rem 0',
});
class CreateExamView extends React.Component {

    constructor(props) {
        super(props);
        const shortName = uniqueNamesGenerator({
            dictionaries: [colors,adjectives,starWars],
            length: 3
        });
        const name = shortName.replaceAll('_',' ');
        this.state = {activeStep:0,examName:name,slotDuration:'00:15',isError:false,errorMessage:'',selectedStudents:[],createdSessions:[],slotNumbers:0,open:false,toEdit:0,isNew:true,studentNum:0,students:[],didLoad:false,submitted:false};
        this.props.setTitle('New Exam');
        this.updateField = this.updateField.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
    }
    componentDidMount() {

        this.props.getStudentList(this.props.user.course)

    }
    componentWillUnmount() {  }

    updateField = (name, value) => {
        this.setState({[name]: name=== 'slotDuration' ? (value === '' ? '00:00' : value):value});
    }

    handleNext = () => {

        let error = false
        if(this.state.activeStep === 0){
            if (this.state.examName === '') {
                this.setState({isError: true, errorMessage: 'Empty field'});
                error = true;
            }else this.setState({isError: false, errorMessage: ''});
        }
        if(this.state.activeStep === 1){
            if(this.state.selectedStudents.length === 0){
                this.setState({isError: true, errorMessage: 'No students selected'});
                error = true;
            } else this.setState({isError: false, errorMessage: ''});
        }
        if(this.state.activeStep === 2){
            if (this.state.slotDuration === '' || this.state.slotDuration === '00:00' ) {
                //yes infinity will pass here
                this.setState({isError: true, errorMessage: 'No selected time'});
                error = true;
            }else this.setState({isError: false, errorMessage: ''});
        }
        if(this.state.activeStep === 3){
            if (this.state.studentNum>this.state.slotNumbers) {
                this.setState({isError: true, errorMessage: 'not Enough slots'});
                error = true;
            }else this.setState({isError: false, errorMessage: ''});
        }

        if(!error)this.setState(state => ({activeStep: state.activeStep + 1}));


    };
    handleDialogClose = (mode,data)=>{
        console.log("Asdad");
        console.log(`${mode} ${data} aaa`);
        if(mode === 0)this.setState({open:false});
        if(mode === 1)this.setState({open:true,toEdit:data,isNew:false});
    }
    handleReset = () => {
        this.setState({activeStep: 0})
    };

    handleSubmit = () =>{
        console.log("submit here");
        let sortedArray = this.state.createdSessions.sort((a, b) => a.forSorting.valueOf() - b.forSorting.valueOf())
        console.log(sortedArray);
        const tempExam = new ExamCreating(this.state.examName,this.state.slotDuration,this.state.studentNum,sortedArray[0].forSorting,sortedArray[sortedArray.length-1].forSorting,this.props.cid,this.props.user.username,sortedArray,this.state.selectedStudents);
        this.props.createExam(tempExam);
        this.setState({submitted:true});
    }

    render() {
        const steps = ["Enter the name of the Exam", "Select students", "Enter slot Duration", "Create slots"];
        const def = this.state.slotNumbers - this.state.studentNum;
        return (
            <LoggedInUserContext.Consumer>
                {(context) => (
                    <>
                        {this.state.submitted && <Redirect to="/exams"/>}
                        {context.authErr && <Redirect to="/login"/>}
                        {context.authUser.type === 1 && <Redirect to="/login"/>}
                        {
                            <div>
                                <Grid container={true} direction="column" justify="center" alignItems="center">
                                    <Stepper activeStep={this.state.activeStep} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <div>
                                        {this.state.activeStep === steps.length ? (
                                            <div>
                                                <Grid container direction="column" justify="center" alignItems="center"
                                                      spacing={4}>
                                                    <Grid item xs={12}>
                                                        <Typography gutterBottom
                                                                    variant="h3">{`Exam name: ${this.state.examName}`}</Typography>
                                                        <Typography gutterBottom
                                                                    variant="h5">{`Slot duration:${this.state.slotDuration}`}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <ListView data={this.state.selectedStudents} mode={1}
                                                                  studentMode={1}
                                                                  shouldHideControls={false}/>
                                                    </Grid>

                                                    <ListView data={this.state.createdSessions} mode={2}
                                                              shouldHideControls={false}/>

                                                    <Grid item xs={6}>
                                                        <Button variant="contained" color="primary"
                                                                onClick={() => this.handleSubmit()}>Save</Button>
                                                    </Grid>
                                                </Grid>

                                            </div>
                                        ) : (
                                            <div style={{alignItems: "center"}}>
                                                {this.getStepContent(this.state.activeStep)}
                                                <div>
                                                    {this.state.isError ?
                                                        <Alert
                                                            severity="error">{this.state.errorMessage}</Alert> : false}
                                                    <Button variant="contained" color="primary"
                                                            onClick={() => this.handleNext()}
                                                            disabled={this.state.activeStep === steps.length - 1 && def < 0}>
                                                        {this.state.activeStep === steps.length - 1 ? (def < 0 ? `You CAN'T save right now differance = ${def}` : `You CAN save right now differance = ${def}`) : "Next"}
                                                    </Button>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Grid>

                            </div>
                        }

                    </>
                )}
            </LoggedInUserContext.Consumer>
        )
    }
    getStepContent = (stepIndex)=> {
        const def = this.state.slotNumbers - this.state.studentNum;
        let sum = this.state.createdSessions.reduce(function(a, b){return a + b.duration;}, 0);
        console.log(`sum is ${sum}`);
        switch (stepIndex) {
            case 0:
                return (
                    <div>
                            <InputLabel >Enter exam name</InputLabel>
                            <TextField id="examName" name="examName" value={this.state.examName} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} error={this.state.examName === ""}
                                       helperText={this.state.examName === "" ? 'Empty field!' : ' '}/>
                    </div>
                );
            case 1:
                return (
                    <ListView data={this.props.studentList} mode={1} studentMode={1} insertStudent={this.insertStudentOrSession} deleteStudent={this.deleteStudentOrSession} shouldHideControls={true}/>
                );
            case 2:
                return (
                        <div>
                            <InputLabel >Enter slot duration</InputLabel>
                            <TextField type='time' id="slotDuration" name="slotDuration" label="" value={this.state.slotDuration} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} error={this.state.slotDuration === ""}
                                       helperText={this.state.slotDuration === "" ? 'Empty field!' : ''}/>
                        </div>
                );
            case 3:
                return (
                    <div>
                        <ListView data={this.state.createdSessions} mode={2}  deleteSession={this.deleteStudentOrSession} openToEdit={this.handleDialogClose} shouldHideControls={true}/>
                        <Myfab onClick={()=>this.setState({open:true,isNew:true})}><AddIcon /></Myfab>
                        {this.state.open ? <SessionDialogForm open={this.state.open} slotDuration={this.state.slotDuration}  handleClose={this.handleDialogClose} availableSlots={def} isNew={this.state.isNew} insertSession ={this.insertStudentOrSession} updateSession={this.updateSession} toEdit={this.state.isNew?null:this.state.createdSessions[this.state.toEdit]} toEditIndex={this.state.toEdit}/>:false}
                    </div>

                );
            default:
                return "Unknown stepIndex";
        }
    }
    insertStudentOrSession = (object,mode)=>{
        console.log(object)
        console.log("INSERT");
        console.log(this.state.slotNumbers);
        console.log(object);


        if(mode === 0){
            const studentNum = this.state.studentNum + 1;
            this.setState(state => {
                const arr = state.selectedStudents.concat(object)
                return { selectedStudents: arr,open:false,studentNum:studentNum};
            })
        }else {
            const slotNumbers =this.state.slotNumbers + object.duration
            this.setState(state => {
                const arr = state.createdSessions.concat(object);
                return {createdSessions: arr, open: false, slotNumbers: slotNumbers};
                //smarter idea is to switch modes then add mode to the student num instead !!
            })
        }
    }
    updateSession = (object,index)=>{
        console.log("updateSession")
        console.log(object);
        console.log(this.state.slotNumbers)
        const slotNumber = this.state.slotNumbers + object.order;
        this.setState(state => {
            const arr = state.createdSessions.map((session,i) => {
                if (i === index) {
                    return object;
                } else {
                    return session;
                }
            });
            return { createdSessions:arr,open:false,slotNumbers:slotNumber};
        });
    }
    deleteStudentOrSession = (toDelete,mode,numberOfslots)=>{
        console.log("deleteStudentOrSession")
        console.log(numberOfslots)
        if(mode === 1) {
            const slotNumber = this.state.slotNumbers - numberOfslots;
            this.setState(state => {
                const arr = state.createdSessions.filter((item, i) => i !== toDelete);
                return {createdSessions: arr,slotNumbers:slotNumber};
            });
        }else{
            this.setState(state => {
                console.log(toDelete);
                const arr = state.selectedStudents.filter((item) => item.sid !== toDelete);
                return {selectedStudents: arr,studentNum:(this.state.studentNum - 1)};
            });
        }
    }
    //TODO make sure that the date is recomuted if the time is more than 00:00
}
export default CreateExamView;