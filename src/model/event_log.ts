import * as mongoose from "mongoose"

let Schema = mongoose.Schema;

let dataSchema = new Schema({
    logId: String,
    userId: String,
    testId: String,
    variantId: String,
    variantName: String,
    assignedAt: Date,
    eventTimeStamp: {
        type: Date,
        default: Date.now,
    }
}, { collection: "event_log", timestamps: true });

const BaseMongooseModel = mongoose.model('EventLog', dataSchema);

export class EventLogModel extends BaseMongooseModel {
    
    static async addLogInDB(eventLog: IEventLog) {
        return BaseMongooseModel.create({ eventLog });
    }

    static async getAllLogs() {
        return BaseMongooseModel.find().lean();
    }
}

export interface IEventLog {
    logId: string,
    userId: string,
    testId: string,
    variantId: string,
    variantName: string,
    assignedAt: Date,
    eventTimeStamp: Date
}
