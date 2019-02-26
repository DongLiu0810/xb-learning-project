import ngs from '../module.js';
ngs.component("page", {
    //templateUrl: "./page.html",
    template: require('./page.html'),
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
