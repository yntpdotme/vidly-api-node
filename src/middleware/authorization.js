export default (roles = []) =>
  async (req, res, next) => {
    if (!req.employee?._id) return res.status(401).json('Unauthorized request');

    if (roles.includes(req.employee?.role)) {
      next();
    } else {
      return res.status(403).json('You are not allowed to perform this action');
    }

    next();
  };
