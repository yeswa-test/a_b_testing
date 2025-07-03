import { ITest, TestModel } from "../model/test_model";

export class TestService extends TestModel{
    static async ioAddTest(req,res){
        let test : ITest =  req.body.test;
        if(!test.variantArray || test.variantArray?.length <= 0){
            return res.json("variant Array is empty ")
        }
        await this.addOrUpdateTestModel(test,test);
        return res.json("Added New Test.")
    }
}