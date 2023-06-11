import { Request, Response } from "express";

// sequelize connection....................
import Gig from "../models/Gig";

// access token for access account.........
import { getAccessToken } from "../controllers/jwt";

//importing crypto module to generate random binary data
import CryptoJS from "crypto-js";

// date formatting..........
import moment from "moment";

// environment variables........
import * as dotenv from "dotenv";
dotenv.config();

// .......  user  login   ....................

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("wwwwwwwww", email, password);

    if (email == undefined || password == undefined) {
      res.status(500).send({ error: "Authentication failed..!!" });
    }

    const checkUser = await Gig.findOne({
      where: {
        email,
      },
    });

    console.log("bbbbbbbbbbbbbb", checkUser);

    if (checkUser == null) {
      res.send("No records found!!");
    } else if (checkUser) {

      const dbPassword = (checkUser as any).password;

      console.log('db hashed password', dbPassword);
      console.log("password from body", password);

      const keysec = process.env.ENCRYPTION_KEY as string;

      const bytes = CryptoJS.AES.decrypt(dbPassword, keysec);

      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      console.log('rrrrrrr', originalText);

      if (originalText == password) {
        let accessToken = await getAccessToken({
          email: email,
          userId: (checkUser as any).id,
        });

      console.log('aaaaaaaaaa', accessToken);

      res.send({
        userId: (checkUser as any).id,
        message: "User logged in successfully",
        accessToken: accessToken,
      });
      } else {
        console.log("Password authentication failed.");

        res.status(500).send({ error: "Authentication failed!!" });
      }
    } else {
      console.log("Invalid credentials. User not found!!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

// .......  user  sign up   ....................
const createPerson = async (req: Request, res: Response) => {
  try {
    type createPersonInput = {
      username: string;
      classNumber: string;
      email: string;
      password: string;
      phone: string;
      dob: Date;
      photo: string;
      isDeleted: boolean;
    };
    const {
      username,
      classNumber,
      email,
      password,
      phone,
      dob,
      photo,
      isDeleted,
    }: createPersonInput = req.body;

    console.log("rr", req.body);

    const userExists = await Gig.findOne({
      where: {
        email,
      },
    });
    // console.log('........', userExists);

    if (userExists) {
      res.status(400).json({ message: "user already exists" });
    } else {
      // password encryption...........................
      let keysec = process.env.ENCRYPTION_KEY as string;

      var ciphertext = CryptoJS.AES.encrypt(password, keysec).toString();

      console.log("encrypted text ....... cipherrrrrr", ciphertext);

      // date format changing from string to date.......
      const newDate = moment.utc(dob, "DD/MM/YYYY").toDate();
      // moment().format();
      // console.log('newwwwwwwwww', newDate);
      // console.log('newwwwwwwddddddddddddddw', typeof(newDate));

      const newUser = await Gig.create({
        username,
        classNumber,
        email,
        password: ciphertext,
        phone,
        dob: newDate,
        photo,
        isDeleted,
      });

      // console.log('jjjjjjj', newUser);

      // console.log("NewUser registered");

      const createdUser = {
        data: {
          username,
          classNumber,
          email,
          phone,
          dob: newDate,
          photo,
          isDeleted,
        },
      };

      res.json({ message: "User created successfully", createdUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

// ....... all users fetching................................................................
const allUsers = async (req: Request, res: Response) => {
  // let skip = 0;
  // let limit = 10;

  try {
    const obj = (req as any).sessionObj;
    console.log("session data", obj);

    const users = await Gig.findAll();

    console.log("usersssssssss", users);

    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

// ....... edit user....................
const updateUser = async (req: Request, res: Response) => {
  try {
    const obj = (req as any).sessionObj;
    console.log("session data", obj);

    const { id, username, classNumber, email, password, phone, dob, photo } =
      req.body;

    // console.log("qqqqqqqqq", req.body);

    const newId = parseInt(id);
    // console.log("uuuuuuuuu", typeof newId);

    const gig = {
      username,
      classNumber,
      email,
      password,
      phone,
      dob,
      photo,
    };

    function updateGig(gig: any, id: number) {
      const updateGig = {
        username: gig.username,
        classNumber: gig.classNumber,
        email: gig.email,
        password: gig.password,
        phone: gig.phone,
        dob: gig.dob,
        photo: gig.photo,
      };
      return Gig.update(updateGig, { where: { id: newId } });
    }
    updateGig(gig, newId);

    res.json({
      message: "Updated successfully...",
    });

    //,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
  } catch (error) {
    console.log(error);
    res.status(500).send("Updation failed!!");
  }
};

// ....... permanant delete user...................
// const deletePerson = async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;

//     const newId = parseInt(id);
//     // console.log("deeeelllllllll", newId);
//     // console.log("vvvvvvvv", typeof newId);

//     const deleteUser = await Gig.destroy({
//       where: {
//         id: newId,
//       },
//     });

//     res.json({
//       message: "Deleted successfully...",
//     });
//   } catch (error) {
//     res.status(500).json({message: "User not exists", error});
//   }
// };

// ....... soft delete user...................
const deletePerson = async (req: Request, res: Response) => {
  try {
    const obj = (req as any).sessionObj;
    console.log("session data", obj);

    const id = req.params.id;

    const newId = parseInt(id);
    // console.log("deeeelllllllll", newId);
    // console.log("vvvvvvvv", typeof newId);

    function updateGig(id: number) {
      const updateGig = {
        // id: gig.id,
        isDeleted: true,
      };
      return Gig.update(updateGig, { where: { id } });
    }
    updateGig(newId);

    res.json({
      message: `Deleted ${newId} successfully...`,
    });
  } catch (error) {
    res.status(500).json({ message: "User not exists", error });
  }
};



export {
  allUsers,
  createPerson,
  updateUser,
  deletePerson,
  loginUser,
};
