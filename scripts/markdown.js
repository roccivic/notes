angular
.module('notes')
.directive('markdown', function ($sanitize) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      function renderMarkdown() {
        var htmlText = markdown.toHTML(scope.$eval(attrs.markdown) || '');
        element.html($sanitize(htmlText));
      }
      scope.$watch(attrs.markdown, function(){
        renderMarkdown();
      });
      renderMarkdown();
    }
  }
});
