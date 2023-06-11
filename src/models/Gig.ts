import { DataType } from "sequelize-typescript";

import db from "../config/db";

const Gig = db.define(
  'gig',
  {
    username: {
      type: DataType.STRING,
    },
    classNumber: {
      type: DataType.STRING,
    },
    dob: {
      type: DataType.DATE,
    },
    email: {
      type: DataType.STRING,
      unique: true
    },
    isDeleted: {
      type: DataType.BOOLEAN,
    },
    password: {
      type: DataType.STRING,
    },
    phone: {
      type: DataType.STRING,
    },
  },
  { timestamps: false }
);

(async () => {
    await db.sync({ force: true });
    
  })();

export default Gig;
