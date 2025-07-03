import {EventLogModel, IEventLog} from "../model/event_log";
import {ITest, ITestVariant, TestModel} from "../model/test_model";
import {UserModel} from "../model/user_model";
import {IUserVariant} from "../model/user_variant_model";
import {MyUtil} from "../my_util";
import {UserVariantService} from "../user_variant_service/user_variant_service";
import {Request, Response} from 'express';

export class EventLogService extends EventLogModel {

    static async ioLogEvent(req: Request, res: Response) {
        let userId: string = req.body.userId;
        let variantId: string = req.body.variantId;
        let testId: string = req.body.testId;
        if (!testId) {
            return res.json(`There was no testID `);
        }
        if (!userId) {
            return res.json(`There was no userId`);
        }
        if (!variantId) {
            return res.json(`There was no Variant ID `);
        }
        await EventLogService.createAndAddLog(userId, variantId, testId);
        return res.json("Added successfully.")
    }

    static async getTestVariant(testId: string, variantId: string): Promise<ITestVariant | undefined> {
        const testArray: ITest[] = await TestModel.getAllTest();
        console.log(`test array : `, testArray)
        const test = await TestModel.getTestFor(testId);
        if (!test) {
            console.log(`No test available`)
            return undefined;
        }
        console.log(`test : `, test);
        let variantArray = test.variantArray;
        for (let variant of variantArray) {
            if (variantId == variant.variantId) {
                console.log(`variant : `, variant)
                return variant;
            }
        }
    }

    static async createEventLog(userVariant: IUserVariant, test: ITest) {
        if (!test) throw new Error("Test not found")
        const testVariant = await EventLogService.getTestVariant(test.testId, userVariant.variantId);
        if (!testVariant) throw new Error("Test variant not found");
        let eventLog: IEventLog = {
            logId: MyUtil.getMongooseId(),
            userId: userVariant.userId,
            testId: test.testId,
            assignedAt: userVariant?.assignedAt ?? new Date(),
            eventTimeStamp: new Date(),
            variantId: userVariant.variantId,
        }
        console.log(`Event log : `, eventLog)
        return eventLog;
    }

    static async createAndAddLog(userId: string, variantId: string, testId: string) {
        let test = await TestModel.getTestFor(testId);
        if (!test) {
            console.log(`There was no test Available : ${testId}`);
            return null;
        }

        let user = await UserModel.getUser(userId);
        if (!user) {
            console.log(`There was no user Available : ${userId}`);
            return null;
        }
        let userVariant: IUserVariant = await UserVariantService.checkAndGetTheUserVariant(user, test, variantId);
        if (!userVariant) {
            console.log(`There was no user variant Available,`);
            return null;
        }
        let eventLog = await EventLogService.createEventLog(userVariant, test)
        console.log(`event_log :`, eventLog)
        await EventLogModel.addLogInDB(eventLog)
    }
}