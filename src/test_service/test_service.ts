import {ITest, TestModel} from "../model/test_model";
import {Request, Response} from 'express';


export class TestService extends TestModel {
    static async ioAddTest(req: Request, res: Response) {
        let test: ITest = req.body.test;
        if (!test.variantArray || test.variantArray?.length <= 0) {
            return res.json("variant Array is empty ")
        }
        await TestModel.addOrUpdateTestModel(test, test);
        return res.json("Added New Test.")
    }
}