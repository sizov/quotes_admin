window.OriginsCollection = Backbone.Collection.extend({
    model:OriginModel,
    url:"api/origins"
});
