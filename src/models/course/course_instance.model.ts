import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Course_Instance extends Model {}

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
        program_catalog_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "program_catalog",
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
        instructorId: {
            type: DataTypes.INTEGER, //fill later
            allowNull: true,
        },
        school_year_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "school_year",
                key: "id",
            },
        },
        term_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "term",
                key: "id",
            },
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
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
