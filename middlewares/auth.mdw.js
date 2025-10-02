
export function restrict(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/account/signin');
    }
  }
