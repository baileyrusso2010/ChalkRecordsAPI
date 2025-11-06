import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export class Skill extends Model {
    public id!: number
    public name!: string // Unique name for the flag
}

Skill.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "skill_category",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "Skill",
        tableName: "skill",
        timestamps: false,
        underscored: true,
    }
)
