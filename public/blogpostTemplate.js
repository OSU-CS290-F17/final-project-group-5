(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['blogpost'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"blog-post\" data-id=\""
    + alias4(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\r\n    <h2 id=\"blog-post-title\">"
    + alias4(((helper = (helper = helpers.postTitle || (depth0 != null ? depth0.postTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"postTitle","hash":{},"data":data}) : helper)))
    + "</h2>\r\n    <h3 id=\"blog-post-date\">"
    + alias4(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"date","hash":{},"data":data}) : helper)))
    + "</h3>\r\n    <p>\r\n        "
    + alias4(((helper = (helper = helpers.info || (depth0 != null ? depth0.info : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"info","hash":{},"data":data}) : helper)))
    + "\r\n    </p>\r\n    <button class=\"delete-blog-post\">X</button>\r\n</div>";
},"useData":true});
})();