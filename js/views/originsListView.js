//list of origins
window.OriginsListView = Backbone.View.extend({
	template:_.template($('#tpl-origins-list').html()),
	
	events:{
		"click .addOrigin": "addOriginHandler"
	},
	
    initialize:function () {
		console.log('OriginsListView.initialize,  ' + this.cid);		
	
        this.model.bind("reset", this.render, this);
		this.model.bind("add", this.addCollectionElementHandler, this);
		this.model.bind("destroy", this.close, this); //if you delete all list
		this.render();
    },

    render:function (eventName) {
		$(this.el).html(this.template());
	
        _.each(this.model.models, function (quoteOriginModel) {
			this.$("#originsList").append(new OriginsListItemView({model:quoteOriginModel}).el);
        }, this);
        return this;
    },	
	
	addOriginHandler:function(event){		
		app.navigate('origins/new', true);		
		return false;
	},
	
	addCollectionElementHandler:function(addedModel){
		console.log("QOriginsListView.addHandler - start " + this.cid);
		this.$("#originsList").append(new OriginsListItemView({model:addedModel}).el);		
	},
	
	close:function(){
		console.log('OriginsListView.close,  ' + this.cid);		
		this.remove();		
		this.unbind();		
		this.model.unbind("reset", this.render);
		this.model.unbind("destroy", this.close);		
	}
});