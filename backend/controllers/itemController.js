import { Document } from 'mongoose'
import { Item } from '../itemModel.js'

/** @type {import("express").RequestHandler} */
export const getItems = async (req, res) => {
    try {
        const query = req.params.leaderboardType
        const items = await Item.find({ leaderboardType: query }).sort({
            score: -1,
            wpm: -1,
        })
        console.log(items)
        res.status(200).json(items)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error.' })
    }
}
/** @type {import("express").RequestHandler} */
export const editItems = async (req, res) => {
    try {
        const leaderboardType = req.params.leaderboardType
        const { name, score, wpm , time } = req.body
        console.log(req.body)
        // Validate incoming data
        if (!name || typeof score !== 'number' || typeof wpm !== 'number') {
            return res.status(400).json({ error: 'Bad Request: Invalid data format.' })
        }
        // Update or create a new item by using findOneAndUpdate(<parameters extracted>, <value>, <option>)
        const updated = await Item.findOneAndUpdate(
            { name: { $eq: name }, leaderboardType: { $eq: leaderboardType } , time:{$eq: time} },
            { $max: { score }, wpm },
            { new: true },
        )
        if (updated) {
            res.status(200).json({ message: 'OK', item: updated })
        } else {
            const newItem = new Item({ name, score, wpm, leaderboardType, time })
            await newItem.save()
            res.status(201).json({ message: 'Created', item: newItem })
        }
    } catch (err) {
        console.error(err) // Log the error
        if (err.name === 'CastError') {
            res.status(400).json({ error: 'Bad Request: Cast Error.' })
        } else {
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}
