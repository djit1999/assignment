import { Schema, ObjectId } from "mongoose";
import { DateTime } from "luxon";


export const UserSubmittedAnswerSchema = new Schema({
    answerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Answer'
    },
    questionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    submittedAt: {
        type: Date,
        required: true,
        default: DateTime.utc().toJSDate()
    }
})

export interface UserSubmittedAnswer extends Document {
    _id: ObjectId;
    answerId: ObjectId,
    questionId: ObjectId,
    userId: ObjectId,
    submittedAt: Date
}