const express = require('express');
const router = express.Router();
let json_file = require('../data/db.json');

router.get('/', (req, res) => {
  return res.json(json_file);
});

router.get('/interval', (req, res) => {
  let search = req.query;
  console.log(search)

  let queryStart = search.start.split("-");
  let queryEnd = search.end.split("-");
  let dateStart = new Date(queryStart[2], queryStart[1] - 1, queryStart[0]);
  let dateEnd = new Date(queryEnd[2], queryEnd[1] - 1, queryEnd[0]);
  let differenceDays = Math.round((dateEnd - dateStart) / (1000 * 60 * 60 * 24));
  console.log(differenceDays)
  let result = [];

  for (let i = 0; i <= differenceDays; i++) {
    let dataQuery = dateStart
    let dataDay = dataQuery.getDay();
    console.log(dataDay, dataQuery)
    //if Sunday or Saturday => next
    if (dataDay === 0) {
      dataQuery = new Date(dateStart.getDate() + ((1000 * 60 * 60 * 24) * i + 1));
    } else {
      for (let j = 0; j < json_file.length; j++) {
        let elem = json_file[j];
        console.log(elem)
        // specific day: make sure the date is within the period.
        if(elem.day) {
          let dateRuleDay = elem.day.split("/");
          let compareRuleDay = new Date(dateRuleDay[2], dateRuleDay[1] - 1, dateRuleDay[0]);
          if (dateEnd >= compareRuleDay && dateStart <= compareRuleDay) {
            result.push(elem.Date = dataQuery);
            result.push(elem.intervals);
            continue;
          }
        }
        // daily: always show. 
        if (elem.daily) {
          result.push(elem.Date = dataQuery);
          result.push(elem.intervals);
          continue;
        }
        //weekly: pega os dias da semana informado no filtro e busca somente as regras que batem com esse range.
        if (elem.weekly) {
          console.log('jnojvbnaosjbfvo')
          let daysWeek = [
            { number: 0, day: 'sunday' },
            { number: 1, day: 'monday' },
            { number: 2, day: 'tuesday' },
            { number: 3, day: 'wednesday' },
            { number: 4, day: 'thursday' },
            { number: 5, day: 'friday' },
            { number: 6, day: 'saturday' }
          ]
  
          let currentDay = daysWeek.filter(item => (item.number === dataDay));
          console.log(currentDay, dataDay)
          console.log(currentDay[0].day, dataDay)
          for (k = 0; k < elem.weekly.length; k++) {
            if(currentDay[0].day === elem.weekly[k].day){
              result.push(elem.Date = dataQuery);
              result.push(elem.intervals);
              continue;
            }
            console.log(result, 'uqehducw')
          }
        }
        dataQuery = new Date(dateStart.getDate() + ((1000 * 60 * 60 * 24) * i + 1)); 
      }
      dataQuery = new Date(dateStart.getDate() + ((1000 * 60 * 60 * 24) * i + 1)); 
    }
    return res.send(result);
  }  
  return res.status(400).json({ message: 'Invalid Rule. Should be day or weekly'});
});

router.post('/', (req, res) => {
  let body = req.body;
  if (body.daily && body.weekly) {
    return res.status(400).json({ message: 'Invalid Rule. Should be day or weekly'});
  }
  if (body.daily && body.day) {
    return res.status(400).json({ message: 'Invalid Rule. Should be day or daily' });
  }
  if (body.weekly && body.day) {
    return res.status(400).json({ message: 'Invalid Rule. Should be day or weekly' });
  }
  if (!body.daily && !body.weekly && !body.day) {
    return res.status(400).json({ message: 'Invalid Rule. Should be day or daily or weekly. Please choose one.' });
  }

  for (let i = 0; i < body.intervals.length; i++) {
    let interval = body.intervals[i];
    let hourStart = interval.start.split(":");
    let hourEnd = interval.end.split(":");
    let date = new Date();
    let completeDateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hourStart[0], hourStart[1]);
    let completeDateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hourEnd[0], hourEnd[1]);

    if (completeDateStart >= completeDateEnd) {
      return res.status(400).json({ message: 'Invalid Rule. Please, Check the intervals' });
    }
    //Validation for more than one interval
    if (i != 0) {
      let intervalBefore = body.intervals[i - 1];
      let hourEndBefore = intervalBefore.end.split(":");
      let EndBefore = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hourEndBefore[0], hourEndBefore[1]);
      if (completeDateStart <= EndBefore) {
        return res.status(400).json({ message: 'Invalid Rule. Please, Check the intervals' });
      }
    }
  }

  if (json_file.length == 0) {
    json_file.push(body);
    return res.json({ message: 'Created rule' });
  } else {
    for (let i = 0; i < json_file.length; i++) {
      let elem = json_file[i];
      if (elem.day == body.day && isUnique(elem.intervals, body.intervals)) {
        return res.status(400).json({ message: 'Rule already exists' });
      }
      if (elem.daily == body.daily && isUnique(elem.intervals, body.intervals)) {
        return res.status(400).json({ message: 'Rule already exists' });
      }
      if (elem.weekly == body.weekly) {
        if (daysWeek(body.daysWeek, elem.daysWeek) && isUnique(elem.intervals, body.intervals)) {
          return res.status(400).json({ message: 'Rule already exists' });
        }
      }
    }
    json_file.push(body);
    return res.send({ message: 'Created rule' });
  }
});

router.delete('/', (req, res) => {
  let body = req.body;
  let controle = false;
  var result = [];
  for (let i = 0; i < json_file.length; i++) {
    let item = json_file[i];

    if ((item.day != body.day) || item.day == body.day && !isUnique(item.intervals, body.intervals)) {
      result.push(item);
      continue;
    }
    else {
      //é pq encontrou algo pra excluir
      controle = true;
    }
    if (item.daily == body.daily && !isUnique(item.intervals, body.intervals)) {
      result.push(item);
      continue;
    }
    else {
      //é pq encontrou algo pra excluir
      controle = true;
    }

    if (item.weekly == body.weekly && daysWeek(body.daysWeek, item.daysWeek) && !isUnique(item.intervals, body.intervals)) {
      result.push(item);
      continue;
    }
    else {
      controle = true;
    }
  }
  json_file = result;
  if (controle) {
    res.send({ msg: 'Deleted rule.' });
  }
  res.send({ message: 'Rule not found.' });
});



let isUnique = (intervalsA, intervalsB) => {
  // let controle;
  for (let i = 0; i < intervalsA.length; i++) {
    for (let y = 0; y < intervalsB.length; y++) {
      if (intervalsA[i].start == intervalsB[y].start && intervalsA[i].end == intervalsB[y].end) {
        return true;
      }
      else {
        return false;
      }
    }
  }
  // return controle;
}

let daysWeek = (weekA, weekB) => {
  let controle;
  if (weekB.length == 0) {
    return false;
  }
  for (let i = 0; i < weekB.length; i++) {
    if (weekB[i].day == weekA[i].day) {
      controle = true;
    }
    else {
      controle = false;
      return controle;
    }
  }
  return controle;
}

let findWeek = (row, value) => {
  for (let y = 0; y < row.daysWeek.length; y++) {
    if (value == row.daysWeek[y].day) {
      return true;
    }
  }
  return false;
}

module.exports = router;