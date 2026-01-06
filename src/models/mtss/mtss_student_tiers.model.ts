import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Student_Tiers extends Model {
    public id!: number
    public student_id!: number
    public tier_id!: number
    public domain_id!: number
    public start_date!: Date
    public end_date!: Date
    public reason!: string
}

MTSS_Student_Tiers.init(
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
        tier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_tiers",
                key: "id",
            },
        },
        domain_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_domains",
                key: "id",
            },
        },
        start_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        //created by later
    },
    {
        sequelize,
        modelName: "MTSS_Student_Tiers",
        tableName: "mtss_student_tiers",
        timestamps: false,
        underscored: true,
    }
)
