import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Meetings extends Model {
    public id!: number
    public student_id!: number
    public meeting_date!: Date
    public meeting_type!: string
    public outcome!: string
}

MTSS_Meetings.init(
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
        meeting_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        meeting_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        outcome: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "MTSS_Meetings",
        tableName: "mtss_meetings",
        timestamps: true,
        underscored: true,
    }
)
