//TODO: Optimize close method boilerplate code
//TODO: do not generate views each time - show/hide and reset data each time instead

var AppRouter = Backbone.Router.extend({

	closeOriginsListAndCollection:function(){
		if(this.originsCollection){
			this.originsCollection.unbind();
			this.originsCollection = null;
		}
		if(this.originsListView){
			this.originsListView.close();
			this.originsCollection = null;
		}
	},
	
	closeOriginModelAndView:function(){
		if(this.originModel){
			this.originModel.unbind();
			this.originModel = null;
		}
		if(this.originView){
			this.originView.close();
			this.originView = null;
		}
	},
	
	closeQuotesListAndCollection:function(){
		if(this.quotesCollection){
			this.quotesCollection.unbind();
			this.quotesCollection = null;
		}
		if(this.quotesListView){
			this.quotesListView.close();
			this.quotesListView = null;
		}
	},
	
	closeQuoteModelAndView:function(){
		if(this.quoteModel){
			this.quoteModel.unbind();
			this.quoteModel = null;
		}
		if(this.quoteView){
			this.quoteView.close();
			this.quoteView = null;
		}
	},

    routes:{
        "":"originsRoute",		
		"origins/new":"createNewOriginRoute",
		"origins/:origin_id":"originDetailsRoute",        
		"origins/:origin_id/quotes/new":"createNewQuoteByIdRoute",
		"origins/:origin_id/quotes/:id":"quoteByIdRoute",
    },

    originsRoute:function () {
		this.closeOriginsListAndCollection();
		this.closeOriginModelAndView();
		this.closeQuotesListAndCollection();
		this.closeQuoteModelAndView();
		
		this.originsCollection = new OriginsCollection();
		this.originsCollection.fetch();
		this.originsListView = new OriginsListView({model:this.originsCollection}); 
		
		$('#sidebar').html(this.originsListView.el);				
    },

    originDetailsRoute:function (originId) {
		this.setOriginView(this.originsCollection.get(originId));
	},	
	
	createNewOriginRoute:function(){
		this.setOriginView(new OriginModel());
	},
	
	setOriginView:function(originModel){
//TODO: create origin view+model if user navigated here initially		
	
		this.closeOriginModelAndView();
		this.closeQuotesListAndCollection();
		this.closeQuoteModelAndView();
	
		this.originModel = originModel;
		this.originView = new OriginView({model:this.originModel});
		
		$('#content1').html(this.originView.el);				
		
		// initializing quotes list
		this.quotesCollection = new QuotesCollection();
		
		//if we are showing existing origin, load list of its quotes
		if(!this.originModel.isNew()){
			this.quotesCollection.fetch({data: {origin_id:this.originModel.id}});		
		}		
		this.quotesListView = new QuotesListView({model:this.quotesCollection});	
		
		$('#quotesListHolder').html(this.quotesListView.el);		
	},
	
	createNewQuoteByIdRoute:function (originId) {
		this.setQuoteById(originId, new QuoteModel());
	},
	
	quoteByIdRoute:function (originId, quoteId) {
		this.setQuoteById(originId, this.quotesCollection.get(quoteId));
	},
	
	setQuoteById:function (originId, quoteModel) {
//TODO: create origin view+model if user navigated here initially

		this.closeQuoteModelAndView();
		
		this.quoteModel = quoteModel;
		this.quoteView = new QuoteView({model:this.quoteModel, originId:originId});

        $('#content2').html(this.quoteView.el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();