angular
.module('notes')
.controller('ChangeController', function ($scope, $sce, $uibModalInstance, curr, prev) {
  $scope.title = curr.title;
  $scope.close = function() {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.init = function() {
    var dmp = new diff_match_patch();
    var text1 = prev.note;
    var text2 = curr.note;
    dmp.Diff_Timeout = 1.0;
    var d = dmp.diff_main(text1, text2);
    dmp.diff_cleanupSemantic(d);
    var ds = dmp.diff_prettyHtml(d);
    $scope.diff = $sce.trustAsHtml(ds);
  };
});
