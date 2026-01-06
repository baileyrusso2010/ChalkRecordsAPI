import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Student_Interventions extends Model {
    public id!: number
    public student_id!: number
    public intervention_id!: number
    public start_date!: Date
    public end_date!: Date
    public status!: string
}

Student_Interventions.init(
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
        intervention_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "interventions",
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
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            values: ["active", "completed", "discontinued"],
        },
        //assigned by staff
    },
    {
        sequelize,
        modelName: "Student_Interventions",
        tableName: "student_interventions",
        timestamps: false,
        underscored: true,
    }
)
