import { Schema, ObjectId } from "mongoose";
import { DateTime } from "luxon";

export const OptionSchema = new Schema({
    questionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    name: {
        type: String,
        required: true,
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

export interface Option extends Document {
    _id: ObjectId;
    questionId: ObjectId,
    name: string;
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    isDeleted: boolean
}