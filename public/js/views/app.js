/**
 * views/chrome
 *
 * This module manages the Layout & Pane for
 * the application
 *
 * -------------------------------------+
 *        TOP  BAR                      |
 * -------------------------------------+
 *          |                           |
 * sidebar  |          content          |
 *          |                           |
 *          |                           |
*/


var Topbar = require('views/topbar');
var Sidebar = require('views/sidebar');
var BaseView = require('views/base');

var AppView = module.exports = BaseView.extend({

  template: 'chrome',

  appEvents: {
    'hide': 'hideApp'
  },

  hideApp: function() {
    this.$el.hide();
  },

  initialize: function(options) {
    _.bindAll(this, 'render', 'presentView');

    var self = this;

    this.options = options || {};
  },

  presentView: function(viewName, args) {
    if (typeof(viewName) == 'undefined')
      return;

    var viewModule;
    if (typeof(viewName) == 'string')
      viewModule = require(_.str.sprintf('views/%s', viewName));

    if (this.contentView) {
      if (typeof(this.contentView.viewWillDisappear) === 'function') {
        this.contentView.viewWillDisappear.call(this.contentView);
      }

      this.contentView.remove();

      if (typeof(this.contentView.viewDidDisappear) === 'function') {
        this.contentView.viewDidDisappear.call(this.contentView);
      }
    }

    var view = this.contentView = new viewModule(args);

    if (typeof(view.viewWillAppear) === 'function') {
      this.contentView.viewWillAppear.call(this.contentView);
    }

    this.$("#content").html(this.contentView.render().el);
    this.sidebarView.highlight(this.contentView.name);

    if (typeof(this.contentView.viewDidAppear) === 'function') {
      this.contentView.viewDidAppear.call(this.contentView);
    }

    Backbone.history.navigate(this.contentView.name);
  },

  render: function() {
    this.$el.html(this.template());

    this.topbarView = new Topbar({ el: this.$("#topbar") });
    this.topbarView.on('signout', function(e) {
      this.dispatcher.trigger('signout');
    }, this);


    this.sidebarView = new Sidebar({el: this.$("#sidebar")});
    this.sidebarView.bind('sidebar:selected', this.presentView);

    this.topbarView.render();
    this.sidebarView.render();
    return this;
  }
});