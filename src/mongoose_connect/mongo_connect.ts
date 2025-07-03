import * as mongoose from "mongoose";


export class MongoImportation {

  static async connectDB() {
    try {
      const mongoUri = 'mongodb://mongodb:27017/a_b_testing';
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB with Mongoose!');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

}


