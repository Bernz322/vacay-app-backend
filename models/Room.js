module.exports = (sequelize, DataTypes) => {
    const Room = sequelize.define('Room', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        room_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        total_occupancy: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_bedrooms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        city: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        province: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        has_tv: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        has_kitchen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        has_air_con: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        has_heating: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        has_internet: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        room_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        listing_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }

    })

    Room.associate = (models) => {
        Room.belongsTo(models.User);
        Room.hasMany(models.Reservation, {
            onDelete: "cascade"
        })
    }
    return Room
}