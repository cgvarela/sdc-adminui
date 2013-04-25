var Backbone = require('backbone');


// UsersView
var UserForm = require('./user-form');
var BaseView = require('./base');
var Users = require('../models/users');
var UserView = require('./user');
var tplUsers = require('../tpl/users.hbs');
var adminui = require('../adminui');

var UsersListItem = Backbone.Marionette.ItemView.extend({
    template: require('../tpl/users-list-item.hbs'),
    tagName: 'tr',
    events: {
        'click a.login': 'onClickLoginName'
    },
    onClickLoginName: function(e) {
        if (e.metaKey || e.ctrlKey) {
            return;
        }
        e.preventDefault();
        adminui.vent.trigger('showview', 'user', {
            user: this.model
        });
    }
});

var UsersList = Backbone.Marionette.CollectionView.extend({
    itemView: UsersListItem
});

var FilterForm = Backbone.View.extend({
    events: {
        'submit form': 'onSubmit',
        'change input': 'onSubmit',
        'change select': 'onSubmit'
    },
    onSubmit: function(e) {
        e.preventDefault();

        var params = this.$('form').serializeObject();
        this.trigger('query', params);
    }
});

module.exports = Backbone.Marionette.ItemView.extend({

    template: tplUsers,

    url: 'users',

    id: "page-users",

    sidebar: 'users',

    events: {
        'click button[data-event=new-user]': 'newUser'
    },

    initialize: function() {
        this.users = new Users();
        this.usersListView = new UsersList({
            collection: this.users
        });

        this.filterView = new FilterForm();
        this.listenTo(this.users, 'error', this.onError, this);
    },


    query: function(params) {
        this.$('.alert').hide();
        this.users.fetch({ data: params });
    },

    onError: function(model, xhr) {
        adminui.vent.trigger('error', {
            xhr: xhr,
            context: 'users / ufds',
            message: 'error occured while retrieving user information'
        });
    },

    onShow: function() {
        this.$('.alert').hide();
    },

    newUser: function() {
        this.createView = new UserForm();
        this.createView.render();
    },

    loadUserCounts: function() {
        this.users.userCount(this.updateCount);
    },

    updateCount: function(c) {
        this.$('.total-accounts').html(c);
    },

    onRender: function() {
        this.$findField = this.$('.findField');
        this.filterView.setElement(this.$('.users-filter'));
        this.listenTo(this.filterView, 'query', this.query, this);
        this.usersListView.setElement(this.$('.users-list tbody'));
        this.users.fetch();
        this.loadUserCounts();
        return this;
    }
});
