import { log } from 'console';
import mongoose from 'mongoose';
import moongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

export default async function connect(){
    const connectionState = moongoose.connection.readyState;

    if(connectionState ===1){
        console.log("aLREADY Connected");
        return ;
    } 

    if(connectionState ===2){
        console.log("Connecting...");
        return ;
    } 

    try{
        mongoose.connect(MONGODB_URI!, {
            dbName: "crud",
            bufferCommands:true
        });
        console.log("cONNECTED")
    } catch (err:any){
        console.log("error: ", err);
        throw new Error("Error: ", err );
        
    }

}