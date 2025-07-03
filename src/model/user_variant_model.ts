import * as mongoose from "mongoose"

let Schema = mongoose.Schema;

let dataSchema = new Schema({
    testId:String,
    userId:String,
    variantId:String,
    assignedAt:{
        type:Date,
        default:Date.now
    }
}, { collection: "user_variant", _id: true, versionKey: false ,timestamps: true })

const BaseMongooseModel = mongoose.model('UserVariant', dataSchema);

export class UserVariantModel extends BaseMongooseModel{
    static async addOrUpdateUserVariant(userVariant:IUserVariant,updateObject:IUserVariant){
            return BaseMongooseModel.findOneAndUpdate({userId:userVariant.userId,testId:userVariant.testId,variantId:userVariant.variantId},updateObject,{
                    upsert:true,
                    new:true,
                    setDefaultsOnInsert: true
            }).lean();
    }

    static async getAllUserVariant(){
        return BaseMongooseModel.find().lean();
    }

    static async getUserVariantFor(userId:string):Promise<IUserVariant[]>{
        return BaseMongooseModel.find({userId:userId}).lean();
    }

    static async getUserVariantArrayByTestId(testId:string):Promise<IUserVariant[]>{
        return BaseMongooseModel.find({testId:testId}).lean();
    }

    static async getUserVariant(userId:string,testId:string){
        return BaseMongooseModel.findOne({userId:userId,testId:testId}).lean();
    }

    static async getUserVariantUsingVariantId(userId:string,testId:string,variantId:string):Promise<IUserVariant|null>{
        return BaseMongooseModel.findOne({userId:userId,testId:testId,variantId:variantId}).lean();
    }
}

export interface IUserVariant{
    testId:string,
    userId:string
    variantId:string,
    createdAt?: Date;
    updatedAt?: Date;
    assignedAt?: Date;
}

export interface ITestVariantCount{
    testId:string,
    variantId:string,
    userCount:number
}

