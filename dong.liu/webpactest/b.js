import ngs from './module.js';
import './index/index.js';
import './login/login.js';
import './list/list.js';
import './detail/detail.js';
import './create/create.js';
import './index/index.js';
ngs.run(function(netService, $rootScope, $state) {
    //初始化total界面用户名，登录退出按钮的状态
    $rootScope.userstatic = false;
    $rootScope.userstaticed = false;
    //登录按钮，点击前往登录页面
    $rootScope.logined = function() {
      $rootScope.userstatic = false;
      $rootScope.userstaticed = false;
      $state.go("login");
    };
    // netService
    //   .getlist(1, 100)
    //   .then(result => {
    //     $rootScope.lists = result.data.data;
    //     $rootScope.totalCount = $rootScope.lists.length;
    //   })
    //   .catch(err => {});

    //退出按钮，点击退出当前登录账号
    $rootScope.logout = function() {
      netService
        .logout()
        .then(result => {
          alert("您已退出");
          $rootScope.userstatic = false;
          $rootScope.userstaticed = true;
          $state.reload();
        })
        .catch(err => {});
    };
    $rootScope.getstatic = function() {
      netService
        .CurrentUser()
        .then(result => {
          $rootScope.username = result.data.data.userName;
          if (result.data.data.isAuthenticated == true) {
            $rootScope.userstatic = true;
            $rootScope.userstaticed = false;
          } else {
            $rootScope.userstatic = false;
            $rootScope.userstaticed = true;
          }
        })
        .catch(err => {});
    };
  })
  .factory("netService", [
    "$http",
    function($http) {
      return {
        //登录服务
        login: (username, password) => {
          return $http.post("/api/login", {
            username,
            password
          });
        },
        //获取指定页码服务
        getlist: (pageIndex, pageSize) => {
          return $http.get("/api/weibo/get", {
            params: {
              pageSize,
              pageIndex
            }
          });
        },
        //新增或编辑服务
        create: (id, title, content) => {
          return $http.post("/api/weibo/update", {
            id,
            title,
            content
          });
        },
        //用户名
        CurrentUser: () => {
          return $http.get("/api/getCurrentUser", {});
        },
        //退出
        logout: () => {
          return $http.get("/api/logout", {});
        },
        //删除服务
        delete: id => {
          return $http.post(`/api/weibo/delete/${id}`, {});
        },
        //详情服务
        detail: id => {
          return $http.get(`/api/weibo/get/detail/${id}`, {});
        }
      };
    }
  ]) //路由部分
  .config(function($stateProvider, $urlRouterProvider) {
      console.log("路由");
    $urlRouterProvider.otherwise("login");
    $stateProvider
      //登录页
      .state("login", {
        url: "/login",
        template: require("./login/login.html"),
        controller: "LoginController"
      })
      //首页
      .state("index", {
        url: "/index",
        template: require("./index/index.html"),
        // templateUrl: "./index.html",
        controller: "IndexController"
      })
      //列表页
      .state("list", {
        url: "/list",
        template: require("./list/list.html"),
        // templateUrl: "./list.html",
        controller: "ListController"
      })
      //编辑页面
      .state("create", {
        url: "/create/:id",
        template: require("./create/create.html"),
        // templateUrl: "./create.html",
        controller: "CreateController"
      })
      //详情页
      .state("detail", {
        url: "/detail/:id",
        template: require("./detail/detail.html"),
        // templateUrl: "./detail.html",
        controller: "DetailController"
      });
  })
