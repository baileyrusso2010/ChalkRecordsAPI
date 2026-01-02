import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class FormSection extends Model {
    public id!: number
    public form_id!: number
    public name!: string
    public description!: string
}

FormSection.init(
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        //add everything else later
    },
    {
        sequelize,
        modelName: "FormSection",
        tableName: "form_sections",
        timestamps: true,
        underscored: true,
    }
)
