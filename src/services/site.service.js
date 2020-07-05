import moment from 'moment';
import {
  siteModel, workerModel,
} from '../models';

export default class SiteService {
  async add(params) {
    try {
      // eslint-disable-next-line new-cap
      this.newObject = new siteModel(params);
      return await this.newObject.save();
    } catch (error) {
      return error;
    }
  }

  async findById(_id) {
    try {
      this.rows = await siteModel.findById(_id);
      return this.rows;
    } catch (error) {
      return error;
    }
  }

  async find() {
    try {
      this.rows = await siteModel.find({});
      return this.rows;
    } catch (error) {
      return error;
    }
  }

  findWorkerStats(reportDate, siteId) {
    // const site = await this.findById(site_id);
    const self = this;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((async (resolve) => {
      let {
        timezone,
        // eslint-disable-next-line camelcase
        starting_time,
        // eslint-disable-next-line camelcase
        ending_time,
        // eslint-disable-next-line camelcase
        late_threshold,
      } = await self.findById(siteId);

      const startingTimeSplit = starting_time.split(':');
      const endingingTimeSplit = ending_time.split(':');
      // eslint-disable-next-line camelcase
      late_threshold *= 60;

      const reportDay = {
        start: moment(reportDate).startOf('day').toDate(),
        end: moment(reportDate).endOf('day').toDate(),
      };

      const workingHours = {
        start: moment(reportDate).startOf('day').hours(startingTimeSplit[0]).minute(startingTimeSplit[1])
          .toDate(),
        end: moment(reportDate).startOf('day').hours(endingingTimeSplit[0]).minute(endingingTimeSplit[1])
          .toDate(),
      };

      const query = self.makeQuery(timezone, workingHours, late_threshold, reportDay);

      let rows = await workerModel.aggregate(query);

      const absentWorkers = rows.filter((obj) => obj.is_absent === true);
      rows = rows.map((obj) => {
        // eslint-disable-next-line no-param-reassign
        obj.active_time = moment.utc(obj.active_time * 1000).format('HH:mm:ss');
        // eslint-disable-next-line no-param-reassign
        obj.inactive_time = moment.utc(obj.inactive_time * 1000).format('HH:mm:ss');
        return obj;
      });
      const lateWorkers = rows.filter((obj) => obj.is_late === true);
      const presentWorkers = rows.filter((obj) => obj.is_absent === false);
      return resolve({
        all: rows,
        absent_workers: absentWorkers,
        late_workers: lateWorkers,
        present_workers: presentWorkers,
      });
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  makeQuery(timezone, workingHours, lateThreshold, reportDay) {
    const query = [
      {
        $lookup: {
          from: 'workerlocations',
          localField: 'worker_id',
          foreignField: 'worker_id',
          as: 'locations',
        },
      }, {
        $project: {
          locations: {
            $filter: {
              input: '$locations',
              as: 'obj',
              cond: {
                $and: [
                  {
                    $gte: [
                      '$$obj.added_date', reportDay.start,
                    ],
                  }, {
                    $lt: [
                      '$$obj.added_date', reportDay.end,
                    ],
                  },

                ],
              },
            },
          },
          created_at: 1,
          name: 1,
          site_id: 1,
          worker_id: 1,
        },
      }, {
        $unwind: {
          path: '$locations',
          includeArrayIndex: 'seq',
          preserveNullAndEmptyArrays: true,
        },
      }, {
        $project: {
          is_active: '$locations.is_active',
          duration: '$locations.duration',
          worker_id: '$worker_id',
          location_time: '$locations.added_date',
          name: 1,
          timezone,
          starting_time: workingHours.start,
          late_threshold: lateThreshold,
        },
      }, {
        $project: {
          location_time: 1,
          starting_time: 1,
          late_threshold: 1,
          is_active: 1,
          duration: 1,
          worker_id: 1,
          name: 1,
          report_date: 1,
        },
      }, {
        $sort: {
          location_time: -1,
        },
      }, {
        $group: {
          _id: '$worker_id',
          active_time: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    '$is_active', true,
                  ],
                },
                then: '$duration',
                else: 0,
              },
            },
          },
          inactive_time: {
            $sum: {
              $cond: {
                if: {
                  $eq: [
                    '$is_active', false,
                  ],
                },
                then: '$duration',
                else: 0,
              },
            },
          },
          locations: {
            $addToSet: {
              location_time: '$location_time',
              worker_id: '$worker_id',
              duration: '$duration',
              is_active: '$is_active',
            },
          },
          late_threshold: {
            $min: '$late_threshold',
          },
          starting_time: {
            $min: '$starting_time',
          },
          first_location: {
            $last: '$location_time',
          },
          worker_id: {
            $min: '$worker_id',
          },
          name: {
            $min: '$name',
          },
        },
      }, {
        $project: {
          time_late: {
            $divide: [
              {
                $subtract: [
                  '$first_location', '$starting_time',
                ],
              }, 1000,
            ],
          },
          active_time: 1,
          inactive_time: 1,
          name: 1,
          worker_id: 1,
          locations: 1,
          late_threshold: 1,
        },
      }, {
        $project: {
          is_late: {
            $cond: {
              if: {
                $gt: [
                  '$time_late', lateThreshold,
                ],
              },
              then: true,
              else: false,
            },
          },
          time_late: 1,
          active_time: 1,
          inactive_time: 1,
          name: 1,
          worker_id: 1,
          is_absent: {
            $cond: {
              if: {
                $eq: [
                  '$active_time', 0,
                ],
              },
              then: {
                $cond: {
                  if: {
                    $eq: [
                      '$inactive_time', 0,
                    ],
                  },
                  then: true,
                  else: false,
                },
              },
              else: false,
            },
          },
        },
      },
    ];
    return query;
  }

  findMidnightofSiteTimeZone(timezone) {
    if (!timezone) return '';
    const reportTime = moment();
    reportTime.hours('22');
    reportTime.minute('00');

    const op = timezone[0];
    // eslint-disable-next-line no-param-reassign
    timezone = timezone.substr(1, 5).split(':');
    if (op === '-') {
      // eslint-disable-next-line radix
      reportTime.minutes(reportTime.minutes() + parseInt(timezone[1]));
      // eslint-disable-next-line radix
      reportTime.hours(reportTime.hours() + parseInt(timezone[0]));
    } else if (op === '+') {
      // eslint-disable-next-line radix
      reportTime.minutes(reportTime.minutes() - parseInt(timezone[1]));
      // eslint-disable-next-line radix
      reportTime.hours(reportTime.hours() - parseInt(timezone[0]));
    }
    return `${this.pad(reportTime.hours())}:${this.pad(reportTime.minutes())}`;
  }

  // eslint-disable-next-line class-methods-use-this
  pad(d) {
    return (d < 10) ? `0${d.toString()}` : d.toString();
  }
}
