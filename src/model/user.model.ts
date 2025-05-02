import { Schema, ObjectId } from "mongoose";
import { DateTime } from "luxon";

export const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    pPicture: {
        type: String,
        default: null
    },
    password:{
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

export interface User extends Document {
    _id: ObjectId;
    firstName: string;
    lastName: string,
    email: string;
    pPicture: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    isActive: boolean,
    isDeleted: boolean
}