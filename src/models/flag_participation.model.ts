import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class FlagParticipation extends Model {}

FlagParticipation.init(
    {
        id: {
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
        flagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "flag",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "FlagParticipation",
        tableName: "flag_participation",
        timestamps: true,
        underscored: true,
    }
)
