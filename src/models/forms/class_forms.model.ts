import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class ClassForm extends Model {
    public id!: number
}

ClassForm.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        course_instance_id: {
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
        rubric_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "rubric",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "ClassForm",
        tableName: "class_forms",
        timestamps: true,
        underscored: true,
    }
)
