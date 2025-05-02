import { Schema, ObjectId } from "mongoose";
import { DateTime } from "luxon";


export const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Answer'
    },
    categoryId: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Category'
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

export interface Question extends Document {
    _id: ObjectId;
    question: string;
    answerId: ObjectId,
    categoryId: ObjectId;
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    isDeleted: boolean
}