import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Course extends Model {}

Course.init(
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
                model: "cte_school",
                key: "id",
            },
        },
        program_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "cte_school_program",
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
        instructor_id: {
            type: DataTypes.INTEGER, //fill later
        },
        room: {
            type: DataTypes.STRING(50),
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "Course",
        tableName: "course",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
