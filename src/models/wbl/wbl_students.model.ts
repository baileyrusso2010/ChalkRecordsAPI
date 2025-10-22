import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class WBL_Students extends Model {
    public id!: number
    public student_id!: number // Foreign key to Student
    public hours!: number
    public comments!: string
}

WBL_Students.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.STRING,
            references: {
                model: "students", // name of Target model
                key: "student_id", // key in Target model that we're referencing
            },
        },
        hours: {
            type: DataTypes.FLOAT,
        },
        comments: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: "WBL_Students",
        tableName: "wbl_students",
        timestamps: false,
        underscored: true,
    }
)
