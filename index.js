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
    this._date = options.date;
    this._callback = callback;
    this._id = undefined;
    this._actived = false;
    this._execDateRecords = [];

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
    key: "start",
    value: function start() {
      var _this = this;

      var callbackWrapper = function callbackWrapper() {
        _this._callback();

        var now = new Date();

        _this._execDateRecords.push(now);
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
    key: "type",
    get: function get() {
      return this._type;
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
    key: "interval",
    get: function get() {
      return this._interval;
    }
  }, {
    key: "nextExec",
    get: function get() {
      var len = this._execDateRecords.length;
      var lastExecDate = this._execDateRecords[len - 1];
      var nextExecDate = new Date(lastExecDate.getTime() + this._interval);
      return nextExecDate;
    }
  }, {
    key: "lastExec",
    get: function get() {
      return this._execDateRecords[this._execDateRecords.length - 2];
    }
  }, {
    key: "currentExec",
    get: function get() {
      return this._execDateRecords[this._execDateRecords.length - 1];
    }
  }]);

  return ScheduleJob;
}();
