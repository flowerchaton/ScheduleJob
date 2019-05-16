module.exports = class ScheduleJob {
    constructor(options, callback) {
        this._repeat = options.repeat || false
        this._interval = options.interval
        this._keepHistory = options.keepHistory || false
        this._historyBufferLength = options.historyBufferLength || 200
        this._historyDisplayLength = options.historyDisplayLength || 200
        this._date = options.date
        this._callback = callback
        this._ref = undefined
        this._id = Date.now()
        this._actived = false
        this._execRecords = []

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
        return this._ref
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

    get history() {
        return this._execRecords
    }

    _updateRecord(record = {}, action, options = {}) {
        switch (action) {
            case 'start': {
                record.start = new Date()
                break
            }
            case 'end': {
                let startTime = record.start.getTime()
                record.timeSpan = Date.now() - startTime
                if (options.error) {
                    record.success = false
                    record.error = options.error
                } else {
                    record.success = true
                }
                break
            }
            default:
                break
        }
    }

    _addRecord(record) {
        while (this._execRecords.length >= this._historyBufferLength) {
            this._execRecords.shift()
        }
        this._execRecords.push(record)
    }

    start() {
        const callbackWrapper = () => {
            const record = {}
            this._addRecord(record)
            this._updateRecord(record, 'start')
            try {
                const returnValue = this._callback()
                if (returnValue instanceof Promise) {
                    returnValue
                        .then(() => {
                            this._updateRecord(record, 'end')
                        })
                        .catch((e) => {
                            this._updateRecord(record, 'end', { error: e })
                        })
                } else {
                    this._updateRecord(record, 'end')
                }
            } catch (error) {
                this._updateRecord(record, 'end', { error })
            }
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
                    this._ref = setInterval(callbackWrapper, this._interval)
                    callbackWrapper()
                }, delay)
            }
        }

        else if (this._type == this.jobTypes.REPEAT) {
            this._ref = setInterval(callbackWrapper, this._interval)

            callbackWrapper()
        }

        else if (this._type == this.jobTypes.ONE_TIME) {
            if (this._date && this._interval) {
                console.error('one time job can only have one of date and interval ');
            } else {
                if (this._date) {
                    let now = new Date()
                    let interval = this._date.getTime() - now.getTime()
                    this._ref = setTimeout(callbackWrapper, interval)

                } else if (this._interval) {
                    this._ref = setTimeout(callbackWrapper, this._interval)
                }
            }
        }
    }

    terminate() {
        if (this._type == this.jobTypes.ONE_TIME) {
            if (this._actived && this._ref) {
                clearTimeout(this._ref)
                this._actived = false
            }
        } else if (this._type == this.jobTypes.REPEAT || this.jobTypes.REPEAT_AT_TIME) {
            if (this._actived && this._ref) {
                clearInterval(this._ref)
                this._actived = false
            }
        }
    }

    get nextExec() {
        let len = this._execRecords.length
        let lastExec = this._execRecords[len - 1]
        let nextExecDate = new Date(lastExec.start.getTime() + this._interval)
        return { date: nextExecDate }
    }

    get prevExec() {
        return this._execRecords[this._execRecords.length - 2]
    }

    get currentExec() {
        return this._execRecords[this._execRecords.length - 1]
    }

}