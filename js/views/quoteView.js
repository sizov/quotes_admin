//quote view
window.QuoteView = Backbone.View.extend({
    template:_.template($('#tpl-quote').html()),
	
	events:{
		"click .deleteQuote":"deleteHandler",
		
		"change #quoteText":"quoteTextChangeHandler",
		"change #quoteLanguageId":"languageIdChangeHandler",
		"change #comments":"commentsChangeHandler",
	},
	
	initialize:function(){
		console.log('QuoteView.initialize - start,  ' + this.cid + ", model=" + this.model.cid);
		
		this.model.bind("destroy", this.close, this);
		this.model.bind("sync", this.render, this);
		
		this.render();
	},
	
	render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
	
	quoteTextChangeHandler:function(){
		this.updateModelProperty("quote_text", $('#quoteText').val());		
	},
	
	languageIdChangeHandler:function(){
		this.updateModelProperty("language_id", parseInt($('#quoteLanguageId').val(), 10));		
	},
	
	commentsChangeHandler:function(){
		this.updateModelProperty("comments", $('#comments').val());		
	},
	
	updateModelProperty:function(property, value){
		var update = {};
		update[property] = value;
		this.model.set(update);
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