//TODO: Optimize close method boilerplate code
//TODO: do not generate views each time - show/hide and reset data each time instead

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"originsRoute",		
		"origins/new":"createNewOriginRoute",
		"origins/:origin_id":"originDetailsRoute",        
		"origins/:origin_id/quotes/new":"createNewQuoteByIdRoute",
		"origins/:origin_id/quotes/:id":"quoteByIdRoute",
    },

    originsRoute:function () {
		//adding origin collection view
		if(!this.originsCollection){
			this.originsCollection = new OriginsCollection();
		}
		this.originsCollection.fetch();
		
		if(!this.originsListView){
			this.originsListView = new OriginsListView({model:this.originsCollection}); 
		}  
		
		$('#sidebar').html(this.originsListView.el);		
		
		if(this.originView)this.originView.close();
		if(this.quoteView)this.quoteView.close();		
    },

    originDetailsRoute:function (originId) {
		this.setOriginView(this.originsCollection.get(originId));
	},	
	
	createNewOriginRoute:function(){
		this.setOriginView(new OriginModel());
	},
	
	setOriginView:function(originModel){
		//if(this.originModel)this.originModel.unbind();
	
		this.originModel = originModel;
	
		if(!this.originView){
			this.originView = new OriginView({model:this.originModel});
		}
		else{
			this.originView.model = this.originModel;
			this.originView.initialize();
		}
		
		$('#content1').html(this.originView.el);				
		
		//this is workaround. because my way to reuse views kills handlers after reuse
//TODO: think about other reuse method
		this.originView.delegateEvents();
		
		// initializing quotes list

		if(this.quotesCollection)this.quotesCollection.unbind();

		this.quotesCollection = new QuotesCollection();
		
		//if we are showing existing origin, load list of its quotes
		if(!this.originModel.isNew()){
			this.quotesCollection.fetch({data: {origin_id:this.originModel.id}});		
		}
		
		if(!this.quotesListView){
			this.quotesListView = new QuotesListView({model:this.quotesCollection});
		}
		else{
			this.quotesListView.model = this.quotesCollection;
			this.quotesListView.initialize();
		}        
		
		$('#quotesListHolder').html(this.quotesListView.el);
		//--------------------------------------------------
		
		if(this.quoteView)this.quoteView.close();		
	},
	
	createNewQuoteByIdRoute:function (originId) {
		this.setQuoteById(null, new QuoteModel());
	},
	
	quoteByIdRoute:function (originId, quoteId) {
		this.setQuoteById(null, this.quotesCollection.get(quoteId));
	},
	
	setQuoteById:function (origin, quoteModel) {
//TODO: create origin view+model if user navigated here initially

		if(this.quoteModel)this.quoteModel.unbind();		
		
		this.quoteModel = quoteModel;

		if(!this.quoteView){
			this.quoteView = new QuoteView({model:this.quoteModel});
		}
		else{
			this.quoteView.model = this.quoteModel;
			this.quoteView.initialize();
		}        

        $('#content2').html(this.quoteView.el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();