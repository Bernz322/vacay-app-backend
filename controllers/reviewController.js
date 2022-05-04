const { Reservation, Review } = require("../models")

async function reservationChecker(id) {
    const exists = await Reservation.findOne({
        where: { id }
    })
    if (exists) return true
    return false
}

const createReview = async (req, res) => {
    const { reservationId, rating, comment } = req.body

    const reservationExists = await reservationChecker(reservationId)

    if (!reservationExists) return res.status(404).json({ message: "You are trying to make a review on a reservation that doesn't exist!" })

    const reviewDeets = { ReservationId: reservationId, rating, comment }

    try {
        const review = await Review.create(reviewDeets)
        res.status(200).json(review)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating review." })
    }
}

const deleteReview = async (req, res) => {
    const id = req.params.id

    try {
        const reviewToDelete = await Review.findOne({ where: { id } })

        if (!reviewToDelete) return res.status(404).json({ message: "Review not found!" })

        await Review.destroy({ where: { id } })
        res.json({ message: "Review deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting the reservation." })
    }
}

module.exports = { createReview, deleteReview }