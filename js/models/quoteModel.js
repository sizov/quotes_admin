window.QuoteModel = Backbone.Model.extend({	
	urlRoot:"api/quotes",
	defaults:{
		id:null,
		quote_text:"New Quote",
		language_id:1,
		comments:null
	}	
});
