//item in list of origins
window.OriginsListItemView = Backbone.View.extend({
    tagName:"li",
	
    template:_.template($('#tpl-origins-list-item').html()),
	
	initialize:function(){
		this.render('test');
	},

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});
