import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Rubric_Levels extends Model {
    public id!: number
    public rubric_id!: number
    public value!: number
    public label!: string
    public description!: string
    public sort_order!: number
}

Rubric_Levels.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        rubric_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "rubric",
                key: "id",
            },
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        //add staff later
    },
    {
        sequelize,
        modelName: "Rubric_Level",
        tableName: "rubric_levels",
        timestamps: true,
        underscored: true,
    },
)
