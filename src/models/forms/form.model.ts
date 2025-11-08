import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Form extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
}

Form.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    //class id later
  },
  {
    sequelize,
    modelName: "Form",
    tableName: "form",
    timestamps: true,
    underscored: true,
  }
);
