//===================================================
// Models
//===================================================

window.QuoteOriginModel = Backbone.Model.extend();

window.QuoteOriginsCollection = Backbone.Collection.extend({
    model:QuoteOriginModel,
    url:"api/origins"
});

window.QuoteModel = Backbone.Model.extend({
	//urlRoot:"api/quotes",
	defaults:{
		id:null,
		quote_text:"XXX YYY ZZZ",
		language_id:1,
		comments:null
	}	
});

window.QuotesCollection = Backbone.Collection.extend({
    model:QuoteModel,
	url: function() {
		return "api/quotes/" + this.origin_id; ??? how to resolve url for retrieving quotes per orogin and storing quote by id (suppose to be same)
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
		//this.model.bind("add", function{
		//}, this);
		//this.model.bind("remove", function{
		//}, this);
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
	
	template:_.template($('#tpl-qoute-list-item').html()),
	
	initialize:function(){
		this.model.bind("change", this.render, this);
		this.render();
	},
	
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
		"click .add": "addQuote"
	},
	
	addQuote:function(){		
		app.selectedQuoteModel = new QuoteModel();
		//if(app.quoteDetailsView) app.quoteDetailsView.close();
		app.quoteDetailsView = new QuoteDetailsView({model:app.selectedQuoteModel});
        $('#content').html(app.quoteDetailsView.el);		
		return false;
	}
})

//quote details view
window.QuoteDetailsView = Backbone.View.extend({
    template:_.template($('#tpl-quote-details').html()),
	
	initialize:function(){
		this.render('test');
	},
	
	events:{
		"click .save":"save"
	},
	
	render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
	
	save:function (event){
		this.model.set({
			quote_text:$('#quoteText').val(),
			language_id:$('#languageId').val(),
			comments:$('#comments').val()
		});
	
		//creating new model
		if(this.model.isNew()){
			
		}
		
		//saving existing quote details		
		else{
			this.model.save();
		}
		
		return false;
	}    
});


//===================================================
// Router
//===================================================

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"originsRoute",		
        "origins/:origin_id":"originDetailsRoute",
		"quotes/:id":"quoteDetailsByIdRoute",
    },

    originsRoute:function () {
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
        this.quoteDetailsView = new QuoteDetailsView({model:this.selectedQuoteModel});
        $('#content').html(this.quoteDetailsView.el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();