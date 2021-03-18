import Slots from './Slot';
import moment from 'moment';
class Session{
    constructor(id,date,startTime,duration,examid,order,slots,slotDuration) {
        this.id = id;
        this.sdate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
        this.startTime = moment(startTime, "HH:mm").format("HH:mm");
        this.duration = duration;
        this.examid = examid;
        this.sorder = order;

        let time = moment(startTime, "HH:mm");
        this.slots = slots.map((slot)=> new Slots(slot.id,slot.esid,slot.sessionsid,slot.sid,slot.name,slot.sNumber,slot.score, slot.sNumber=== 1? time.format("HH:mm"):time.add(slotDuration,'minutes').format("HH:mm")));
    }
}
export default Session;