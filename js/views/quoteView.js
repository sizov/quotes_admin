//quote view
window.QuoteView = Backbone.View.extend({
    template:_.template($('#tpl-quote').html()),
	
	events:{
		"click .save":"saveHandler",
		"click .delete":"deleteHandler"
	},
	
	initialize:function(){
		console.log('QuoteView.initialize - start,  ' + this.cid + ", model=" + this.model.cid);
		
		this.model.bind("destroy", this.close, this);
		this.model.bind("sync", this.render, this);
		this.render('test');
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
		console.log('QuoteView.delete - start,  ' + this.cid);
		this.model.destroy({			
			success:function(){
				console.log('QuoteView.delete - success');
				window.history.back();
			}
		});
	},
	
	close:function(){
		console.log('QuoteView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
		this.model.unbind("destroy", this.close);
		this.model.unbind("sync", this.render);
	}
});