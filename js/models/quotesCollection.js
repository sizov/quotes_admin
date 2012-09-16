window.QuotesCollection = Backbone.Collection.extend({
    model:QuoteModel,
	url: "api/quotes"
});
