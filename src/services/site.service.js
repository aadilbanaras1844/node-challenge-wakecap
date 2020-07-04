
import {
    siteModel, workerModel
} from "../models";
import moment from 'moment';
import moment_tz from 'moment-timezone';

export default class SiteService {
    
  constructor() {}

    async add(params) {
        try {
            let newObject = new siteModel(params);
            return await newObject.save();
        } catch (error) {
            return error;
        }
    }

    async findById(_id) {
        try {
            let rows = await siteModel.findById(_id);
            return rows;
        } catch (error) {
            return error;
        }
    }

    async find() {
      try {
          let rows = await siteModel.find({});
          return rows;
      } catch (error) {
          return error;
      }
  }

    findWorkerStats(reportDate, site_id) {
        // const site = await this.findById(site_id);
        let self = this;
        return new Promise(async function(resolve, reject){
            let {
                name,
                timezone,
                starting_time,
                ending_time,
                late_threshold
            } = await self.findById(site_id);
    
            let starting_time_split = starting_time.split(":");
            let endinging_time_split = ending_time.split(":");
            late_threshold =  late_threshold * 60 ;
    
            const report_day = {
                start: moment(reportDate).startOf('day').toDate(),
                end: moment(reportDate).endOf('day').toDate()
            };
                    
            const working_hours = {
                start: moment(reportDate).startOf('day').hours(starting_time_split[0]).minute(starting_time_split[1]).toDate(),
                end : moment(reportDate).startOf('day').hours(endinging_time_split[0]).minute(endinging_time_split[1]).toDate()
            };
    
            const query = self.makeQuery(timezone, working_hours, late_threshold, report_day);
            
            let rows  =  await workerModel.aggregate(query);
            
            const absent_workers = rows.filter(obj => obj.is_absent == true);
            rows = rows.map(obj => {
                obj.active_time = moment.utc(obj.active_time*1000).format('HH:mm:ss');
                obj.inactive_time = moment.utc(obj.inactive_time*1000).format('HH:mm:ss');
                return obj
            })
            const late_workers = rows.filter(obj => obj.is_late == true);
            const present_workers = rows.filter(obj => obj.is_absent == false)
            return  resolve({
                all: rows,
                absent_workers,
                late_workers,
                present_workers
            })
        })
              
    }

    makeQuery( timezone, working_hours, late_threshold, report_day ){
        let query =   [
            {
              '$lookup': {
                'from': 'workerlocations', 
                'localField': 'worker_id', 
                'foreignField': 'worker_id', 
                'as': 'locations'
              }
            },{
                '$project': {
                  'locations': {
                    '$filter': {
                      'input': '$locations', 
                      'as': 'obj', 
                      'cond': {
                        '$and': [
                          {
                            '$gte': [
                              '$$obj.added_date', report_day.start,
                            ]
                          },{
                            '$lt': [
                                '$$obj.added_date', report_day.end,
                            ] 
                          }
                          
                        ]
                      }
                    }
                  }, 
                  'created_at': 1, 
                  'name': 1, 
                  'site_id': 1, 
                  'worker_id': 1
                }
              }, {
              '$unwind': {
                'path': '$locations', 
                'includeArrayIndex': 'seq', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$project': {
                'is_active': '$locations.is_active', 
                'duration': '$locations.duration', 
                'worker_id': '$worker_id', 
                'location_time': '$locations.added_date', 
                'name': 1, 
                'timezone': timezone, 
                'starting_time': working_hours.start, 
                'late_threshold': late_threshold
              }
            }, {
              '$project': {
                'location_time': 1, 
                'starting_time': 1, 
                'late_threshold': 1, 
                'is_active': 1, 
                'duration': 1, 
                'worker_id': 1, 
                'name': 1, 
                'report_date': 1
              }
            },{
              '$sort': {
                'location_time': -1
              }
            }, {
              '$group': {
                '_id': '$worker_id', 
                'active_time': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$is_active', true
                        ]
                      }, 
                      'then': '$duration', 
                      'else': 0
                    }
                  }
                }, 
                'inactive_time': {
                  '$sum': {
                    '$cond': {
                      'if': {
                        '$eq': [
                          '$is_active', false
                        ]
                      }, 
                      'then': '$duration', 
                      'else': 0
                    }
                  }
                }, 
                'locations': {
                  '$addToSet': {
                    'location_time': '$location_time', 
                    'worker_id': '$worker_id', 
                    'duration': '$duration', 
                    'is_active': '$is_active'
                  }
                }, 
                'late_threshold': {
                  '$min': '$late_threshold'
                }, 
                'starting_time': {
                  '$min': '$starting_time'
                }, 
                'first_location': {
                  '$last': '$location_time'
                }, 
                'worker_id': {
                  '$min': '$worker_id'
                }, 
                'name': {
                  '$min': '$name'
                }
              }
            }, {
              '$project': {
                'time_late': {
                  '$divide': [
                    {
                      '$subtract': [
                        '$first_location', '$starting_time'
                      ]
                    }, 1000
                  ]
                }, 
                'active_time': 1, 
                'inactive_time': 1, 
                'name': 1, 
                'worker_id': 1, 
                'locations': 1, 
                'late_threshold': 1
              }
            }, {
              '$project': {
                'is_late': {
                  '$cond': {
                    'if': {
                      '$gt': [
                        '$time_late', late_threshold
                      ]
                    }, 
                    'then': true, 
                    'else': false
                  }
                }, 
                'time_late': 1,
                'active_time': 1, 
                'inactive_time': 1, 
                'name': 1, 
                'worker_id': 1, 
                'is_absent': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        '$active_time', 0
                      ]
                    }, 
                    'then': {
                      '$cond': {
                        'if': {
                          '$eq': [
                            '$inactive_time', 0
                          ]
                        }, 
                        'then': true, 
                        'else': false
                      }
                    }, 
                    'else': false
                  }
                }
              }
            }
          ]
          return query;
    }

    findMidnightofSiteTimeZone(timezone){
      if(!timezone)
        return  '';
      let reportTime = moment();
      reportTime.hours('22')
      reportTime.minute('00');
      
      const op = timezone[0];
      timezone = timezone.substr(1,5).split(':');
      if( op == '-' ){
        reportTime.minutes( reportTime.minutes() + parseInt(timezone[1]) );
        reportTime.hours( reportTime.hours() + parseInt(timezone[0]) );
      }
      else if (op == '+') {
        reportTime.minutes( reportTime.minutes() - parseInt(timezone[1]) );
        reportTime.hours( reportTime.hours() - parseInt(timezone[0]) );
      }
      return this.pad(reportTime.hours())+':'+this.pad(reportTime.minutes());

    }

    pad(d) {
      return (d < 10) ? '0' + d.toString() : d.toString();
    }

}



