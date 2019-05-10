router.get('/interval', (req, res) => {
  let search = req.query;

  let queryStart = search.start.split("-");
  let queryEnd = search.end.split("-");
  let dateStart = new Date(queryStart[2], queryStart[1] - 1, queryStart[0]);
  let dateEnd = new Date(queryEnd[2], queryEnd[1] - 1, queryEnd[0]);
  let differenceDays = Math.round((dateEnd - dateStart) / (1000 * 60 * 60 * 24));

  let result = [];

  for (let i = 0; i <= differenceDays; i++) {
    let dataQuery = dateStart
    let dataDay = dataQuery.getDay();

    //if Sunday or Saturday => next
    if (dataDay == 0 || dataDay == 6) {
      dataQuery = new Date(dateStart.getDate() + ((1000 * 60 * 60 * 24) * i + 1));
    }
  
    for (let j = 0; j < json_file.length; j++) {
      let elem = json_file[j];
    
      // daily: always show. 
      if (elem.daily) {
        result.push(elem.Date = dataQuery);
        result.push(elem.intervals);
        continue;
      }

      // specific day: make sure the date is within the period.
      if(elem.day) {
        let dateRuleDay = elem.day.split("/");
        let compareRuleDay = new Date(dateRuleDay[2], dateRuleDay[1] - 1, dateRuleDay[0]);
        if (dateEnd >= compareRuleDay && dateStart <= compareRuleDay) {
          result.push(elem.Date = dataQuery);
          result.push(elem.intervals);
        }
      }

      //weekly: pega os dias da semana informado no filtro e busca somente as regras que batem com esse range.
      let daysWeek = [
        { number: 0, day: 'sunday' },
        { number: 1, day: 'monday' },
        { number: 2, day: 'tuesday' },
        { number: 3, day: 'wednesday' },
        { number: 4, day: 'thursday' },
        { number: 5, day: 'friday' },
        { number: 6, day: 'saturday' }
      ]

      if (elem.weekly) {
        daysWeek = daysWeek.filter(item => {
          if (item.number == dataDay) {
            dayName = item.day;
          }
        });

        for (k = 0; k < elem.weekly.length; k++) {
          if(dayName == elem.weekly[k].day){
            result.push(elem.Date = dataQuery);
            result.push(elem.intervals);
            break;  
          }
        }
      }
    }
    return res.send(result);
  }

});

// for (let i = 0; i <= differenceDays; i++) {
//   let dataQuery = dateStart
//   let dataDay = dataQuery.getDay();
//   let match = false;
//   if (dataDay == 0 || dataDay == 6) {
//     dataQuery = new Date(dateStart.getDate() + ((1000 * 60 * 60 * 24) * i + 1));
//   } else {
//     daysWeek = daysWeek.filter(item => {
//       if (item.number == dataDay) {
//         return findWeek(elem, item.day);
//       };
//     }
//   }
//   if (daysWeek) {
//     result.push(dataQuery);
//     result.push(elem.intervals)
//   }

// }

      




 // let search = req.query;
  // if (search.length !== 0) {
  //   let result = [];
  //   for (let i = 0; i < json_file.length; i++) {
  //     let elem = json_file[i];

  //     console.log(result)
  //     let queryStart = search.start.split("-");
  //     let queryEnd = search.end.split("-");
  //     let dateStart = new Date(queryStart[2], queryStart[1] - 1, queryStart[0]);
  //     let dateEnd = new Date(queryEnd[2], queryEnd[1] - 1, queryEnd[0]);

  //     console.log(dateStart.getDay(), dateEnd);

  //     // specific day: make sure the date is within the period.
  //     if(elem.day) {
  //       let dateRuleDay = elem.day.split("-");
  //       let compareRuleDay = new Date(dateRuleDay[2], dateRuleDay[1] - 1, dateRuleDay[0]);
  //       if (dateEnd >= compareRuleDay && dateStart <= compareRuleDay) {
  //         result.push(elem);
  //       }
  //     }

  //     //weekly: pega os dias da semana informado no filtro e busca somente as regras que batem com esse range.
  //     if (elem.weekly) {
  //       let daysWeek = [
  //         { number: 0, day: 'sunday' },
  //         { number: 1, day: 'monday' },
  //         { number: 2, day: 'tuesday' },
  //         { number: 3, day: 'wednesday' },
  //         { number: 4, day: 'thursday' },
  //         { number: 5, day: 'friday' },
  //         { number: 6, day: 'saturday' }
  //       ];

  //       if (dateStart.getDay() != dateEnd.getDay()) {
  //         daysWeek = daysWeek.filter(item => {
  //           if (item.number >= dateStart.getDay() && item.number <= dateEnd.getDay()) {
  //             return item;
  //           }
  //         });
  //         let controleWeek = false;
  //         for (let i = 0; i < daysWeek.length; i++) {
  //           controleWeek = findWeek(elem, daysWeek[i].day);
  //           if (!controleWeek) {
  //             break;
  //           }
  //         }
  //         if (controleWeek) {
  //           result.push(elem);
  //         }
  //       }
  //       else {
  //         //As datas informadas pegam uma semana inteira, então pode inserir.
  //         result.push(elem);
  //       }
  //     }

  //           // daily: always show. 
  //           if (elem.daily) {
  //             result.push(elem.everyday = "Everyday");
  //             result.push(elem.intervals);
  //             continue;
  //           }
      
  //   }
  //   return res.send(result);
  // };
  // res.send(json_file);