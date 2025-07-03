import { IUser, UserModel } from "../model/user_model";
import { MyUtil } from "../my_util";
import { UserVariantService } from "../user_variant_service/user_variant_service";

export class UserService extends UserModel {


    static async ioCreateUser(req, res) {
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
            await this.assignAndFetchUser(user);
            return res.json("User created");
        }
        catch (e) {
            return res.json(`Error in User Creation : ${e}`);
        }
    }

    static async assignAndFetchUser(user: IUser) {
        await this.addOrUpdateUser(user, user);
    }
}