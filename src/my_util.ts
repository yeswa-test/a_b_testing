const randToken = require('rand-token');

export class MyUtil{
    static getMongooseId() {
        return randToken.generate(6);
    }

}