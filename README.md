# ScheduleJob
A javascript library for managing schedule job

##  Usage
### create one time job
```
let job = new ScheduleJob({ interval: 1000 }, callback)
```

### create repeat job
```
let job = new ScheduleJob({ interval: 1000, repeat: true })
```

### create one time job on specific date
```
let someDate = new Date('2018-2-26 10:10:10')
let job = new ScheduleJob({ date: someDate })
```


### create repeat job on specific date
```
let someDate = new Date('2018-2-26 10:10:10')
let job = new ScheduleJob({ date: someDate, repeat: true})
```

##  API

### start a job
``` 
job.start()
```

### stop a job
```
job.terminate()
```


### get next execution time
```
job.nextExec()
```

### get last execution time
```
job.nextExec()
```

### get current execution time
```
job.currentExec()
```

##  Props
- id 
- type
- actived
- jobTypes
- interval