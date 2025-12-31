import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Rubric_Entries extends Model {
    public id!: number
    public name!: string
    public description!: string
    public score!: number
    public sort_order!: number
}

Rubric_Entries.init(
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
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
        modelName: "Rubric_Entries",
        tableName: "rubric_entries",
        timestamps: true,
        underscored: true,
    }
)
