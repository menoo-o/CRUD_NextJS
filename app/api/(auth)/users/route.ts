import { NextResponse } from "next/server";
import connect from '@/lib/db'
import User from "@/lib/models/user";
import { log } from "console";

export const GET = async () =>{
    try{
        await connect();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), {status: 200});
    } catch(err: any){
        return new NextResponse('this is the err: '+ err.message, {status:500,})
    }
};

export const POST = async (request: Request) =>{
    try{
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({message:"user is created", user:newUser}), {status: 200} );


    } catch(err){
        return new NextResponse("error in creating user" + err.message, {status: 500,})
    }
}