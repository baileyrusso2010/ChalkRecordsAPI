import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Decisions extends Model {
    public id!: number
    public meeting_id!: number
    public decision_type!: string
    public notes!: string
    public effective_date!: Date
}

MTSS_Decisions.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        meeting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_meetings",
                key: "id",
            },
        },
        decision_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        effective_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "MTSS_Decisions",
        tableName: "mtss_decisions",
        timestamps: true,
        underscored: true,
    }
)
