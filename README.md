# ScheduleJob
A javascript library for managing schedule job

##  Usage
### create one time job
```
let job = new ScheduleJob({ interval: 1000 }, callback)
```

### create repeat job
```
let job = new ScheduleJob({ interval: 1000, repeat: true }, callback)
```

### create one time job on specific date
```
let someDate = new Date('2018-2-26 10:10:10')
let job = new ScheduleJob({ date: someDate }, callback)
```


### create repeat job on specific date
```
let someDate = new Date('2018-2-26 10:10:10')
let job = new ScheduleJob({ date: someDate, repeat: true}, callback)
```

##  API

### Start a job
``` 
job.start()
```

### Stop a job
```
job.terminate()
```

## Useful info
### Get next execution record
```
job.nextExec // { start: 2019-05-16T15:49:56.906Z, timeSpan: 3013, success: true }
```

### Get previous execution record
```
job.prevExec // { start: 2019-05-16T15:60:56.906Z, timeSpan: 3013, success: true }
```

### Get current execution record
```
job.currentExec // { start: 2019-05-16T15:49:56.906Z, timeSpan: 3013, success: true }
```

### Get history
```
job.history // 
[
    { start: 2019-05-16T15:42:56.906Z, timeSpan: 3013, success: true }, 
    { start: 2019-05-16T15:49:56.906Z, timeSpan: 3013, success: false, error: ... }
]
```
##  Props list
### Job {

- id 
- type
- actived
- jobTypes [static]
  - ONE_TIME: 0
  - REPEAT: 1
  - REPEAT_AT_TIME: 2
- history
- nextExec
- currentExec
- prevExec

}