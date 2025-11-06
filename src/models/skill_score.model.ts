import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export class SkillScore extends Model {
    public id!: number
    public skill_id!: number
    // public student_id!: number
    public score!: string
    public comment?: string
}

SkillScore.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        skill_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "skill",
                key: "id",
            },
        },
        // student_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true, //for now
        // },
        period: {
            //might have to make table
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "SkillScore",
        tableName: "skill_score",
        timestamps: false,
        underscored: true,
    }
)
