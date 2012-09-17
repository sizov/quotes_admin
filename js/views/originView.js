//details of origin
window.OriginView = Backbone.View.extend({
	template:_.template($('#tpl-origin').html()),
	
	events:{
		"click .deleteOrigin": "deleteOriginHandler",
		"click .saveOrigin": "saveOriginHandler",		
		"click .addQuote": "addQuoteHandler"
	},
	
	initialize: function() {
		console.log('OriginView.initialize,  ' + this.cid);			
		
		this.model.bind("destroy", this.close, this);
		this.model.bind("sync", this.render, this);
		
		this.render(this.model);
	},
	
	render: function(model) {
		$(this.el).html(this.template(this.model.toJSON()));				
	},
	
	deleteOriginHandler:function(){		
		console.log('OriginView.delete - start,  ' + this.cid);
		
		this.model.destroy({			
			success:function(){
				console.log('OriginView.delete - success');
				window.history.back();
			}
		});
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
	
	addQuoteHandler:function(){			
		app.navigate('origins/'+this.model.id+'/quotes/new', true);		
		return false;
	},	
	

	
	close:function(){
		console.log('OriginView.close,  ' + this.cid);		
		
		this.remove();		
		this.unbind();	

		this.model.unbind("destroy", this.close);
		this.model.unbind("sync", this.render);		
	}
});
