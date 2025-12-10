import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Assessments extends Model {}

Assessments.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        test_id: {
            type: DataTypes.INTEGER,
            //this will keep track of the test to classify?
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.TEXT,
        },
        date_administered: {
            type: DataTypes.DATE,
        },
        meta: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
    },
    {
        sequelize,
        modelName: "Assessments",
        tableName: "assessments",
        timestamps: true,
        underscored: true,
    }
)
