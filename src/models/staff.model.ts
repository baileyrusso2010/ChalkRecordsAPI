import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Staff extends Model {}

export default Staff.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true, // Optional field
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true, // Optional field
    },
    cte_schoolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cte_schools", // Name of the referenced table
        key: "id", // Key in the referenced model
      },
    },
  },
  {
    sequelize,
    modelName: "Staff",
    tableName: "staff",
    timestamps: true, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
