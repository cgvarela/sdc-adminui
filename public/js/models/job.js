var moment = require('moment');
var _  = require('underscore');
var Model = require('./model');
var Job = Model.extend({
    defaults: {},

    urlRoot: "/_/jobs",

    idAttribute: "uuid",

    initialize: function() {
        this.listenTo(this, 'change:execution', this.onChangeExecution, this);
    },

    onChangeExecution: function() {
        var exec = this.get('execution');
        this.trigger('execution:'+exec);
    },

    finished: function() {
        var execution = this.get('execution');
        return execution === 'canceled' || execution === 'succeeded' || execution === 'failed';
    },

    getJobInfo: function(callback) {
        $.get(this.url() + '/info', function(info) {
            callback(info);
        });
    },

    startWatching: function() {
        var self = this;
        if (!this._interval) {
            this._interval = setInterval(function() {
                self.fetch();
            }, 3000);
        }
    },

    duration: function() {
        var d = _.map(this.get('chain_results'), function(task) {
            var t = _.clone(task);
            t.started_at = moment(task.started_at).format('YYYY-MM-DD HH:mm:ss');
            t.finished_at = moment(task.finished_at).format('YYYY-MM-DD HH:mm:ss');
            t.duration = moment(task.finished_at).diff(moment(task.started_at), 'seconds', true);
            return t;
        });

        return _.reduce(d, function(memo, t) {
            return memo + t.duration;
        }, 0);
    },

    stopWatching: function() {
        console.log(this);
        clearInterval(this._interval);
    }
});
module.exports = Job;
