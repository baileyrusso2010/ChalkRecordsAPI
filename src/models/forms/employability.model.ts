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
        title: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
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
