import { DataTypes, Model } from "sequelize"
import sequelize from "../database"
import { getTenant } from "../utils/tenant.context"

export class Student extends Model {
    public id!: number
    public first_name!: string
    public last_name!: string
    public student_id!: string
    public grade!: string
    public gender?: string
    public age!: number
    public school_id!: number
    public district_id!: number
}

Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        student_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.STRING,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "school",
                key: "id",
            },
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "district",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "Student",
        tableName: "students",
        timestamps: false,
        underscored: true,
        hooks: {
            beforeFind: (options) => {
                const districtId = getTenant()
                if (districtId) {
                    options.where = {
                        ...options.where,
                        district_id: districtId,
                    }
                }
            },
            beforeValidate: (instance) => {
                const districtId = getTenant()
                if (districtId) {
                    instance.district_id = districtId
                }
            },
            beforeCreate: (instance) => {
                const districtId = getTenant()
                if (districtId) {
                    instance.district_id = districtId
                }
            },
        },
    },
)
