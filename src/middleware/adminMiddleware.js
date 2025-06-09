const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

module.exports = adminMiddleware;


/* 

Este middleware:
✅ Revisa req.user.role.
✅ Si es 'admin', deja pasar.
✅ Si no, responde con 403 (prohibido).


*/