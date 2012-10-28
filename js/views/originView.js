//details of origin
window.OriginView = Backbone.View.extend({
	template:_.template($('#tpl-origin').html()),
	
	events:{
		"click .deleteOrigin": "deleteOriginHandler",
		"click .saveOrigin": "saveOriginHandler"
	},
	
	initialize: function() {
		console.log('OriginView.initialize,  ' + this.cid);			
		
		this.model.bind("destroy", this.close, this);
		this.model.bind("sync", this.render, this);
		
		this.render();
	},
	
	render: function() {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;		
	},
	
	deleteOriginHandler:function(){		
		console.log('OriginView.delete - start,  ' + this.cid);
		
		//TODO: do we need to delete related quotes?
		
		this.model.destroy({			
			success:function(){
				console.log('OriginView.delete - success');
				app.navigate('', true);		
			}
		});
	},
	
	saveOriginHandler:function(){	
		//TODO: check if origin has changes
		this.saveOrigin();
		
		//TODO: check if quote has changes
		if(app.quoteModel){
			this.saveSelectedQuote();
		}
		
		return false;
	},  

	//saves origin
	saveOrigin:function(){
		this.model.set({
			origin_text:$('#originText').val(),
			type_id:parseInt($('#originTypeId').val(), 10),
			language_id:parseInt($('#originLanguageId').val(), 10)
		});
	
		//if we need - create new model
		if(this.model.isNew()){
			console.log('OriginView.save - creating,  ' + this.cid);
			app.originsCollection.create(this.model, {
				wait: true,
				success:function(model, response){
					console.log('OriginView.saveOrigin - success,  ');
					app.navigate('origins/'+model.get('id'), true);
				}
			});
			
			//TODO: navigate to new ID and also, sync with quotes creation (when both are new)
		}
		
		//saving existing quote details		
		else{
			console.log('OriginView.save - saving,  ' + this.cid);
			this.model.save();
		}
	},
	
	//saves selected quote
	saveSelectedQuote:function(){
		//creating new model
		if(app.quoteModel.isNew()){
			console.log('OriginView.saveSelectedQuote - creating quote,  ' + this.cid);
			
			app.quotesCollection.create(app.quoteModel, {
				wait: true,
				success:function(model, response){
					console.log('OriginView.saveSelectedQuote - success,  ');
					app.navigate('origins/'+app.originModel.get('originId')+'/quotes/'+app.quoteModel.get("id"), true);
				}
			});
		}
		
		//saving existing quote details		
		else{
			console.log('OriginView.saveSelectedQuote - saving quote,  ' + this.cid);
			app.quoteModel.save();
		}
	},
	
	close:function(){
		console.log('OriginView.close,  ' + this.cid);		
		
		this.remove();		
		this.unbind();	

		this.model.unbind("destroy", this.close);
		this.model.unbind("sync", this.render);		
	}
});
