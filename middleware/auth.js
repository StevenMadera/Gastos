import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'supersecretkey';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

export function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '1d' });
}
