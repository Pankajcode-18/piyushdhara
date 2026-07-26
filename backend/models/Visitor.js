const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    date: {
        type: String, // 'YYYY-MM-DD'
        required: true,
        unique: true,
    },
    todayVisits: {
        type: Number,
        default: 0,
    },
    totalVisits: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
