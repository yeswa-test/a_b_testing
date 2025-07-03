import {IUser, UserModel} from "../model/user_model";
import {MyUtil} from "../my_util";
import {Request, Response} from 'express';


export class UserService extends UserModel {

    static async ioCreateUser(req: Request, res: Response) {
        try {
            let name = req.body.name;
            let email = req.body.email;
            if (!name) return res.json("Name is missing");
            if (!email) return res.json("email is missing");
            let user: IUser = {
                name: name,
                email: email,
                userId: MyUtil.getMongooseId()
            }
            await UserService.assignAndFetchUser(user);
            return res.json("User created");
        } catch (e) {
            return res.json(`Error in User Creation : ${e}`);
        }
    }

    static async assignAndFetchUser(user: IUser) {
        await UserModel.addOrUpdateUser(user, user);
    }
}