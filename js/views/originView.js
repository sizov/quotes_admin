//details of origin
window.OriginView = Backbone.View.extend({
	template:_.template($('#tpl-origin').html()),
	
	events:{
		"click .deleteOrigin": "deleteOriginHandler",
		"click .saveOrigin": "saveOriginHandler"
	},
	
	initialize: function() {
		console.log('OriginView.close,  ' + this.cid);		
	
		this.render(this.model);
		
//TODO: maybe it's not the best idea to create models from view, do that from router? parent model?
		
		//creating list of quotes for current origin and fetching content from server		
//TODO: should we remove bindings from old collection?		
		app.quotesCollection = new QuotesCollection();
		app.quotesCollection.fetch({data: {origin_id:this.model.id}});		
		
		if(this.quotesListView)this.quotesListView.close();
        this.quotesListView = new QuotesListView({model:app.quotesCollection, origin_id:this.model.id});
		
		this.$('#quotesListHolder').html(this.quotesListView.el);
	},
	
	render: function(model) {
//TODO: if we are going to reuse this view (not create new each time), then we have to set QuoteView here, not in "initialize"
		$(this.el).html(this.template(this.model.toJSON()));				
	},
	
	deleteOriginHandler:function(){		
		alert("deleting origin");
		return false;
	},
	
	saveOriginHandler:function(){		
		this.model.set({
			origin_text:$('#originText').val(),
			type_id:$('#originTypeId').val()
		});
	
		//if we need - create new model
		if(this.model.isNew()){
			console.log('OriginView.save - creating,  ' + this.cid);
			app.originsCollection.create(this.model, {wait: true});
		}
		
		//saving existing quote details		
		else{
			console.log('OriginView.save - saving,  ' + this.cid);
			this.model.save();
		}
		
		return false;
	},   
	
	close:function(){
		console.log('OriginView.close,  ' + this.cid);		
		
//TODO: remove and unbind QuotesListView				
		this.quotesListView.close();
		
		this.remove();		
		this.unbind();		
	}
});
