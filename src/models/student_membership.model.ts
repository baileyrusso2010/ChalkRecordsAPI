import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class StudentMemberships extends Model {}

//will need id b/c I will add other fields later
StudentMemberships.init(
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
        membership_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "memberships", // Name of the referenced table
                key: "id", // Key in the referenced model
            },
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // Assuming memberships are active by default
        },
    },
    {
        sequelize,
        modelName: "StudentMemberships",
        tableName: "student_memberships",
        timestamps: true, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
