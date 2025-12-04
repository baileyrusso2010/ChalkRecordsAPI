import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class WBL_Deployments extends Model {}

WBL_Deployments.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        staff_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "staff", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "WBL_Deployments",
        tableName: "wbl_deployments",
        timestamps: true,
        underscored: true,
    }
)
