import ngs from '../module.js';
ngs.controller("DetailController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
      console.log("详情");

      //刷新页面时，用户信息以及上方登陆退出按钮的显示状态控制
      $rootScope.getstatic();
      //根据列表页传过来的id值取到本条数据的所有信息
      netService
        .detail($state.params.id)
        .then(result => {
          $scope.item = result.data.data;
        })
        .catch(err => {});
      //判断管理员
      $scope.static = false;
      var admin = JSON.parse(localStorage.getItem("admin"));
      if (admin.username == "admin") {
        $scope.static = true;
      }
      //添加跳转至编辑页
      $scope.create = function(id) {
        $state.go("create", { id: id });
      };
    }
  ]) //编辑添加
  