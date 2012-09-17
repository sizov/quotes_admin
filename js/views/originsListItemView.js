//item in list of origins
window.OriginsListItemView = Backbone.View.extend({
    tagName:"li",
	
    template:_.template($('#tpl-origins-list-item').html()),
	
	initialize:function(){
		console.log("OriginsListItemView.initialize " + this.cid + ", model=" + this.model.cid);
		
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
	
		this.render();
	},

    render:function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },
	
	close:function () {		
		console.log("OriginsListItemView.close " + this.cid);		
		
		this.remove();		
		this.unbind();
		
		this.model.unbind("change", this.render);
		this.model.unbind("destroy", this.close);
	}
});
