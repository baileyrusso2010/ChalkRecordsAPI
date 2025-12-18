import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class District extends Model {
    public id!: number;
    public name!: string;
    public address?: string;
    public contact_email?: string;
    public phone_number?: string;
}

District.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
        },
        contact_email: {
            type: DataTypes.STRING(100),
        },
        phone_number: {
            type: DataTypes.STRING(50),
        },
    },
    {
        sequelize,
        modelName: "District",
        tableName: "district",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
