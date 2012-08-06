//===================================================
// Models
//===================================================

window.QuoteOriginModel = Backbone.Model.extend();

window.QuoteOriginsCollection = Backbone.Collection.extend({
    model:QuoteOriginModel,
    url:"api/quote_origins"
});

window.QuoteModel = Backbone.Model.extend({
	defaults:{
		id:null,
		quote_text:"XXX YYY",
		language_id:1,
		comments:null
	}
});

window.QuotesCollection = Backbone.Collection.extend({
    model:QuoteModel,
	url: function() {
		return "api/quote_origin/" + this.origin_id;
	}	
});


//===================================================
// Views
//===================================================

//list of quotes
window.QuoteOriginsListView = Backbone.View.extend({
    tagName:'ul',
	
    initialize:function () {
        this.model.bind("reset", this.render, this);
		this.render('test');
    },

    render:function (eventName) {
        _.each(this.model.models, function (quoteOriginModel) {
            $(this.el).append(new QuoteOriginsListItemView({model:quoteOriginModel}).el);
        }, this);
        return this;
    }	
});

//item in list of quotes
window.QuoteOriginsListItemView = Backbone.View.extend({
    tagName:"li",
	
    template:_.template($('#tpl-qoute_origins-list-item').html()),
	
	initialize:function(){
		this.render('test');
	},

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

//details of origin
window.OriginDetailsView = Backbone.View.extend({
	template:_.template($('#tpl-origin_details').html()),
	
	initialize: function() {
		this.render(this.model);
	},
	
	render: function(model) {
		$(this.el).html(this.template(this.model.toJSON()));
	}
});

//list of quotes
window.QuoteListView = Backbone.View.extend({
    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
		//this.render('test');
    },

    render:function (eventName) {
        _.each(this.model.models, function (quoteModel) {
            $(this.el).append(new QuoteListItemView({model:quoteModel}).el);
        }, this);
        return this;
    }
});

//item in list of quotes
window.QuoteListItemView = Backbone.View.extend({
    tagName:"li",
	
	initialize:function(){
		this.render();
	},

    template:_.template($('#tpl-qoute-list-item').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});


//actions related to quotes list
window.QuoteActionsView = Backbone.View.extend({
	template:_.template($('#tpl-quote-actions').html()),	
	
	initialize:function(){
		this.render();
	},
	
	render:function(){
		$(this.el).html(this.template());
	},
	
	events:{
		"click .save": "addQuote"
	},
	
	addQuote:function(){
		//if(app.selectedOriginModel) selectedOriginModel.close();
		app.selectedQuoteModel = new QuoteModel();
		app.quoteView = new QuoteView({model:app.selectedQuoteModel});
        $('#content').html(app.quoteView.el);		
		return false;
	}
})

//quote details view
window.QuoteView = Backbone.View.extend({
    template:_.template($('#tpl-quote-details').html()),
	
	initialize:function(){
		this.render('test');
	},

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});


//===================================================
// Router
//===================================================

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"quoteOriginsRoute",		
        "originDetails/:origin_id":"originDetailsRoute",
		"quoteDetails/:id":"quoteDetailsByIdRoute",
    },

    quoteOriginsRoute:function () {
        this.quoteOriginsCollection = new QuoteOriginsCollection();
        this.quoteOriginsListView = new QuoteOriginsListView({model:this.quoteOriginsCollection});
        this.quoteOriginsCollection.fetch();
        $('#sidebar').html(this.quoteOriginsListView.el);
    },

    originDetailsRoute:function (origin_id) {		
		//creating origin details view
		this.selectedOriginModel = this.quoteOriginsCollection.get(origin_id);
		this.originDetailsView = new OriginDetailsView({model:this.selectedOriginModel});
		$('#sidebardetails').html(this.originDetailsView.el);
		
		//creating list of quotes for current origin and fetching content from server
		this.quotesCollection = new QuotesCollection();
		this.quotesCollection.origin_id = origin_id;
        this.quotesListView = new QuoteListView({model:this.quotesCollection});
		this.quotesCollection.fetch();		
        $('#contentlist').html(this.quotesListView.el);
		
		//adding quote actions view
		this.quoteActionsView = new QuoteActionsView();
		$('#contentlistfooter').html(this.quoteActionsView.el);
    },	
	
	quoteDetailsByIdRoute:function (id) {
		this.selectedQuoteModel = this.quotesCollection.get(id);
        this.quoteView = new QuoteView({model:this.selectedQuoteModel});
        $('#content').html(this.quoteView.el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();