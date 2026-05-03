'use strict';
const router       = require('express').Router();
const { body, validationResult } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const User         = require('../models/User');

// Все маршруты защищены
router.use(authenticate);

// ── GET /api/users/me ─────────────────────────────────────────
router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses.course',
        'title slug category tags duration level description previewUrl channel lessonsCount');
    if (!user) return res.status(404).json({ error: 'Не найден' });
    // Flatten enrolledCourses for frontend convenience
    const enrolledCourses = user.enrolledCourses
      .filter(e => e.course != null)
      .map(e => ({
      ...(e.course ? e.course.toObject ? e.course.toObject() : e.course : {}),
      progress: e.progress || 0
    }));
    res.json({ user: { ...user.toObject(), enrolledCourses } });
  } catch (err) { next(err); }
});

// ── PATCH /api/users/me  (имя / аватар) ──────────────────────
router.patch('/me', [
  body('name').optional().trim().isLength({ min: 1, max: 80 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const allowed = ['name', 'avatar'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json({ user });
  } catch (err) { next(err); }
});

module.exports = router;
