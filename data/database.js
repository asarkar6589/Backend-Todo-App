import mongoose from "mongoose";

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        dbName: "Mern_Stack_Todo"
    }).then(() => {
        console.log("Database Connected");
    }).catch(e => {
        console.log(e);
    })
}

export default connectDatabase;
