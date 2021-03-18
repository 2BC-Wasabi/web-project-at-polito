/**
 * this is used for data about exams in general when showing the list of exams
 * this is a Student!! version of the exams
 */
import moment from "moment";

//todo momentjs
class StudentExamsView{
    constructor(id,sid,eid,score,date,time,ename,slotID,sname) {
        this.id = id;
        this.sid = sid;
        this.eid = eid;
        this.score = score;
        this.date = date !== null ?moment(date,'YYYY-MM-DD').format('YYYY-MM-DD'):date;
        this.time = time !== null ?moment(time,'HH:mm').format('HH:mm'):time;
        this.ename = ename;
        this.slotID =slotID;
        this.sname = sname
        this.status = date === null ? 0: score === null ? 1 : 2 ; // 0 not yet booked , 1 waiting for score , 2 score.
        //todo needs attention
        this.statusString = slotID === null ? 'Not yet Booked': score === null ? `${date} at ${time}` : score === 13 ? 'Score needed':`${score === 10? 'Fail':score === 11 ? 'Withdraw':score === 12 ?'Absent':score === 31 ? '30L':score}` ; // 0 not yet booked , 1 waiting for score , 2 score.
    }
}
export default StudentExamsView;