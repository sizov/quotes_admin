//TODO: Optimize close method boilerplate code


//===================================================
// Models
//===================================================

window.OriginModel = Backbone.Model.extend();

window.OriginsCollection = Backbone.Collection.extend({
    model:OriginModel,
    url:"api/origins"
});

window.QuoteModel = Backbone.Model.extend({
	urlRoot:"api/quotes",
	defaults:{
		id:null,
		quote_text:"XXX YYY ZZZ",
		language_id:1,
		comments:null
	}	
});

window.QuotesCollection = Backbone.Collection.extend({
    model:QuoteModel,
	url: "api/quotes"
});


//===================================================
// Views
//===================================================

//list of origins
window.OriginsListView = Backbone.View.extend({
    tagName:'ul',
	
    initialize:function () {
        this.model.bind("reset", this.render, this);
		this.model.bind("destroy", this.close, this); //if you delete all list
		this.render();
    },

    render:function (eventName) {
        _.each(this.model.models, function (quoteOriginModel) {
            $(this.el).append(new QuoteOriginsListItemView({model:quoteOriginModel}).el);
        }, this);
        return this;
    },	
	
	close:function(){
		console.log('OriginsListView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
		this.model.unbind("reset", this.render);
		this.model.unbind("destroy", this.close);		
	}
});

//item in list of origins
window.QuoteOriginsListItemView = Backbone.View.extend({
    tagName:"li",
	
    template:_.template($('#tpl-origins-list-item').html()),
	
	initialize:function(){
		this.render('test');
	},

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});


//actions related to origin list
window.OriginActionsView = Backbone.View.extend({
	template:_.template($('#tpl-origin-actions').html()),	
	
	initialize:function(){
		this.render();
	},
	
	events:{
		"click .addOrigin": "addOriginHandler"
	},
	
	render:function(){
		$(this.el).html(this.template());
	},
	
	addOriginHandler:function(event){		
		alert("add origin");
		//TODO: reuse "originDetailsRoute" creation
		return false;
	},
	
	close:function () {		
		console.log("OriginActionsView.close " + this.cid);		
		this.remove();		
		this.unbind();
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
	},
	
	close:function(){
		console.log('OriginDetailsView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
	}
});

//list of quotes
window.QuoteListView = Backbone.View.extend({
    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
		this.model.bind("sync", this.syncHandler, this);
		this.model.bind("add", this.addHandler , this);
		this.model.bind("destroy", this.close, this); //if you delete all quotes of origin
    },
	
	syncHandler:function (){
		console.log("QuoteListView.syncHandler " + this.cid);
	},
	
	addHandler: function(quote){
		console.log("QuoteListView.addHandler - start " + this.cid);
		$(this.el).append(new QuoteListItemView({model:quote}).el);		
	},

    render:function (eventName) {
        _.each(this.model.models, function (quote) {
            $(this.el).append(new QuoteListItemView({model:quote}).el);
        }, this);
        return this;
    },
	
	close:function(){
		console.log('QuoteListView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
		this.model.unbind("reset", this.render, this);
		//TODO: after delete exception: Uncaught TypeError: Object function (){a.apply(this,arguments)} has no method 'unbind' 
		this.model.unbind("sync", this.syncHandler, this);
		this.model.unbind("add", this.addHandler , this);
		this.model.unbind("destroy", this.close);
	}
});

//item in list of quotes
window.QuoteListItemView = Backbone.View.extend({
    tagName:"li",
	
	template:_.template($('#tpl-qoute-list-item').html()),
	
	initialize:function(){
		console.log("QuoteListItemView.initialize " + this.cid + ", model=" + this.model.cid);
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
		this.render();
	},
	
	render:function (eventName) {
		//console.log("QuoteListItemView.render " + this.cid + ", model=" + this.model.cid);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
	
	close:function () {		
		console.log("QuoteListItemView.close " + this.cid);		
		this.remove();		
		this.unbind();
		this.model.unbind("change", this.render);
		this.model.unbind("destroy", this.close);
	}
});


//actions related to quotes list
window.QuoteActionsView = Backbone.View.extend({
	template:_.template($('#tpl-quote-actions').html()),	
	
	events:{
		"click .addQuote": "addQuoteHandler"
	},
	
	initialize:function(){
		this.render();
	},
	
	render:function(){
		$(this.el).html(this.template());
	},
	
	addQuoteHandler:function(){		
		app.selectedQuote = new QuoteModel();
		if(app.quoteDetailsView)app.quoteDetailsView.close();
		app.quoteDetailsView = new QuoteDetailsView({model:app.selectedQuote});
        $('#content').html(app.quoteDetailsView.el);		
		return false;
	},
	
	close:function () {		
		console.log("QuoteActionsView.close " + this.cid);		
		this.remove();		
		this.unbind();
	}
});

//quote details view
window.QuoteDetailsView = Backbone.View.extend({
    template:_.template($('#tpl-quote-details').html()),
	
	initialize:function(){
		console.log('QuoteDetailsView.initialize - start,  ' + this.cid + ", model=" + this.model.cid);
		this.model.bind("destroy", this.close, this);
		this.model.bind("sync", this.render, this);
		this.render('test');
	},
	
	events:{
		"click .save":"saveHandler",
		"click .delete":"deleteHandler"
	},
	
	render:function (eventName) {
		//console.log('QuoteDetailsView.render - start,  ' + this.cid + ", model=" + this.model.cid);
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
	
	saveHandler:function (){
		this.model.set({
			quote_text:$('#quoteText').val(),
			language_id:$('#languageId').val(),
			comments:$('#comments').val(),
			origin_id:app.selectedOrigin.get("id")
		});
	
		//creating new model
		if(this.model.isNew()){
			console.log('QuoteDetailsView.save - creating,  ' + this.cid);
			app.quotesCollection.create(this.model, {wait: true});
		}
		
		//saving existing quote details		
		else{
			console.log('QuoteDetailsView.save - saving,  ' + this.cid);
			this.model.save();
		}
		
		return false;
	},    
	
	deleteHandler:function (){
		console.log('QuoteDetailsView.delete - start,  ' + this.cid);
		this.model.destroy({			
			success:function(){
				console.log('QuoteDetailsView.delete - success');
				//TODO: ADD HISTORY GO BACK
				//history go back
			}
		});
	},
	
	close:function(){
		console.log('QuoteDetailsView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
		this.model.unbind("destroy", this.close);
		this.model.unbind("sync", this.render);
	}
});


//===================================================
// Router
//===================================================

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"originsRoute",		
        "origins/:origin_id":"originDetailsRoute",
		//TODO: ADD TREE: ORIGINS/1/QUOTES/2
		"quotes/:id":"quoteDetailsByIdRoute",
    },

    originsRoute:function () {
		//addigorigin collection view
        this.originsCollection = new OriginsCollection();
		if(app.originsListView)app.originsListView.close();
        this.originsListView = new OriginsListView({model:this.originsCollection});
        this.originsCollection.fetch();
        $('#sidebar').html(this.originsListView.el);
		
		//adding origin actions view
		if(app.originActionsView)app.originActionsView.close();
		this.originActionsView = new OriginActionsView();		
		$('#sidebarheader').html(this.originActionsView.el);
    },

    originDetailsRoute:function (origin_id) {		
		//creating origin details view
		this.selectedOrigin = this.originsCollection.get(origin_id);
		if(app.originDetailsView)app.originDetailsView.close();
		this.originDetailsView = new OriginDetailsView({model:this.selectedOrigin});
		$('#sidebardetails').html(this.originDetailsView.el);
		
		//creating list of quotes for current origin and fetching content from server
		this.quotesCollection = new QuotesCollection();
		if(app.quotesListView)app.quotesListView.close();
        this.quotesListView = new QuoteListView({model:this.quotesCollection});
		this.quotesCollection.fetch({data: {origin_id:origin_id}});		
        $('#contentlist').html(this.quotesListView.el);
		
		//adding quote actions view
		if(app.quoteActionsView)app.quoteActionsView.close();
		this.quoteActionsView = new QuoteActionsView();		
		$('#contentlistheader').html(this.quoteActionsView.el);
		
		//removing quote details view
		if(app.quoteDetailsView)app.quoteDetailsView.close();
    },	
	
	quoteDetailsByIdRoute:function (id) {
		this.selectedQuote = this.quotesCollection.get(id);
		if(app.quoteDetailsView)app.quoteDetailsView.close();
        this.quoteDetailsView = new QuoteDetailsView({model:this.selectedQuote});
        $('#content').html(this.quoteDetailsView.el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();