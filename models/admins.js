const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    adminId: { type: String, required: true, unique: true },
    role: { type: String, default: 'admin' }, // Set role as 'admin'
    createdAt: { type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Admin', adminSchema, 'admins');
