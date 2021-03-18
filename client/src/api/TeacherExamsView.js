import moment from "moment";

/**
 * this is used for data about exams in general when showing the list of exams
 * this is a teacher!! version of the exams
 */
//todo momentjs
class TeacherExamsView{
    constructor(id,name,numberOfStudents,startDate,endDate,tid,slotduration,courseID) {
        this.id = id;
        this.name = name;
        this.numberOfStudents = numberOfStudents;
        this.startDate = moment(startDate).format('YYYY-MM-DD');
        this.endDate = moment(endDate).format('YYYY-MM-DD');
        this.tid = tid;
        this.slotduration = moment(slotduration,'HH:mm').format('HH:mm');
        this.courseID = courseID;
    }
}
export default TeacherExamsView;