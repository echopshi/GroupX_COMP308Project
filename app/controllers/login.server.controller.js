const User = require("mongoose").model("User");

const getErrorMessage = function (err) {
  var message = "";
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "username already exists";
        break;
      default:
        message = "something went wrong";
    }
  } else {
    for (const errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

exports.index = function (req, res) {
  res.render("index", {
    heading: "Express REST API",
  });
};

exports.create = function (req, res) {
  const user = new User(req.body);
  user.provider = "local";
  user.save((err) => {
    if (err) {
      const message = getErrorMessage(err);
      req.flash("error", message); //save the error into flash memory.
      return next(err);
    } else {
      return res.json(user);
    }
  });
};

exports.welcome = function (req, res) {
  if (!req.user) {
    return res.send({ screen: "auth" }).end();
  }
  res.status(200).send({
    screen: `Welcome user: ${req.user.username}!`,
  });
};

exports.signout = function (req, res) {
  req.logout();
  req.session.destroy();
  return res.status("200").json({ message: "signed out" });
};

exports.isSignedIn = (req, res) => {
  if (!req.user) {
    return res.send({ screen: "auth" }).end();
  }
  return res.send({ screen: `Welcome user: ${req.user.username}!` }).end();
};