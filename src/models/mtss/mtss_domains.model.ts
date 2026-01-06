import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Domains extends Model {
    public id!: number
    public name!: string
}

MTSS_Domains.init(
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
        modelName: "MTSS_Domains",
        tableName: "mtss_domains",
        timestamps: false,
        underscored: true,
    }
)
