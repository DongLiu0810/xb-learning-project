var Response = require("./Response");
var router = require("express").Router();

router.post("/api/login", function(req, res, next) {
  let userName = req.body.username;
  let password = req.body.password;

  if (!userName || !password) {
    return res.json(new Response(null, "参数错误", 100001));
  }

  req.session.currentUser = {
    isAuthenticated: true,
    isAdmin: userName === "admin",
    userName
  };
  res.json(new Response(null, "登录成功"));
});

router.get("/api/getCurrentUser", function(req, res, next) {
  if (req.session.currentUser) {
    res.json(new Response(req.session.currentUser));
  } else {
    return res.json(
      new Response({
        isAuthenticated: false
      })
    );
  }
});

router.get("/api/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    res.json(new Response());
  });
});

module.exports = router;
