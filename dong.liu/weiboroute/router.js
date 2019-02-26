angular
  .module("ngRouteExample", ["ui.router"])
  .run(function(netService, $rootScope, $state) {
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
    $urlRouterProvider.otherwise("login");
    $stateProvider
      //登录页
      .state("login", {
        url: "/login",
        templateUrl: "./login.html",
        controller: "LoginController"
      })
      //首页
      .state("index", {
        url: "/index",
        templateUrl: "./index.html",
        controller: "IndexController"
      })
      //列表页
      .state("list", {
        url: "/list",
        templateUrl: "./list.html",
        controller: "ListController"
      })
      //编辑页面
      .state("create", {
        url: "/create/:id",
        templateUrl: "./create.html",
        controller: "CreateController"
      })
      //详情页
      .state("detail", {
        url: "/detail/:id",
        templateUrl: "./detail.html",
        controller: "DetailController"
      });
  })
  //登录
  .controller("LoginController", [
    "$scope",
    "netService",
    "$state",
    function($scope, netService, $state) {
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
  ]) //首页
  .controller("IndexController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
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
  ]) //列表页
  .controller("ListController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
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
  .controller("DetailController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
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
  .controller("CreateController", [
    "$scope",
    "netService",
    "$state",
    "$rootScope",
    function($scope, netService, $state, $rootScope) {
      //刷新页面时，用户信息以及上方登陆退出按钮的显示状态控制
      $rootScope.getstatic();
      //判断是否有传过来的id值
      if ($state.params.id == 0) {
        id = "";
      } else {
        id = $state.params.id;
        netService
          .detail(id)
          .then(result => {
            $scope.title = result.data.data.title;
            $scope.content = result.data.data.content;
          })
          .catch(err => {});
      }
      //保存
      $scope.create = function() {
        netService
          .create(id, $scope.title, $scope.content)
          .then(result => {
            alert("保存成功");
            $state.go("list");
          })
          .catch(err => {});
      };
    }
  ])
  .component("page", {
    templateUrl: "./page.html",
    //template: require('./page.html'),
    controller: function($scope) {
      $scope.list = [];
      this.getlists = function(indexs) {
        $scope.fabricIsSelected=indexs;
        if (indexs == this.pageIndex - 1) {
          if (this.pageIndex > 1) {
            this.pageIndex = indexs;

          } else {
            alert("已经第一页了");
          }
        } else if (indexs == this.pageIndex + 1) {
          if (this.pageIndex < this.pagecount) {
            this.pageIndex = indexs;
          } else {
            alert("最后一页了");
          }
        } else {
          this.pageIndex = indexs;
        }
        
        return this.getList({ index: this.pageIndex, size: this.pageSize });
      };

      this.pagechange = function(size) {
        this.pageIndex = Math.floor(
          ((this.pageIndex - 1) * this.pageSize) / size + 1
        );
        this.pageSize = size;
        this.pagecount = Math.ceil(this.totalCount / this.pageSize);
        $scope.list = [];
        for ($scope.count = 1; $scope.count <= this.pagecount; $scope.count++) {
          $scope.list.push($scope.count);
        }
        return this.getList({ index: this.pageIndex, size: this.pageSize });
      };
      // this.$onInit = function() {
      //   this.pagecount = Math.ceil(this.totalCount / this.pageSize);
      //   for ($scope.count = 1; $scope.count <= this.pagecount; $scope.count++) {
      //     $scope.list.push($scope.count);
      //   }
      // };

      this.$onChanges = function(changes) {
        if (changes.totalCount) {
          this.pagecount = Math.ceil(this.totalCount / this.pageSize);
          $scope.list = [];
          for (
            $scope.count = 1;
            $scope.count <= this.pagecount;
            $scope.count++
          ) {
            $scope.list.push($scope.count);
          }
        }
      };

      // var changes = (val) => {
      //   console.log('changes', val);
      // }

      // var aaa = {
      //   get b(){
      //     return this._b;
      //   },
      //   set b(val) {
      //     this._b = val;
      //     changes(val);
      //   }
      // }
    },
    bindings: {
      pageSize: "=",
      pageIndex: "=",
      totalCount: "<",
      getList: "&"
    }
  });
