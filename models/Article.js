const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    excerpt: {
        type: String,
    },
    content: {
        type: String,
    },
    source: {
        type: String,
        default: "BeyondChats",
    },
    updatedContent: {
        type: String
    },
    references: [
        {
            type: String,
        },
    ],
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Article", articleSchema);