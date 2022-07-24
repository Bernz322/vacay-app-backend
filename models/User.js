module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            defaultValue: "09XXXXXXXXX"
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: "No description added."
        },
        profile_image: {
            type: DataTypes.STRING,
            defaultValue: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })
    User.associate = (models) => {
        User.hasMany(models.Room, {
            onDelete: "cascade"
        })
        User.hasMany(models.Reservation, {
            onDelete: "cascade"
        })
    }
    return User
}