import ngs from '../module.js';
import '../page/page.js';
ngs.controller("ListController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
      console.log("列表");

      //刷新页面时，用户信息以及上方登陆退出按钮的显示状态控制
      $rootScope.getstatic();
      $scope.pageSize = 5;
      $scope.pageIndex = 1;
      $scope.static = false;
      var admin = JSON.parse(localStorage.getItem("admin"));
      if (admin.username == "admin") {
        $scope.static = true;
      }
      //获取指定页码的10条数据
      $scope.getlist = function(index, size) {
        netService
          .getlist(index, size)
          .then(result => {
            $scope.lists = result.data.data.list;
            $scope.totalCount = result.data.data.totalCount;
          })
          .catch(err => {});
      };
      $scope.getlist($scope.pageIndex, $scope.pageSize);
      //新建按钮，前往新建页
      $scope.create = function() {
        $state.go("create", { id: 0 });
      };
      //删除，成功弹窗
      $scope.delete = function(id) {
        netService
          .delete(id)
          .then(result => {
            $state.reload();
          })
          .catch(err => {});
      };
      //详情跳转至详情页
      $scope.detail = function(id) {
        $state.go("detail", { id: id });
      };
    }
  ]) //详情
  