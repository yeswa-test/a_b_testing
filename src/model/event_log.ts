import * as mongoose from "mongoose"

let Schema = mongoose.Schema;

let dataSchema = new Schema({
    logId: String,
    userId: String,
    testId: String,
    variantId: String,
    assignedAt: Date,
    eventTimeStamp: {
        type: Date,
        default: Date.now,
    }
}, {collection: "event_log", timestamps: true});

const BaseMongooseModel = mongoose.model('EventLog', dataSchema);

export class EventLogModel extends BaseMongooseModel {

    static async addLogInDB(eventLog: IEventLog) {
        console.log(`inside add event log :`, eventLog)
        return BaseMongooseModel.create(eventLog);
    }

    static async getAllLogs(): Promise<IEventLog[]> {
        return BaseMongooseModel.find().lean();
    }
}

export interface IEventLog {
    logId: string,
    userId: string,
    testId: string,
    variantId: string,
    assignedAt: Date,
    eventTimeStamp: Date
}
