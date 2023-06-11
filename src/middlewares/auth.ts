import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Gig from "../models/Gig";

// import { user } from "../controllers/users";

const jwtSecretString: string = process.env.JWT_ACCESS_SECRET!;

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = req.headers.authorization!;

  if (!token || !token.startsWith("Bearer")) { 
    res.send("Unauthorized Access");
  } else {
    token = token.slice(7, token.length);
    if (token) {
      try {
        jwt.verify(token, jwtSecretString, function (error: any) {
          if (error) {
            res.send("Access token invalid or expired!");
          } else {
            next();
          }
        });
      } catch (err) {
        res.send("Access token invalid or expired!");
      }
    } else {
      let result: Object = {
        code: 401,
        message: `Authentication error. Access Token required.`,
        result: [],
      };
      res.send(result);
    }
  }
};



export const getSessionInfo = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = req.headers.authorization!;

    const decodedToken = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    // req.sessionObj =  decodedToken

    console.log("deeeeeeeee", decodedToken);
    const email = decodedToken.email;

    const userDetails = await Gig.findOne({
        where: {
            email
        }
    })

    console.log('detailsssssss', userDetails);

    const data = {
        id: (userDetails as any).id,
        username: (userDetails as any).username,
        classNumber: (userDetails as any).classNumber,
        email: (userDetails as any).email,
        phone: (userDetails as any).phone,
        dob: (userDetails as any).dob,
        isDeleted: (userDetails as any).isDeleted,

    }

    console.log('filtered data from token', data);
    
    req.sessionObj = data;

    next();
  } catch (error) {
    console.log(error);
    res.send("Access token invalid or expired!");
  }
};
