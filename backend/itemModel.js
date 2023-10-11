import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
    {
        ranking: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        wpm: {
            type: Number,
            required: true,
        },
        leaderboardType: {
            type: String,
            required: true,
        },
        time: {
            type: int,
            required: true,
        },
    },
    { versionKey: false },
)

const Item = mongoose.model('Item', itemSchema)

export { Item }
