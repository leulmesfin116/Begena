import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
const recent = async(req, res) => {
  try{
     const userId=req.user.id;
  const {songid}=req.body
const songExist= await prsima.
  }
  catch(error){

  }

};
export { recent };
