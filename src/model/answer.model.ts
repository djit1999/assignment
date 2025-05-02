import { Schema, ObjectId } from "mongoose";
import { DateTime } from "luxon";


export const AnswerSchema = new Schema({
    answer: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: DateTime.utc().toJSDate()
    },
    updatedAt: {
        type: Date,
        required: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    }
})

export interface Answer extends Document {
    _id: ObjectId;
    answer: string,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    isDeleted: boolean
}