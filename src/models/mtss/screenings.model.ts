import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Screenings extends Model {
    public id!: number
    public student_id!: number
    public domain_id!: number
    public assessment_name!: string
    public score!: number
    public benchmark!: number
    public screening_date!: Date
}

Screenings.init(
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
        domain_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_domains",
                key: "id",
            },
        },
        assessment_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        benchmark: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        screening_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        //possible window like terms
    },
    {
        sequelize,
        modelName: "Screenings",
        tableName: "screenings",
        timestamps: false,
        underscored: true,
    }
)
