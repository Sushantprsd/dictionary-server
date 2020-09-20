const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wordSchema = new Schema(
    {
        key: {
            type: String,
            required: true,
        },
        lexicalEntries: {
            type: [Object],
            validate: (v) => Array.isArray(v) && v.length > 0,
            index: true,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Word", wordSchema);
