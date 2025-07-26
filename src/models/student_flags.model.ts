import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class StudentFlags extends Model {}

//will need id b/c I will add other fields later
StudentFlags.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    flag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "flags",
        key: "id",
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Assuming flags are active by default
    },
  },
  {
    sequelize,
    modelName: "StudentFlags",
    tableName: "student_flags",
    timestamps: false, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
