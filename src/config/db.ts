import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize("crudwithsequelize", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
