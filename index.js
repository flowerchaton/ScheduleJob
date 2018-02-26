module.exports = class ScheduleJob {
    constructor(options, callback) {
        this._repeat = options.repeat || false
        this._interval = options.interval
        this._date = options.date
        this._callback = callback
        this._id = undefined
        this._actived = false
        this._execDateRecords = []

        if (this._repeat) {
            if (this._date && this._interval) {
                this._type = this._type = this.jobTypes.REPEAT_AT_TIME
            } else {
                this._type = this.jobTypes.REPEAT
            }
        } else {
            this._type = this.jobTypes.ONE_TIME
        }

    }

    get id() {
        return this._id
    }

    get type() {
        return this._type
    }

    get actived() {
        return this._actived
    }

    get jobTypes() {
        return {
            ONE_TIME: 0,
            REPEAT: 1,
            REPEAT_AT_TIME: 2
        }
    }
    get interval(){
        return this._interval
    }

    start() {

        const callbackWrapper = () => {
            this._callback()
            let now = new Date()
            this._execDateRecords.push(now)
        }

        this._actived = true
        if (this._type == this.jobTypes.REPEAT_AT_TIME) {
            let now = new Date()
            let delay = this._date.getTime() - now.getTime()

            if (this._date.getTime() < now.getTime()) {
                console.warn('date over due');
                return
            } else {

                setTimeout(() => {
                    this._id = setInterval(callbackWrapper, this._interval)
                    callbackWrapper()
                }, delay)
            }
        }

        else if (this._type == this.jobTypes.REPEAT) {
            this._id = setInterval(callbackWrapper, this._interval)

            callbackWrapper()
        }

        else if (this._type == this.jobTypes.ONE_TIME) {
            if (this._date && this._interval) {
                console.error('one time job can only have one of date and interval ');
            } else {
                if (this._date) {
                    let now = new Date()
                    let interval = this._date.getTime() - now.getTime()
                    this._id = setTimeout(callbackWrapper, interval)

                } else if (this._interval) {
                    this._id = setTimeout(callbackWrapper, this._interval)
                }
            }
        }
    }

    terminate() {
        if (this._type == this.jobTypes.ONE_TIME) {
            if (this._actived && this._id) {
                clearTimeout(this._id)
                this._actived = false
            }
        } else if (this._type == this.jobTypes.REPEAT || this.jobTypes.REPEAT_AT_TIME) {
            if (this._actived && this._id) {
                clearInterval(this._id)
                this._actived = false
            }
        }
    }

    get nextExec() {
        let len = this._execDateRecords.length
        let lastExecDate = this._execDateRecords[len - 1]
        let nextExecDate = new Date(lastExecDate.getTime() + this._interval)
        return nextExecDate
    }

    get lastExec() {
        return this._execDateRecords[this._execDateRecords.length - 2]
    }

    get currentExec(){
        return this._execDateRecords[this._execDateRecords.length - 1]
    }

}