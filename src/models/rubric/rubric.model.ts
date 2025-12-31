import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Rubric extends Model {
    public id!: number
    public name!: string
}

Rubric.init(
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
        //add staff later
    },
    {
        sequelize,
        modelName: "Rubric",
        tableName: "rubric",
        timestamps: true,
        underscored: true,
    }
)
