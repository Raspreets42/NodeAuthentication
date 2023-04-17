const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect(`mongodb+srv://${process.env.DATABASE}:${process.env.DBPASSWORD}@cluster0.yzatase.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(`Connection successful`);
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connectDB;