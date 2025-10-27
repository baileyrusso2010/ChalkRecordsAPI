import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Form extends Model {
    public id!: number
    public form_data!: JSON
}

Form.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        form_data: {
            type: DataTypes.JSONB,
        },
        //class id later
    },
    {
        sequelize,
        modelName: "Form",
        tableName: "form",
        timestamps: false,
        underscored: true,
    }
)
