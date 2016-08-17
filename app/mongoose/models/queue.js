const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QueueSchema = new Schema({
    'queued_at': {
        type: Date,
        default: Date.now
    },
    'sent_at': Date,
    'seq': Number,
    'ddd': Number,
    'mobile': Number,
    'retry': {
        type: Number,
        default: 0
    },
    'carrier': String,
    'status': {
        type: String,
        default: 'New'
    },
    'result': Schema.Types.Mixed
});

module.exports = mongoose.model('Queue', QueueSchema);
