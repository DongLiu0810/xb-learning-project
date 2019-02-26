import ngs from '../module.js';
ngs.controller("IndexController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
      console.log("首页");

      //刷新页面时，用户信息以及上方登陆退出按钮的显示状态控制
      $rootScope.getstatic();
      //查看更多去列表页
      $scope.getlist = function() {
        $state.go("list");
      };
      //初始5条数据
      $scope.pageSize = 5;
      $scope.pageIndex = 1;
      netService
        .getlist($scope.pageIndex, $scope.pageSize)
        .then(result => {
          $scope.lists = result.data.data.list;
        })
        .catch(err => {});
    }
  ])