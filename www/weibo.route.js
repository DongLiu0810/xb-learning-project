var express = require("express");
var moment = require("moment");
var Response = require("./Response");

var router = express.Router();

let dataSource = {
  blogList: []
};

let getMaxId = (() => {
  let _id = dataSource.blogList.reduce((val, max) => Math.max(val.id, max), 0);
  return () => {
    return ++_id;
  };
})();

/* GET test */
router.all("/api/test", function (req, res, next) {
  res.json(new Response(null, "一条测试消息"));
});

// 读取
router.get("/api/weibo/get", function (req, res, next) {
  let pageSize = Number(req.query.pageSize);
  let pageIndex = Number(req.query.pageIndex);
  let keyWord = req.query.keyword;

  if (isNaN(pageSize) || pageSize < 1 || isNaN(pageIndex) || pageIndex < 1) {
    return res.json(new Response(null, "参数错误", 100001));
  }
  let source = keyWord ? dataSource.blogList.filter(x => x.title.indexOf(keyWord) !== -1) : dataSource.blogList;
  let list = source.slice(pageSize * (pageIndex - 1), pageSize * pageIndex).map(x => {
    return {
      id: x.id,
      title: x.title,
      creater: x.creater,
      createdAt: x.createdAt,
    };
  });
  res.json(
    new Response({
      list,
      currentIndex: pageIndex,
      itemCount: list.length,
      totalCount: source.length
    })
  );
});

// 读取
router.get("/api/weibo/get/detail/:id", function (req, res, next) {
  let id = req.params.id;

  if (!id) {
    return res.json(new Response(null, "参数错误", 100001));
  }

  let blog = dataSource.blogList.find(x => x.id == id);
  if (!blog) {
    return res.json(new Response(null, "参数错误", 100001));
  }
  res.json(new Response(blog));
});

// 新增/更新
router.post("/api/weibo/update", function (req, res, next) {
  let id = req.body.id,
    isCreateNew = !id;

  if (!req.body.title || !req.body.content) {
    return res.json(new Response(null, "参数错误：填写不完整", 100003));
  }

  if (isCreateNew) {
    let blog = {
      id: getMaxId(),
      title: req.body.title,
      content: req.body.content,
      createdAt: moment().format('YYYY/MM/DD HH:mm:ss'),
      creater: req.session.currentUser ? req.session.currentUser.userName : 'anonymous',
      updatedAt: '',
    }
    dataSource.blogList.unshift(blog); // 反向插入，使得取出时从新到旧
  } else {
    let blog = dataSource.blogList.find(x => x.id == id);
    if (!blog) {
      return res.json(new Response(null, "参数错误：数据未找到", 100002));
    }
    blog.title = req.body.title;
    blog.content = req.body.content;
    blog.updater = req.session.currentUser ? req.session.currentUser.userName : 'anonymous',
      blog.updatedAt = moment().format('YYYY/MM/DD HH:mm:ss');
  }

  res.json(new Response(null, "保存成功"));
});

// 删除
router.post("/api/weibo/delete/:id", function (req, res, next) {
  let id = req.params.id;
  let index = dataSource.blogList.findIndex(x => x.id == id);

  if (!id || index == -1) {
    return res.json(new Response(null, "参数错误：数据未找到", 100002));
  }

  dataSource.blogList.splice(index, 1);
  res.json(new Response(null, "删除成功"));
});

module.exports = router;