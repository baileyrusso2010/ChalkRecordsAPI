import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Behavior extends Model {
    public id!: number
}

Behavior.init(
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
        staff_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "staff",
                key: "id",
            },
        },
        behavior_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "behavior_types",
                key: "id",
            },
        },
        date: {
            type: DataTypes.DATE,
        },
        location: {
            type: DataTypes.STRING,
        },
        event_description: {
            type: DataTypes.STRING,
        },
        indicent_description: {
            type: DataTypes.STRING,
        },
        resolution_name: {
            type: DataTypes.STRING,
        },
        //eventually schoolyear linkage
    },
    {
        sequelize,
        modelName: "Behavior",
        tableName: "behavior",
        timestamps: false,
        underscored: true,
    }
)
