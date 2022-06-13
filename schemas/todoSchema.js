const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title Field Required'],
    },
    description: String,
    status: {
        type: Boolean,
        required: [true, 'Title Field Required'],
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
    },
});

todoSchema.methods = {
    findActive: () => mongoose.model('todo').find({ status: true }),
};

todoSchema.statics = {
    findActive() {
        return this.find({ status: true });
    },
};

todoSchema.query = {
    byQuery(query) {
        return this.find({ status: query });
    },
};

module.exports = todoSchema;
