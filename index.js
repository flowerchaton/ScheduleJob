"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

module.exports =
/*#__PURE__*/
function () {
  function ScheduleJob(options, callback) {
    _classCallCheck(this, ScheduleJob);

    this._repeat = options.repeat || false;
    this._interval = options.interval;
    this._keepHistory = options.keepHistory || false;
    this._historyBufferLength = options.historyBufferLength || 200;
    this._historyDisplayLength = options.historyDisplayLength || 200;
    this._date = options.date;
    this._callback = callback;
    this._id = undefined;
    this._actived = false;
    this._execRecords = [];

    if (this._repeat) {
      if (this._date && this._interval) {
        this._type = this._type = this.jobTypes.REPEAT_AT_TIME;
      } else {
        this._type = this.jobTypes.REPEAT;
      }
    } else {
      this._type = this.jobTypes.ONE_TIME;
    }
  }

  _createClass(ScheduleJob, [{
    key: "_updateRecord",
    value: function _updateRecord() {
      var record = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var action = arguments.length > 1 ? arguments[1] : undefined;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      switch (action) {
        case 'start':
          {
            record.start = new Date();
            break;
          }

        case 'end':
          {
            var startTime = record.start.getTime();
            record.timeSpan = Date.now() - startTime;

            if (options.error) {
              record.success = false;
              record.error = options.error;
            } else {
              record.success = true;
            }

            break;
          }

        default:
          break;
      }
    }
  }, {
    key: "_addRecord",
    value: function _addRecord(record) {
      while (this.__execRecords.length >= this._historyBufferLength) {
        this._execRecords.shift();
      }

      this._execRecords.push(record);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      var callbackWrapper = function callbackWrapper() {
        var record = {};

        _this._updateRecord(record, 'start');

        try {
          var returnValue = _this._callback();

          if (returnValue instanceof Promise) {
            returnValue.then(function () {
              return _this._updateRecord(record, 'end');
            })["catch"](function (e) {
              return _this._updateRecord(record, 'end', {
                error: e
              });
            });
          }
        } catch (error) {
          _this._updateRecord(record, 'end', {
            error: error
          });
        }

        _this._addRecord(record);
      };

      this._actived = true;

      if (this._type == this.jobTypes.REPEAT_AT_TIME) {
        var now = new Date();
        var delay = this._date.getTime() - now.getTime();

        if (this._date.getTime() < now.getTime()) {
          console.warn('date over due');
          return;
        } else {
          setTimeout(function () {
            _this._id = setInterval(callbackWrapper, _this._interval);
            callbackWrapper();
          }, delay);
        }
      } else if (this._type == this.jobTypes.REPEAT) {
        this._id = setInterval(callbackWrapper, this._interval);
        callbackWrapper();
      } else if (this._type == this.jobTypes.ONE_TIME) {
        if (this._date && this._interval) {
          console.error('one time job can only have one of date and interval ');
        } else {
          if (this._date) {
            var _now = new Date();

            var interval = this._date.getTime() - _now.getTime();

            this._id = setTimeout(callbackWrapper, interval);
          } else if (this._interval) {
            this._id = setTimeout(callbackWrapper, this._interval);
          }
        }
      }
    }
  }, {
    key: "terminate",
    value: function terminate() {
      if (this._type == this.jobTypes.ONE_TIME) {
        if (this._actived && this._id) {
          clearTimeout(this._id);
          this._actived = false;
        }
      } else if (this._type == this.jobTypes.REPEAT || this.jobTypes.REPEAT_AT_TIME) {
        if (this._actived && this._id) {
          clearInterval(this._id);
          this._actived = false;
        }
      }
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    }
  }, {
    key: "actived",
    get: function get() {
      return this._actived;
    }
  }, {
    key: "jobTypes",
    get: function get() {
      return {
        ONE_TIME: 0,
        REPEAT: 1,
        REPEAT_AT_TIME: 2
      };
    }
  }, {
    key: "history",
    get: function get() {
      return this._execRecords();
    }
  }, {
    key: "nextExec",
    get: function get() {
      var len = this._execRecords.length;
      var lastExecDate = this._execRecords[len - 1];
      var nextExecDate = new Date(lastExecDate.getTime() + this._interval);
      return {
        date: nextExecDate
      };
    }
  }, {
    key: "lastExec",
    get: function get() {
      return this._execRecords[this._execRecords.length - 2];
    }
  }, {
    key: "currentExec",
    get: function get() {
      return this._execRecords[this._execRecords.length - 1];
    }
  }]);

  return ScheduleJob;
}();
