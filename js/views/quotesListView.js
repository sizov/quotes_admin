//list of quotes
window.QuotesListView = Backbone.View.extend({
	template:_.template($('#tpl-quotes-list').html()),

    events:{
		"click .addQuote": "addQuoteHandler"
	},

    initialize:function () {
		console.log('QuotesListView.initialize,  ' + this.cid);		
	
        this.model.bind("reset", this.render, this);
		this.model.bind("sync", this.syncHandler, this);
		this.model.bind("add", this.addCollectionElementHandler , this);
		this.model.bind("destroy", this.close, this); //if you delete all quotes of origin
    },	
		
	addQuoteHandler:function(){			
		app.navigate('origins/'+this.options.origin_id+'/quotes/new', true);		
		return false;
	},	
	
	syncHandler:function (){
		console.log("QuoteListView.syncHandler " + this.cid);
	},
	
	addCollectionElementHandler: function(quoteModel){
		console.log("QuotesListView.addHandler - start " + this.cid);
		this.$("#quotesList").append(new QuotesListItemView({model:quoteModel}).el);		
	},

    render:function (eventName) {
		$(this.el).html(this.template());
	
        _.each(this.model.models, function (quoteModel) {
            this.$("#quotesList").append(new QuotesListItemView({model:quoteModel}).el);
        }, this);
        return this;
    },
	
	close:function(){
		console.log('QuoteListView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
		this.model.unbind("reset", this.render, this);
		this.model.unbind("sync", this.syncHandler, this);
		this.model.unbind("add", this.addHandler , this);
		this.model.unbind("destroy", this.close);
	}
});
