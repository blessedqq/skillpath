'use strict';
const router    = require('express').Router();
const jwt       = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const User      = require('../models/User');

// Жёсткий лимит на auth-эндпоинты
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Слишком много попыток. Попробуйте через 15 минут.' }
});

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Имя обязательно').isLength({ max: 80 }),
  body('email').isEmail().normalizeEmail().withMessage('Некорректный email'),
  body('password').isLength({ min: 6 }).withMessage('Минимум 6 символов')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email уже используется' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ error: 'Неверный email или пароль' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Неверный email или пароль' });

    const token = signToken(user);
    res.json({ token, user });
  } catch (err) { next(err); }
});

// ── POST /api/auth/logout ─────────────────────────────────────
const authenticate = require('../middleware/authenticate');
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    res.json({ message: 'Выход выполнен' });
  } catch (err) { next(err); }
});

// ── GET /api/auth/me ─────────────────────────────────────────
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses.course', 'title slug category');
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
    res.json({ user });
  } catch (err) { next(err); }
});

module.exports = router;
