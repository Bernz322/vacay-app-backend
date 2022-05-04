const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { User, Room, Reservation, Review } = require('../models');
// Reservation.sync({ alter: true })
async function ifRoomExist(id) {
    const exists = await Room.findOne({
        where: { id }
    })
    if (exists) return true
    return false
}

const createReservation = async (req, res) => {
    const currentUser = req.user.id
    const { startDate, endDate, price, total, roomId, totalGuest } = req.body

    var start_date = new Date(startDate).toISOString();
    var end_date = new Date(endDate).toISOString();

    if (!currentUser || !roomId) return res.status(404).json({ message: "Missing important fields." })

    const checker = await ifRoomExist(roomId)

    if (!checker) return res.status(404).json({ message: "You are trying to make a reservation on a room that doesn't exist!" })

    const reservationDeets = { start_date, end_date, price, total, totalGuest, UserId: currentUser, RoomId: roomId }

    try {
        const reservation = await Reservation.create(reservationDeets)
        res.status(200).json(reservation)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while creating your reservation." })
        console.log(error);
    }
}

const checkAvailability = async (req, res) => {
    const { room_id, startDate, endDate } = req.body
    /**
     * Read below to better understand the query logic
     * https://stackoverflow.com/questions/23955445/mysql-query-for-booking-how-to-allow-two-reservations-on-the-same-date-check-i
     * https://docs.sequelizejs.com/v3/docs/querying/#operators
     * (checkin <= '$check_in' AND checkout >= '$check_in') OR
     * (checkin < '$check_out' AND checkout >= '$check_out') OR
     * (checkin >= '$check_in' AND checkout < '$check_out')
     */

    if (!room_id || !startDate || !endDate) return res.status(404).json({ message: "Missing important fields." })
    const checker = await ifRoomExist(room_id)

    if (!checker) return res.status(404).json({ message: "You are trying to check the availability of a room that doesn't exist!" })

    const isAvailable = await Reservation.findAll({
        where: {
            RoomId: room_id,
            [Op.or]: [
                {
                    [Op.and]: [{
                        start_date: {
                            [Op.lte]: new Date(startDate).toISOString()
                        },
                        end_date: {
                            [Op.gte]: new Date(startDate).toISOString()
                        }
                    }]
                },
                {
                    [Op.and]: [{
                        start_date: {
                            [Op.lte]: new Date(endDate).toISOString()
                        },
                        end_date: {
                            [Op.gte]: new Date(endDate).toISOString()
                        }
                    }]
                },
                {
                    [Op.and]: [{
                        start_date: {
                            [Op.gte]: new Date(startDate).toISOString()
                        },
                        end_date: {
                            [Op.lte]: new Date(endDate).toISOString()
                        }
                    }]
                }]
        },
    })
    if (isAvailable.length === 0) return res.status(200).json(true)
    if (isAvailable) return res.status(200).json(false)
}

const getAllUserReservation = async (req, res) => {
    const UserId = req.user.id
    try {
        const reservation = await Reservation.findAll({
            where: { UserId },
            include: [
                { model: User, attributes: { exclude: ['password', 'is_admin'] } },
                { model: Room, include: [User] },
                { model: Review }
            ]
        })

        res.status(200).json(reservation)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching all reservations." })
    }
}

const getReservationById = async (req, res) => {
    const reservationId = req.params.id
    try {
        const reservation = await Reservation.findOne({
            where: { id: reservationId },
            include: [
                { model: User, attributes: { exclude: ['password', 'is_admin'] } },
                { model: Room, include: [User] },
                { model: Review }
            ]
        })
        if (!reservation) return res.status(404).json({ message: "Reservation not found!" })
        res.status(200).json({ reservation, room_image: JSON.parse(reservation.Room.room_image) })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching the reservation." })
    }
}

const getRoomReservation = async (req, res) => {
    const roomId = req.params.id
    try {
        const reservation = await Reservation.findAll({
            where: { RoomId: roomId },
            include: [
                { model: User, attributes: { exclude: ['password', 'is_admin'] } },
                { model: Room },
                { model: Review }
            ]
        })
        // if (reservation.length <= 0) return res.status(404).json({ message: "Room has no reservations." })

        res.status(200).json(reservation)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching the rooms list of reservations." })
    }
}

const updateReservation = async (req, res) => {
    const { reservationId, reservation_status, guest_status } = req.body
    const currentUser = req.user

    const reservationToUpdate = await Reservation.findOne({ where: { id: reservationId } })

    if (!reservationToUpdate) return res.status(404).json({ message: "Reservation not found!" })

    // if (reservationToUpdate.UserId !== currentUser.id && !currentUser.is_admin) {
    //     return res.status(401).json({ message: "Cannot update statuses as you are not the creator of this reservation." })
    // }

    try {
        if (reservation_status && reservation_status !== undefined) reservationToUpdate.reservation_status = reservation_status.toString()
        if (guest_status && guest_status !== undefined) reservationToUpdate.guest_status = guest_status.toString()

        const updatedReservation = await reservationToUpdate.save()
        return res.status(200).json(updatedReservation)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while updating the user." })
    }
}

const deleteReservation = async (req, res) => {
    const id = req.params.id
    const currentUser = req.user

    try {
        const reservationToDelete = await Reservation.findOne({ where: { id } })

        if (!reservationToDelete) return res.status(404).json({ message: "Reservation not found!" })

        if (reservationToDelete.UserId !== currentUser.id && !currentUser.is_admin) {
            return res.status(401).json({ message: "Cannot delete as you are not the creator of this reservation." })
        }

        await Reservation.destroy({ where: { id } })
        res.json({ message: "Reservation deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting the reservation." })
    }
}

module.exports = { createReservation, getAllUserReservation, getReservationById, getRoomReservation, deleteReservation, checkAvailability, updateReservation }