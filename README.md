

# Nodejs Backend Challenge
IOT Platform for companies having single/multiple sites dealing with workers, to monitor their attendence, absents, late comings, active hours, inactive  hours.

## Technology used
- NodeJS (v12)
- MongoDB (v3.6)
- Docker
- Docker-compose  ( for running docker )

## Packages & Libraries used
- mongoose
- agenda ( for queuing jobs to run at specific time)
- Express
- Joi ( for validating parameters )
- Mocha & Chai (for test cases, not added yet)
- Nodemailer ( for sending emails )
- Moment ( for processing, formatting time )

## Commands
- Run in watch mode  ``` npm start ```
- Run unit test  ``` npm run test ```
- build & run in production mode ``` npm run serve ```
- run in docker environmand  ``` docker-compose up ``` I have set docker file, docker-compose up will create mongodb image & use docker file of application to create  & run environment


## Assumptions

- For Site
    * timezone => +04:00 , -03:20 ( format )
    * starting & ending time => 09:00 , 16:00,   ( format , no am or pm )
    * late threshold => number which will indicactes minutes
    * Every site will have its own email, on which report will be send 


- For Worker Location
    * duration => any number which will be considered as seconds as  shown in example provided

- For Workers
    * The first entry on a particular day will be considered arriving time.
    * Arriving time will be compared with starting time of site, and after matching with late threshold , it will be decided  either worker is late or not.
    * Worker with no entry on a particular day will be considered as absent.
    * Active time will be , sum of all seconds of location where is_active was true.
    * InActive time will be , sum of all seconds of location where is_active was false.

- Reports
    * Report will me emailed to site's email, at 10:00pm ( as per timezone of site ).
    * Report will contain just stringify json of stats of workers , 
    * Email could be delayed as I used free mailtrap to send email, but if needed that can be replace with gmail or other smtp to work well. 


- System
    * To avoid confusion and have fix standar, I have set timezone of Application as UTC+00:00 i.e Europe/Ireland

- Reports
    * After adding/updating sites,
    * call the api http://localhost:3003/api/sites/refresh-queues
    * this will configure queues to send report email to sites at midnight

> Don't add any data directly, use apis to insert data.


## Rest Apis
### add client
        url: localhost:3003/api/clients
        method: POST
        params: {name: 'ddddd'}

### add site
        url: localhost:3003/api/sites
        method: POST
        params: {
            name:marina branch
            client_id:5efd7736184b721a88ff5195
            timezone:-02:00
            starting_time:09:00
            ending_time:18:00
            late_threshold:5
            email:sdf@gmail.com
        }
### add worker
        url: localhost:3003/api/workers
        method: POST
        params: {
            name:hadi
            site_id:5efd90aa506018306d2e1970
            worker_id:3
        }
### add worker location
        url: localhost:3003/api/workers/location
        method: POST
        params: {
            "coordinates" : {
                "coordinates" : [ 
                    55.1404609680176, 
                    25.0615882873535
                ],
                "_id" : "5daddacc03feb33cb822ac23",
                "type" : "Point"
            },
            "is_active": true,
            "duration" : 180,
            "worker_id" : 1
        }
### Refresh Queues
        url : http://localhost:3003/api/sites/refresh-queues
        method: GET
### Dashboard for queues
        url : http://localhost:3003/dash
        method: GET
