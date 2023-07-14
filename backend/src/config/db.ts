import mongoose from 'mongoose';
import config from './configEnv';

export const generateURI = () => {
  const { uri } = config.db;

  return uri;
}


async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect(generateURI());
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

export default connectToDB;
