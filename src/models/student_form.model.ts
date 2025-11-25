import { DataTypes, Model } from "sequelize"
import sequelize from "../database"
import { defaultValueSchemable } from "sequelize/types/utils"

export class StudentForm extends Model {
    public student_id!: number
    public form_id!: number
    public class_form_assignment_id!: number
}

StudentForm.init(
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
                model: "form",
                key: "id",
            },
        },
        class_form_assignment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "class_form_assignment",
                key: "id",
            },
        },
        complete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "StudentForm",
        tableName: "student_forms",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["student_id", "class_form_assignment_id"],
            },
        ],
    }
)
