import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Referrals extends Model {
    public id!: number
    public student_id!: number
    public referral_type!: string
    public referral_date!: Date
    public status!: string
}

Referrals.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students",
                key: "id",
            },
        },
        referral_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        referral_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Referrals",
        tableName: "referrals",
        timestamps: true,
        underscored: true,
    }
)
