import * as mongoose from "mongoose"

export enum ITestStatus {
    completed = "COMPLETED",
    active = "ACTIVE",
    inactive = "INACTIVE",
    pending = "PENDING"
}

let Schema = mongoose.Schema;

let dataSchema = new Schema({
    testId: String,   // should be represented in enum afterwards..
    name: String,
    screenId: String,
    description: String,
    rollOutPercentage: {
        type: Number,
        default: 1.0
    },
    startDate: Date,
    endDate: Date,
    testStatus: {
        type: String,
        enum: Object.values(ITestStatus),
        default: ITestStatus.pending,
    },
    variantArray: [{
        variantId: String,
        variantName: String,
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {collection: "test", _id: true, versionKey: false, timestamps: true})


const BaseMongooseModel = mongoose.model('Test', dataSchema);

export class TestModel extends BaseMongooseModel {
    static async addOrUpdateTestModel(test: ITest, updateObject: ITest) {
        return BaseMongooseModel.findOneAndUpdate({testId: test.testId}, updateObject, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).lean();
    }

    static async getAllTest(): Promise<ITest[]> {
        return BaseMongooseModel.find().lean();
    }

    static async getAllTestForScreen(screenId: string): Promise<ITest[]> {
        return BaseMongooseModel.find({screenId: screenId}).lean();
    }

    static async getTestFor(testId: string): Promise<ITest|null> {
        return BaseMongooseModel.findOne({testId: testId}).lean();
    }


}

export interface ITest {
    testId: string,
    name: string,
    screenId: string,
    description: string,
    rollOutPercentage: number,
    startDate: Date,
    endDate?: Date,
    testStatus?: ITestStatus,
    variantArray: ITestVariant[],
    updatedAt: Date
}

export interface ITestVariant {
    variantId: string,
    variantName: string
}



