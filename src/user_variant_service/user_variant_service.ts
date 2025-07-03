import {ITest, ITestVariant, TestModel} from "../model/test_model";
import {IUser} from "../model/user_model";
import {ITestVariantCount, IUserVariant, UserVariantModel} from "../model/user_variant_model";

export class UserVariantService extends UserVariantModel {

    static async getUserCountForUserVariant(testUnit: ITest) {
        let userVariantArray: IUserVariant[] = await this.getUserVariantArrayByTestId(testUnit.testId);
        let testVatriantArray: ITestVariant[] = testUnit.variantArray;
        let testVariantCountArray: ITestVariantCount[] = [];
        let testVariantCount: ITestVariantCount;
        for (const variant of testVatriantArray) {
            testVariantCount = {
                variantId: variant.variantId,
                testId: testUnit.testId,
                userCount: this.getVariantCount(userVariantArray, variant.variantId),
            }
            testVariantCountArray.push(testVariantCount);
        }
        return testVariantCountArray;
    }

    static getVariantCount(userVariantArray: IUserVariant[], targetVariantId: string) {
        let count = 0;
        for (let i = 0; i < userVariantArray.length; i++) {
            if (userVariantArray[i].variantId === targetVariantId) {
                count++;
            }
        }
        return count;
    }

    static async getMininumTestVariant(testUnit: ITest) {

        try {
            let minVariant: ITestVariant = testUnit.variantArray[0];
            let testVariantArray: ITestVariant[] = testUnit.variantArray;
            let testVariantCountArray: ITestVariantCount[] = await UserVariantService.getUserCountForUserVariant(testUnit);

            if (testVariantCountArray.length === 0) {
                return null;
            }

            let minCount = testVariantCountArray[0].userCount;
            let minVariantId = testVariantCountArray[0].variantId;

            // Find the variant with minimum count (or first one if all are same)
            for (const testVariantCount of testVariantCountArray) {
                if (testVariantCount.userCount < minCount) {
                    minCount = testVariantCount.userCount;
                    minVariantId = testVariantCount.variantId;
                }
            }

            for (const testVariant of testVariantArray) {
                if (minVariantId == testVariant.variantId) {
                    minVariant = testVariant;
                }
            }

            return minVariant;
        } catch (e) {
            console.log(`Error in getMininumTestVariant : ${e}`)
        }
    }

    static async getNewVariantToUser(testUnit: ITest, user: IUser) {
        const testVariant = await UserVariantService.getMininumTestVariant(testUnit)
        if (!testVariant) {
            console.log(`Test variant is not available.`);
            return null;
        }
        let newUserVariant: IUserVariant = {
            userId: user.userId,
            testId: testUnit.testId,
            variantId: testVariant.variantId
        }
        await this.addOrUpdateUserVariant(newUserVariant, newUserVariant);
    }


    static async checkAndAssignUser(user: IUser) {
        let testUnitArray: ITest[] = await TestModel.getAllTest();
        let userVariantArray: IUserVariant[] = await this.getUserVariantFor(user.userId);
        for (const testUnit of testUnitArray) {
            for (const userVariant of userVariantArray) {
                if (userVariant.testId == testUnit.testId) {

                } else {
                    UserVariantService.getNewVariantToUser(testUnit, user);
                }
            }
        }
    }

    static async createUserVariant(test: ITest, variantId: string, user: IUser): Promise<IUserVariant> {
        let newUserVariant: IUserVariant = {
            userId: user.userId,
            testId: test.testId,
            variantId: variantId,
            assignedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.addOrUpdateUserVariant(newUserVariant, newUserVariant);
        return newUserVariant;
    }

    static async checkAndGetTheUserVariant(user: IUser, test: ITest, variantId: string): Promise<IUserVariant> {
        let alreadyUserVariant = await UserVariantModel.getUserVariantUsingVariantId(user.userId, test.testId, variantId);
        if (alreadyUserVariant) return alreadyUserVariant;
        let userVariant = await UserVariantService.createUserVariant(test, variantId, user);
        return userVariant;
    }
}