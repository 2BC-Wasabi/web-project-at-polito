
//todo momentjs
class tempSession{
    constructor(date,time,endTime,duration,order,forSorting) {
        this.date =date;
        this.time =time;
        this.endTime = endTime;
        this.duration = parseInt(duration);
        this.order = parseInt(order);; //todo use when editing
        this.forSorting=forSorting;
    }
}
export default tempSession;