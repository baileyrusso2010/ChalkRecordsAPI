import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class AttendanceType extends Model {}

AttendanceType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        code: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "AttendanceType",
        tableName: "attendance_type",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
