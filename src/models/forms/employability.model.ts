import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Employability extends Model {
    public id!: number
    public student_id!: number // Foreign key to Student
    public form_data!: JSON
}

Employability.init(
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
        form_data: {
            type: DataTypes.JSONB,
        },
    },
    {
        sequelize,
        modelName: "Employability",
        tableName: "employability",
        timestamps: true,
        underscored: true,
    }
)
