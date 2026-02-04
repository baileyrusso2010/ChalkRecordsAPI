import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Evaluation_Status extends Model {
    public id!: number
}

Evaluation_Status.init(
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
        form_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "forms",
                key: "id",
            },
        },
        is_completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "Evaluation_Status",
        tableName: "evaluation_status",
        timestamps: true,
        underscored: true,
    },
)
