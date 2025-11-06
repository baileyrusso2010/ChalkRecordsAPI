import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export class SkillCategory extends Model {
    public id!: number
    public name!: string // Unique name for the flag
}

SkillCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "SkillCategory",
        tableName: "skill_category",
        timestamps: false,
        underscored: true,
    }
)
