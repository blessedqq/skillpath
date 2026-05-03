'use strict';
const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['dev', 'design', 'data', 'soft', 'marketing', 'management'],
    required: true
  },
  tags: [String],
  description: { type: String, trim: true },
  lessonsCount: { type: Number, default: 0 },
  projectsCount: { type: Number, default: 0 },

  // Видео — заполнить позже
  videoUrl:   { type: String, default: '' },   // основное видео (embed URL)
  previewUrl: { type: String, default: '' },   // превью / трейлер
  channel:    { type: String, default: '' },   // название канала на YouTube

  duration: { type: String, default: '' },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

courseSchema.set('toJSON', { transform: (_, obj) => { delete obj.__v; return obj; } });

module.exports = model('Course', courseSchema);
