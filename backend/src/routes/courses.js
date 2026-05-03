'use strict';
const router       = require('express').Router();
const Course       = require('../models/Course');
const authenticate = require('../middleware/authenticate');

// ── GET /api/courses  (публичный — список) ────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;

    const courses = await Course.find(filter)
      .select('-videoUrl')   // videoUrl — только авторизованным, previewUrl/channel открыты
      .sort({ createdAt: -1 })
      .lean();
    res.json({ courses });
  } catch (err) { next(err); }
});

// ── GET /api/courses/:slug  (защищённый — полные данные + видео) ─
router.get('/:slug', authenticate, async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).lean();
    if (!course) return res.status(404).json({ error: 'Курс не найден' });
    res.json({ course });
  } catch (err) { next(err); }
});

// ── POST /api/courses/:slug/enroll  (запись на курс) ─────────
const User = require('../models/User');
router.post('/:slug/enroll', authenticate, async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ error: 'Курс не найден' });

    let user = await User.findById(req.user.id);
    const already = user.enrolledCourses.some(e => e.course.equals(course._id));
    if (!already) {
      user.enrolledCourses.push({ course: course._id });
      await user.save();
    }
    // Re-fetch with populate so frontend gets full course data
    user = await User.findById(req.user.id)
      .populate('enrolledCourses.course',
        'title slug category tags duration level description previewUrl channel lessonsCount');
    const enrolledCourses = user.enrolledCourses
      .filter(e => e.course != null)
      .map(e => ({
      ...(e.course ? e.course.toObject() : {}),
      progress: e.progress || 0
    }));
    res.json({ message: already ? 'Уже записаны' : 'Успешно записан', enrolledCourses });
  } catch (err) { next(err); }
});

// ── PATCH /api/courses/:slug/progress  (обновить прогресс) ───
router.patch('/:slug/progress', authenticate, async (req, res, next) => {
  try {
    const { progress } = req.body;
    if (typeof progress !== 'number') return res.status(422).json({ error: 'Прогресс должен быть числом' });

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ error: 'Курс не найден' });

    const user = await User.findById(req.user.id);
    const entry = user.enrolledCourses.find(e => e.course.equals(course._id));
    if (!entry) return res.status(403).json({ error: 'Вы не записаны на этот курс' });

    entry.progress = Math.min(100, Math.max(0, progress));
    await user.save();
    res.json({ progress: entry.progress });
  } catch (err) { next(err); }
});

module.exports = router;
