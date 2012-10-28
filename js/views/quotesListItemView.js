//item in list of quotes
window.QuotesListItemView = Backbone.View.extend({
    tagName:"li",
	
	template:_.template($('#tpl-quotes-list-item').html()),
	
	events:{
		"click a": "navigateToQuote"
	},
	
	initialize:function(){
		console.log("QuotesListItemView.initialize " + this.cid + ", model=" + this.model.cid);
		
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
		
		this.render();
	},
	
	render:function (eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
	
	navigateToQuote:function(event){
		event.preventDefault();
		app.navigate('origins/'+app.originModel.get('id')+'/quotes/'+this.model.get('id'), true);		
	},
	
	close:function () {		
		console.log("QuotesListItemView.close " + this.cid);		
		
		this.remove();		
		this.unbind();
		
		this.model.unbind("change", this.render);
		this.model.unbind("destroy", this.close);
	}
});
