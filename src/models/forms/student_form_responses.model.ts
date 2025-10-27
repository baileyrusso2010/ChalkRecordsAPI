import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class StudentFormResponses extends Model {
    public id!: number
    public form_id!: number
    public student_id!: number
    public responses!: JSON
}

StudentFormResponses.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        form_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "form",
                key: "id",
            },
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students",
                key: "id",
            },
        },
        responses: {
            type: DataTypes.JSONB,
        },
    },
    {
        sequelize,
        modelName: "StudentFormResponses",
        tableName: "student_form_responses",
        indexes: [
            {
                unique: true,
                fields: ["form_id", "student_id"],
            },
        ],
        timestamps: true,
        underscored: true,
    }
)
