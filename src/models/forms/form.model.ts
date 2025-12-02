import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Form extends Model {
  public id!: number;
}

Form.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      //proabbly reference to template form
      type: DataTypes.STRING,
      allowNull: false,
    },
    // course_id: {
    //   type: DataTypes.STRING,
    //   allowNull: true, //for now
    // },
    grading_period: {
      type: DataTypes.TEXT, //quarter semester year and make enum later
      allowNull: true,
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
