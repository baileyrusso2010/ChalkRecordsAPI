import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class WBL_Catagories extends Model {
    public id!: number
    public name!: string
}

WBL_Catagories.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "WBL_Catagories",
        tableName: "wbl_catagories",
        timestamps: true,
        underscored: true,
    }
)
