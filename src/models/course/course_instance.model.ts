import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../database";

export interface CourseInstanceAttributes {
  id: number;
  cte_school_id?: number | null;
  district_program_id?: number | null;
  course_catalog_id?: number | null;
  instructorId?: number | null;
  alias?: string | null;
  start_date?: Date | null;
  end_date?: Date | null;
}

export type CourseInstanceCreationAttributes = Optional<
  CourseInstanceAttributes,
  | "id"
  | "cte_school_id"
  | "district_program_id"
  | "course_catalog_id"
  | "alias"
  | "instructorId"
  | "start_date"
  | "end_date"
>;

export class Course_Instance
  extends Model<CourseInstanceAttributes, CourseInstanceCreationAttributes>
  implements CourseInstanceAttributes
{
  public id!: number;
  public cte_school_id?: number | null;
  public program_catalog_id?: number | null;
  public course_catalog_id?: number | null;
  public instructorId?: number | null;
  public start_date?: Date | null;
  public end_date?: Date | null;
  public alias?: string | null;
}

Course_Instance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    cte_school_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "cte_school",
        key: "id",
      },
    },
    district_program_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "cte_district_program",
        key: "id",
      },
    },
    course_catalog_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "course_catalog",
        key: "id",
      },
    },
    alias: {
      type: DataTypes.STRING,
    },
    instructorId: {
      type: DataTypes.INTEGER, //fill later
      allowNull: true,
    },
    // school_year_id: {
    //     type: DataTypes.INTEGER,
    //     references: {
    //         model: "school_year",
    //         key: "id",
    //     },
    // },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    //credits maybe.. wait on this
  },
  {
    sequelize,
    modelName: "Course_Instance",
    tableName: "course_instance",
    timestamps: false,
    underscored: true, // if you prefer snake_case for column names
  }
);
