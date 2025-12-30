import { Model, DataTypes, Optional } from "sequelize"
import sequelize from "../../database"

export class Course_Instructors extends Model {}

Course_Instructors.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        course_instance_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "course_instance",
                key: "id",
            },
        },
        staff_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "staff",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "Course_Instructors",
        tableName: "course_instructors",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
        indexes: [
            {
                unique: true,
                fields: ["course_instance_id", "staff_id"],
            },
        ],
    }
)
