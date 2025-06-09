const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contiene { id, role, ... }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;


/*

Este middleware:
✅ Lee el token del header Authorization.
✅ Verifica el token con jwt.verify().
✅ Si es válido, agrega req.user con los datos decodificados.
✅ Si no, responde con 401 (no autorizado).

*/
