import * as mongoose from "mongoose";
import { MyUtil } from "../my_util";

let Schema = mongoose.Schema;

let dataSchema = new Schema({
    name: String,
    email: String,
    userId: {
        type: String,
        default: function () {
            MyUtil.getMongooseId();
        }
    }
}, { collection: "user", _id: true, versionKey: false, timestamps: true });

const BaseMongooseModel = mongoose.model('User', dataSchema);

export class UserModel extends BaseMongooseModel {

    static async addOrUpdateUser(user: IUser, updateObject: IUser) {
        return BaseMongooseModel.findOneAndUpdate({ userId: user.userId }, updateObject, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).lean();
    }

    static async getAllUser() {
        return BaseMongooseModel.find().lean();
    }

    static async getUser(userId:string):Promise<IUser|null>{
        return BaseMongooseModel.findOne({userId:userId}).lean();
    }
}

export interface IUser {
    name: string,
    email: string,
    userId: string
}

