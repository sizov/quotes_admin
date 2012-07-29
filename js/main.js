// Models
window.QuoteOriginsModel = Backbone.Model.extend();

window.QuoteOriginsCollection = Backbone.Collection.extend({
    model:QuoteOriginsModel,
    url:"api/quote_origins"
});

window.QuotesModel = Backbone.Model.extend();

window.QuotesCollection = Backbone.Collection.extend({
    model:QuoteOriginsModel,
	url: function() {
		return "api/quote_origin/" + this.origin_id;
	}
	
});


// Views
window.QuoteOriginsListView = Backbone.View.extend({

    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName) {
        _.each(this.model.models, function (quoteOrigin) {
            $(this.el).append(new QuoteOriginsListItemView({model:quoteOrigin}).render().el);
        }, this);
        return this;
    }
	
});

window.QuoteOriginsListItemView = Backbone.View.extend({

    tagName:"li",

    template:_.template($('#tpl-qoute_origins-list-item').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
	
});

window.QuoteListView = Backbone.View.extend({

    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName) {
        _.each(this.model.models, function (quote) {
            $(this.el).append(new QuoteListItemView({model:quote}).render().el);
        }, this);
        return this;
    }
	
});

window.QuoteListItemView = Backbone.View.extend({
    tagName:"li",

    template:_.template($('#tpl-qoute-list-item').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

/*
window.WineView = Backbone.View.extend({

    template:_.template($('#tpl-wine-details').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});
*/

// Router
var AppRouter = Backbone.Router.extend({

    routes:{
        "":"quoteOriginsListRoute",		
        "quotesByQuoteOriginId/:origin_id":"quotesByQuoteOriginIdListRoute"
    },

    quoteOriginsListRoute:function () {
        this.quoteOriginsCollection = new QuoteOriginsCollection();
        this.quoteOriginsListView = new QuoteOriginsListView({model:this.quoteOriginsCollection});
        this.quoteOriginsCollection.fetch();
        $('#sidebar').html(this.quoteOriginsListView.render().el);
    },

    quotesByQuoteOriginIdListRoute:function (origin_id) {
		this.quotesCollection = new QuotesCollection();
		this.quotesCollection.origin_id = origin_id;
        this.quotesListView = new QuoteListView({model:this.quotesCollection});
		this.quotesCollection.fetch();
		//this.quotesCollection.fetch({ data: { origin_id: origin_id}, processData:true });
        $('#content').html(this.quotesListView.render().el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();