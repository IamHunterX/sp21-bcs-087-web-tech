const authenticatedUser = (req, res, next) => {

    if (req.session.isAuthenticated) {
      console.log("authenticated user");
      next();
    } else {
      //const makeSignError = true;
      console.log("unauthenticated user");
      res.redirect("/");
      return;
    }
  };
  
  module.exports = authenticatedUser;