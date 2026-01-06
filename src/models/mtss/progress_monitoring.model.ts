import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Progress_Monitoring extends Model {
    public id!: number
    public student_intervention_id!: number
    public measurement_date!: Date
    public score!: string
    public goal!: string
    public notes!: string
}

Progress_Monitoring.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_intervention_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "student_interventions",
                key: "id",
            },
        },
        measurement_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        score: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        goal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Progress_Monitoring",
        tableName: "progress_monitoring",
        timestamps: false,
        underscored: true,
    }
)
