import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"
import { getTenant } from "../../utils/tenant.context"

export class Staff extends Model {
    public id!: number
    public staff_id?: string
    public district_id!: number
    public first_name!: string
    public last_name!: string
    public email?: string
}

Staff.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        staff_id: {
            type: DataTypes.STRING,
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "district",
                key: "id",
            },
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true, //for now until delete data
        },
        //roll later
        //add more later, just for testing
        //external sso id
    },
    {
        sequelize,
        modelName: "Staff",
        tableName: "staff",
        timestamps: false,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ["district_id", "staff_id"],
            },
            {
                unique: true,
                fields: ["district_id", "email"],
            },
        ],
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
