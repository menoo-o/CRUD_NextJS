import { NextResponse } from "next/server";
import connect from '@/lib/db'
import User from "@/lib/models/user";
import { log } from "console";
import { Types } from "mongoose";
import Category from "@/lib/models/category";
const ObjectId = Types.ObjectId;


//get category
export const GET = async (request: Request)=>{
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"userid not found"}), {status: 400})
        }

        await connect();
        const user  = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found in db"}), {status: 400})
        };

        const categories = await Category.find({
            user: new Types.ObjectId(userId)
        })

        return new NextResponse(JSON.stringify(categories), {status: 200});
        

    } catch(err:any){
        return new NextResponse("Error in fetching categories" + err.message, {status:500})
    };
};


export const POST = async (request: Request)=>{
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        const { title } = await request.json();
        
        //chech if the user id is valid
        if(!userId || !Types.ObjectId.isValid(userId)){
            return new NextResponse(JSON.stringify({message:"userid not found"}), {status: 400})
        }

        //db connecting...
        await connect();
        const user  = await User.findById(userId);
        if(!user){
            return new NextResponse(JSON.stringify({message:"User not found in db"}), {status: 400})
        };

        const newCategory = new Category({
            title, 
            user: new Types.ObjectId(userId),
        });

        await newCategory.save();

        return new NextResponse(
            JSON.stringify({message:"Category is created", category: newCategory}), {status: 200}
        )

    } catch(err:any){
        return new NextResponse("Error in creating categories" + err.message, {status:500})
    };
}

