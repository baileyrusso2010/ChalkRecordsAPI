import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class ClassFormAssignment extends Model {
    public id!: number
    public class_id!: number
    public form_id!: number
    public assigned_at!: Date
    public due_date?: Date
    public status!: string
}

ClassFormAssignment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course_instance",
                key: "id",
            },
        },
        form_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "form",
                key: "id",
            },
        },
        assigned_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: "active",
        },
    },
    {
        sequelize,
        modelName: "ClassFormAssignment",
        tableName: "class_form_assignment",
        timestamps: true,
        underscored: true,
    }
)
