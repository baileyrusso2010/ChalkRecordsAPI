import { Model, DataTypes, Optional } from "sequelize"
import sequelize from "../../database"

export class Course_Instance extends Model {
    public id!: number
    public school_id?: number | null
    public district_program_id?: number | null
    public course_catalog_id?: number | null
    public instructorId?: number | null
    public school_year_id?: number | null
    public start_date?: Date | null
    public end_date?: Date | null
    public alias?: string | null
}

Course_Instance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        school_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "school",
                key: "id",
            },
        },
        district_program_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "district_program",
                key: "id",
            },
            allowNull: true,
        },
        course_catalog_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "course_catalog",
                key: "id",
            },
        }, //this is needed
        alias: {
            type: DataTypes.STRING,
        },
        school_year_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "school_year",
                key: "id",
            },
            allowNull: true, //fix later
        },
        term_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "term",
                key: "id",
            },
            allowNull: true, //fix later
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
)
