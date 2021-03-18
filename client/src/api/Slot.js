class Slot{
    constructor(id,esid,sessionid,sid,name,sNumber,score,time) {
        this.id = id;
        this.esid = esid;
        this.sessionsid = sessionid;
        this.sid = sid;
        this.name = name;
        this.sNumber = sNumber;
        this.score = score;
        this.time = time;
        this.status = sid === 0 ? 4 : sid === -1 ? 3 : score === null ? 0 : score === 13 ? 1 : 2 ;

    }
}
export default Slot;

/**
 this.status
 0 = present/absent
 1 = needs a score
 2 = just show score
 3 = free slot to be used with isteacher
 4 = booked slot student show booked sid == 0 only when student requests from server

 */