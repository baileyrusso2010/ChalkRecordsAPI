import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Rubric extends Model {
    public id!: number
    public name!: string
    public description!: string
}

Rubric.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            //name of rubric
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Rubric",
        tableName: "rubric",
        timestamps: true,
        underscored: true,
    },
)
