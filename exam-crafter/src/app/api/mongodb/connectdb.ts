import mongoose from 'mongoose';

let connection: typeof mongoose | null = null;
const connectMongoDB = async () => {
  try {
    if (!connection) {
      const DB_URI = process.env.MONGODB_URL || '';
      connection = await mongoose.connect(DB_URI);
    }
  } catch (err) {
    console.error(err);
  }
};

export const disconnectMongoDB = async () => {
  try {
    mongoose.connections.forEach(async ct => await ct.close());
  } catch (err) {
    console.error(err);
  }
};

export default connectMongoDB;
