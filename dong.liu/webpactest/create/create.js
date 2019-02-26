import ngs from '../module.js';
ngs.controller("CreateController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
      console.log("编辑");

      //刷新页面时，用户信息以及上方登陆退出按钮的显示状态控制
      $rootScope.getstatic();
      //判断是否有传过来的id值
      if ($state.params.id == 0) {
        $scope.id = "";
      } else {
        $scope.id = $state.params.id;
        netService
          .detail($scope.id)
          .then(result => {
            $scope.title = result.data.data.title;
            $scope.content = result.data.data.content;
          })
          .catch(err => {});
      }
      //保存
      $scope.create = function() {
        netService
          .create($scope.id, $scope.title, $scope.content)
          .then(result => {
            alert("保存成功");
            $state.go("list");
          })
          .catch(err => {});
      };
    }
  ])
  