import { NextResponse } from "next/server";
import connect from '@/lib/db'
import User from "@/lib/models/user";
import { log } from "console";
import { Types } from "mongoose";
const ObjectId = Types.ObjectId;


//display users
export const GET = async () =>{
    try{
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch(err: any){
        return new NextResponse('this is the err: '+ err.message, {status:500,})
    }
};

//create user
export const POST = async (request: Request) =>{
    try{
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({message:"user is created", user:newUser}), {status: 200} );


    } catch(err:any){
        return new NextResponse("error in creating user" + err.message, {status: 500,})
    }
};

//update Username
export const PATCH = async (request: Request)=>{
    try{    
        const body = await request.json();
        const {userId, newUsername} = body;
        await connect();

        if(!userId || !newUsername){
            return new NextResponse(
                JSON.stringify({message: "ID or new username not found"}), {status: 400}
            );
        }

        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(
                JSON.stringify({message: "Invalid userId"}), {status: 400}
            );
        }

        const updatedUser = await User.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {username: newUsername},
            {new: true}
        );

  
        if (!updatedUser){
            return new NextResponse(
                JSON.stringify({message:"user not found in db"}), {status: 401}
            );
        }

        return new NextResponse(
            JSON.stringify({message: "User is updated", user: updatedUser}), {status: 200}
        );



    } catch (err: any){
        return new NextResponse("error in updating user" + err.message, {status: 500})
    }
};



export const DELETE = async(request: Request)=>{
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId){
            return new NextResponse(JSON.stringify({message:"ID not found"}), {status:400}
        )};

        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"INVALID ID"}), {status:400}
        )}; 

        await connect();
        const deletedUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deletedUser){
            return new NextResponse(JSON.stringify({message:"user not found in DB"}), {status: 400})
        };

        return new NextResponse(
            JSON.stringify({message:"user deleted successfully"}), {status:200})

        } catch(err:any){
            return new NextResponse("error in deleting user because: " + err.message)
        }
};