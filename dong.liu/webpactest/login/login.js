import ngs from '../module.js';
ngs.controller("LoginController", [
    "$scope",
    "netService",
    "$state",
    function($scope, netService, $state) {
      console.log("登录");
      //登录页面每次进入的时候确保无用户登录
      netService
        .logout()
        .then(result => {})
        .catch(err => {});
      //登录
      $scope.login = function() {
        var msg = { username: $scope.username, password: $scope.password };
        //存入localstorage
        localStorage.setItem("admin", JSON.stringify(msg));
        netService
          .login($scope.username, $scope.password)
          .then(result => {
            //登陆成功会跳转
            if (result.data.state == 0) {
              $state.go("index");
            }
          })
          .catch(err => {});
      };
    }
  ])
