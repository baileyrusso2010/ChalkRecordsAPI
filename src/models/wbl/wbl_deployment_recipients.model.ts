import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"
import { WBL_Deployments } from "./wbl_deployments.model"
import { Student } from "../student.model"

export class WBL_Deployment_Recipients extends Model {
    public id!: number
    public deployment_id!: number
    public student_id?: number
    public token!: string
    public expires_at?: Date
    public deployment?: WBL_Deployments
    public student?: Student
    public submitted?: boolean
}

WBL_Deployment_Recipients.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        deployment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "wbl_deployments", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
            allowNull: false,
        },
        student_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "students", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
        },
        token: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        submitted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "WBL_Deployment_Recipients",
        tableName: "wbl_deployment_recipients",
        timestamps: true,
        underscored: true,
    }
)
