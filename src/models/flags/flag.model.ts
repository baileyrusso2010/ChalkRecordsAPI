import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Flag extends Model {
  public id!: number;
  public name!: string; // Unique name for the flag
}

Flag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Flag",
    tableName: "flags",
    timestamps: false,
    underscored: true,
  }
);
