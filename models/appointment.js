const gcal = require('google-calendar')
const moment = require('moment')
const { findUserByHandle } = require('../io/database/users')

const findFreeSchedule = (busyTime) => {
  let dayStartTime = moment().utcOffset("-08:00").startOf('day').add(9, 'h')
  let dayEndTime = moment().utcOffset("-08:00").startOf('day').add(17.5, 'h')
  let currentTime = (process.env.NODE_ENV == 'test') 
    ? moment("2016-12-14T09:00:00.000").utcOffset("-08:00")
    : moment()
  let counter = 0

  return busyTime.reduce((freetimes, currentAppt) => {
    let startTime = moment(currentAppt.start).utcOffset("-08:00")
    let endTime = moment(currentAppt.end).utcOffset("-08:00")

    if(startTime >= currentTime) {
      freetimes.push({start:currentTime, end: startTime})
      currentTime = endTime
    }

    counter ++
    if(busyTime.length === counter){
      freetimes.push({start:currentTime, end:dayEndTime})
    }

    return freetimes
  }, [])
}

//find next available 30 m appointment slot
const findNextAppointment = (freetimes) => {
  let now = (process.env.NODE_ENV == 'test') 
    ? moment("2016-12-14T09:00:00.000").utcOffset("-08:00")
    : moment()
  let aptStart = now.clone().add({m:10})
  let aptEnd = now.clone().add({m:40})
  let firstApppointment = {}

  for (i = 0; i < freetimes.length; i++) {
    let startFreeTime = freetimes[i].start
    let endFreeTime = freetimes[i].end
    
    if (aptStart.isBetween(startFreeTime, endFreeTime)
      && aptEnd.isBetween(startFreeTime, endFreeTime)
    ) {
      firstApppointment.start = aptStart.clone().toDate()
      firstApppointment.end = aptEnd.clone().toDate()
      return firstApppointment
    } else {
      aptStart = freetimes[i + 1].start.clone().add({m: 10})
      aptEnd = freetimes[i + 1].start.clone().add({m: 40})
    }
  }
}


//TODO: insert timeslot into gcal
//TODO: instert timeslot into DB


module.exports = { 
  findFreeSchedule,
  findNextAppointment
}
