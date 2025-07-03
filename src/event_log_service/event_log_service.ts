import { EventLogModel, IEventLog } from "../model/event_log";
import { ITest, ITestVariant, TestModel } from "../model/test_model";
import { IUser, UserModel } from "../model/user_model";
import { IUserVariant, UserVariantModel } from "../model/user_variant_model";
import { MyUtil } from "../my_util";
import { UserVariantService } from "../user_variant_service/user_variant_service";
import express from "express";

export class EventLogService extends EventLogModel{

    static async ioLogEvent(req:express.,res:any){
        let userId : string  = req.body.userId;
        let variantId:string = req.body.variantId;
        let testId:string = req.body.testId;
        if (!testId) {
            return res.json(`There was no testID `);
        }
        if (!userId) {
            return res.json(`There was no userId`);
        }
        if(!variantId){
            return res.json(`There was no Variant ID `);
        }
        await this.createAndAddLog(userId,variantId,testId);
        return res.json("Added successfully.")
    }

    static async createEventLog(userVariant:IUserVariant,test:ITest){
        let testVariant:ITestVariant = await TestModel.getTestVariant(test.testId,userVariant.variantId);
        let eventLog:IEventLog={
            logId : MyUtil.getMongooseId(),
            userId:userVariant.userId,
            testId:test.testId,
            assignedAt:userVariant.assignedAt,
            eventTimeStamp: new Date(),
            variantId:userVariant.variantId,
            variantName:testVariant.variantName,
        }
        return eventLog;
    }

    static async createAndAddLog(userId:string,variantId:string,testId:string){
        let test: ITest = await TestModel.getTestFor(testId);
        if (!test) {
            console.log(`There was no test Available : ${testId}`);
            return null;
        }
        
        let user: IUser = await UserModel.getUser(userId);
        if (!user) {
            console.log(`There was no user Available : ${userId}`);
            return null;
        }
        let userVariant : IUserVariant =  await UserVariantService.checkAndGetTheUserVariant(user,test,variantId);
        let eventLog =  await this.createEventLog(userVariant,test)
        this.addLogInDB(eventLog)
    }
}