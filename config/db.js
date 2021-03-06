const mongoose = require('mongoose');
//const config = require('config');
const mongoURI = process.env.mongoURI; 

const connectDB = async () => {
	try {
			await mongoose.connect(mongoURI, {
			useNewUrlParser: true, 
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		console.log('MongoDB connected');
	} catch (error) {
		console.error(error); 
		process.exit(1); 
	}
};


module.exports = connectDB; 