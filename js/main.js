//TODO: Optimize close method boilerplate code
//TODO: do not generate views each time - show/hide and reset data each time instead

var AppRouter = Backbone.Router.extend({

    routes:{
        "":"originsRoute",		
		"origins/new":"createNewOriginRoute",
		"origins/:origin_id":"originDetailsRoute",        
		"origins/:origin_id/quotes/:id":"quoteDetailsByIdRoute",
//TODO: add new route for creation of quote
    },

    originsRoute:function () {
		//adding origin collection view
        this.originsCollection = new OriginsCollection();
		this.originsCollection.fetch();
		
		if(this.originsListView)this.originsListView.close();
		if(this.originView)this.originView.close();
		if(this.quoteView)this.quoteView.close();		
		
        this.originsListView = new OriginsListView({model:this.originsCollection, el:$('#sidebar')}); 
    },

    originDetailsRoute:function (originId) {
		this.setOriginView(this.originsCollection.get(originId));
	},	
	
	createNewOriginRoute:function(){
		this.setOriginView(new OriginModel());
	},
	
	setOriginView:function(originModel){
//TODO: is that ok to unbind model?
		if(this.originModel)this.originModel.unbind();
	
		this.originModel = originModel;
	
//TODO: reuse OriginView created earlier
		if(this.originView)this.originView.close();
		this.originView = new OriginView({model:this.originModel});
		
		$('#content1').html(this.originView.el);

		if(this.quoteView)this.quoteView.close();		
	},
	
	quoteDetailsByIdRoute:function (originId, quoteId) {
//TODO: create origin view+model if user navigated here initially

//TODOL is that ok to unbind model?
		if(this.quoteModel)this.quoteModel.unbind();
		
		
		//check if we were navigated to creating new quote	
		if(quoteId === "new"){
			this.quoteModel = new QuoteModel();		
		}
		
		//if we navigated to details of existing quote
		else{
			this.quoteModel = this.quotesCollection.get(quoteId);		
		}

//TODO: reuse created QuoteView created earlier				
		if(this.quoteView)this.quoteView.close();
        this.quoteView = new QuoteView({model:this.quoteModel});
        $('#content2').html(this.quoteView.el);
    }	
	
});

var app = new AppRouter();
Backbone.history.start();