import React from 'react';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import {Link, Redirect} from 'react-router-dom' ;
import ExamBooking from "../api/ExamBooking";
import styled from "@material-ui/core/styles/styled";
import Fab from "@material-ui/core/Fab";
import GridList from "@material-ui/core/GridList";
import Container from "@material-ui/core/Container";

const MyCard = styled(Card)({
    textAlign: 'center',
    alignItems: "stretch",
    border: 4,
    background: '#fff',
    borderColor: 'black',
    outline:'aqua',
    borderRadius: '20px',
    alignSelf:'center',
    alignContent: 'center',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'black',
    padding: 'normal',
    margin: '1em',
    height:'auto',

});
const MyContainer = styled(Container)({

});
const StyledButton = styled(Button)({
    border: '2px',
    borderColor:'black',
    textAlign:'center',
    borderRadius: '4px',
    backgroundColor: '#00bcd4',
    boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    padding: '7px 14px',
});
class ExamCardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isTeacher: this.props.isTeacher,submitted:false};
    }
    componentDidMount() {  }
    componentWillUnmount() {

    }

    render() {
        if(this.state.submitted)return  <Redirect to='/exams' />;
        return (
                <MyCard variant="outlined">
                    <CardContent>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {this.props.exam.ename}
                        </Typography>
                        {
                           this.getContentText()
                        }
                    </CardContent>
                    <CardActions>
                        {
                            this.getActionButton()
                        }
                    </CardActions>
                </MyCard>
        );
    }

    getContentText(){
        if(this.props.isTeacher){
            return(
                <>
                    <Typography variant="subtitle1" gutterBottom>
                        {`Start:${this.props.exam.startDate} ${'  '} End;${this.props.exam.endDate}`}
                    </Typography>

                    <Typography variant="subtitle2" gutterBottom>
                        {`Number of students: ${this.props.exam.numberOfStudents}`}
                </Typography>
            </>
           );
        }else{
            //todo add congrats for a score above 26 and fix other scores
            let text = 'Unknown error';
            let congrats = '';
            //const text =  === 0 ? 'Not yet booked' :this.props.exam.status === 1 ? :`Score:${}`;
            switch(this.props.exam.status){
                case 0:
                    text = 'Not yet booked';
                    break;
                case 1:
                    text = `${this.props.exam.date} ${this.props.exam.time}`;
                    break;
                case 2:
                    text = `Score: ${this.props.exam.score}`;
                    congrats = this.props.exam.score >= 26 ? 'Amazing job': this.props.exam.score >= 23 ? 'Good job' : this.props.exam.score >= 18 ? 'Fine job':'Try harder next time';
                    break;
                default:
                    break;

            }
            return (
                <>
                    <Typography variant="subtitle1" gutterBottom>
                        {text}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                        {congrats}
                    </Typography>
                </>

            );
        }
    }
    getActionButton(){
        if(this.props.isTeacher){
            return (
                //todo redirect
                <Link to ={`/exam/id/${this.props.exam.id}`}><StyledButton className="button" size="small">View exam</StyledButton></Link>
            );
        }else{
            switch(this.props.exam.status){
                case 0:

                    return (<Link to ={`/exam/id/${this.props.exam.eid}/reservation/${this.props.exam.id}`}><StyledButton  size="small">Book now</StyledButton></Link>);

                case 1:

                    return (<Link to ={`/exams`}><Button className="button" size="small" onClick={()=>{this.props.booking(new ExamBooking(this.props.exam.id,null,null,this.props.exam.slotID,null,null),this.props.exam.sid,false);}}>Delete Appointment</Button></Link>);

                default:
                    return false;

            }
        }

    }

}
export default ExamCardView;
                        
                        
