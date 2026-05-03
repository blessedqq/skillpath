'use strict';
const jwt             = require('jsonwebtoken');
const { getClient }   = require('../db/redis');

/**
 * Проверяет JWT из заголовка Authorization: Bearer <token>
 * Также проверяет Redis-блэклист (на случай logout)
 */
module.exports = async function authenticate(req, res, next) {
  try {
    const header = req.headers['authorization'] || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Проверяем блэклист в Redis
    const redis = getClient();
    const blocked = await redis.get(`bl:${token}`);
    if (blocked) {
      return res.status(401).json({ error: 'Токен отозван. Войдите снова.' });
    }

    req.user = payload;   // { id, email, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};
