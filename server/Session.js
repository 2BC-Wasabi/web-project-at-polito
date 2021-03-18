class Session{
    constructor(id,date,startTime,duration,examid,order,slots) {
        this.id = id;
        this.sdate = date;
        this.startTime = startTime;
        this.duration = duration;
        this.examid = examid;
        this.sorder = order;
        this.slots = slots;
    }
}
module.exports = Session