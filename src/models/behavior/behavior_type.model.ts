import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class BehaviorType extends Model {
    public id!: number
    public name!: string // e.g., "Insubordination"
    public code?: string // Optional: State reporting code
}

BehaviorType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Prevent duplicates
        },
        code: {
            type: DataTypes.STRING,
            allowNull: true,//not srue if needed, maybe for internal?
        },
    },
    {
        sequelize,
        modelName: "BehaviorType",
        tableName: "behavior_types",
        timestamps: false,
        underscored: true,
    }
)
