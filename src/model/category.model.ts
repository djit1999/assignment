import { Schema, ObjectId } from "mongoose";
import { DateTime } from "luxon";

export const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
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

export interface Category extends Document {
    _id: ObjectId;
    name: string;
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    isDeleted: boolean
}