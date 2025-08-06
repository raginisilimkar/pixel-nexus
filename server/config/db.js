// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
    // await mongoose.connect(process.env.MONGO_URI)
//         await mongoose.connect("mongodb://localhost:27017/pixelforge")

//     console.log('✅ MongoDB connected');
//   } catch (error) {
//     console.error('❌ DB connection failed:', error.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
