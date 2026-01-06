import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Meeting_Participants extends Model {
    public id!: number
    public meeting_id!: number
    public participant_id!: number
    public role!: string
}

MTSS_Meeting_Participants.init(
    {
        meeting_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_meetings",
                key: "id",
            },
        },
        participant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        role: {
            type: DataTypes.STRING,
            allowNull: true, //not sure if needed
        },
    },
    {
        sequelize,
        modelName: "MTSS_Meeting_Participants",
        tableName: "mtss_meeting_participants",
        timestamps: false,
        underscored: true,
    }
)
