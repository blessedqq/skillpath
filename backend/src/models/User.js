'use strict';
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false          // никогда не отдаём наружу
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  enrolledCourses: [{
    course:     { type: Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress:   { type: Number, default: 0, min: 0, max: 100 }
  }],
  avatar: { type: String, default: '' }
}, { timestamps: true });

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 12);
};

// Не выводить __v и passwordHash в JSON
userSchema.set('toJSON', {
  transform: (_, obj) => {
    delete obj.__v;
    delete obj.passwordHash;
    return obj;
  }
});

module.exports = model('User', userSchema);
