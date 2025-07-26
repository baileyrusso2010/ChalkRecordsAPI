import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Addresses extends Model {}

Addresses.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Classes", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apt: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Addresses",
    tableName: "addresses",
    timestamps: false, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
