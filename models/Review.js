module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    })

    Review.associate = (models) => {
        Review.belongsTo(models.Reservation)
    }
    return Review
}