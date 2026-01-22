import { DataTypes, Model } from "sequelize"
import sequelize from "../../../database"

export class Form_Template extends Model {
    public id!: number
    public name!: string
}

Form_Template.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //othe rattributes like school_year, term, created by, locked, etc, tenant
    },
    {
        sequelize,
        modelName: "Form_Template",
        tableName: "form_templates",
        timestamps: false,
        underscored: true,
    },
)
