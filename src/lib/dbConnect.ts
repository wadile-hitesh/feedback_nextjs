import mongoose from "mongoose";

type ConnnectionObject = {
    isConected?: number;
}

const connection : ConnnectionObject = {}

export default async function dbConnect(): Promise<void> {  // void means this function will not return anything
    if(connection.isConected){
        console.log("Already Connected to Database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {}) // options can be passed as second argument
        connection.isConected = db.connections[0].readyState
        console.log(db);
        console.log(db.connections);
        
        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("Database Connection Failed",error);
        process.exit(1);
    }
}