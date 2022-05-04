module.exports = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('Reservation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        start_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        end_date: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        total: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        totalGuest: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        reservation_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        guest_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

    })

    Reservation.associate = (models) => {
        Reservation.belongsTo(models.User);
        Reservation.belongsTo(models.Room);
        Reservation.hasOne(models.Review, {
            onDelete: "cascade"
        })
    }
    return Reservation
}