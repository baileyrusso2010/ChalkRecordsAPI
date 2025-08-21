import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class WBLHours extends Model {}

WBLHours.init(
    {
        id: {
            //keep id for now
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "student",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        wblTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "wbl_types",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        hours: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: "Duration stored in total minutes",
            validate: { min: 0 },
        },
    },
    {
        sequelize,
        modelName: "WBLHours",
        tableName: "wbl_hours",
        timestamps: true, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
