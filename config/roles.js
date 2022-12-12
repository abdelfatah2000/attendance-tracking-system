const authPage = (permission) => {
  return (req, res, next) => {
    const role = req.session.user.role;
    if(permission.includes(role)) {
      next();
    } else {
      return res.redirect(`/${role}/home`)
    }
  }
}

module.exports = { authPage}