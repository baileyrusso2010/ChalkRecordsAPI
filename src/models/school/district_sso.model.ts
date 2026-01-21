import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class District_SSO extends Model {
    public id!: number
    public district_id!: number
    public sso_id!: number
}
//links sso to user

District_SSO.init(
    {
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "district",
                key: "id",
            },
        },
        provider: {
            type: DataTypes.STRING, //like google, azure, etc
            allowNull: false,
        },
        domain: {
            type: DataTypes.STRING, //like district.edu
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "District_SSO",
        tableName: "district_sso",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
        indexes: [
            {
                unique: true,
                fields: ["district_id", "provider"],
            },
        ],
    }
)
