import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export class Staff extends Model {
    public id!: number
    public name!: string // Unique name for the flag
}

Staff.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        //add more later, just for testing
    },
    {
        sequelize,
        modelName: "Staff",
        tableName: "staff",
        timestamps: false,
        underscored: true,
    }
)
