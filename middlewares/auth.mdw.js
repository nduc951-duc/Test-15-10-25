
export function restrict(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/account/signin');
    }
  }

  export function restrictAdmin(req, res, next) {
    if (req.session.authUser.permission === 1) {
        next();
    } else {
        res.status(403).render('403');
    }

}