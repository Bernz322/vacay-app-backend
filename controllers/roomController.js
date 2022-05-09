const { User, Reservation, Room } = require('../models');
// Room.sync({ alter: true }) // if we want to alter this model like adding new column to avoid dropping all table data

const createRoom = async (req, res) => {
    const currentUserId = req.user.id
    const { room_name, room_type, total_occupancy, total_bedrooms, total_bathrooms, summary, address, city, province, has_tv, has_kitchen, has_air_con,
        has_heating, has_internet, price, room_image, latitude, longitude } = req.body

    let convertedRoomImg = (!room_image ? ("[\"https://www.innsight.com//assets/images/bin/default-no-room-image.png\"]") : (room_image))

    console.log(convertedRoomImg)

    const roomDeets = {
        room_name,
        room_type,
        total_occupancy,
        total_bedrooms,
        total_bathrooms,
        summary,
        address,
        city,
        province,
        has_tv,
        has_kitchen,
        has_air_con,
        has_heating,
        has_internet,
        price,
        room_image: convertedRoomImg,
        latitude,
        longitude,
        UserId: currentUserId
    }

    try {
        const newRoom = await Room.create(roomDeets)
        res.status(200).json(newRoom)
    } catch (error) {
        // res.status(500).json({ message: "Something went wrong while creating room." })
        console.log(error)
        res.status(500).json({ message: error })
    }
}

const getRoom = async (req, res) => {
    const roomId = req.params.id

    try {
        const room = await Room.findOne({
            where: { id: roomId }, include: [
                { model: User, attributes: { exclude: ['password'] } },
                { model: Reservation },
            ]
        })

        if (!room) return res.status(404).json({ message: "Room not found!" })

        res.status(200).json(
            {
                id: room.id,
                room_name: room.room_name,
                room_type: room.room_type,
                total_occupancy: room.total_occupancy,
                total_bedrooms: room.total_bedrooms,
                total_bathrooms: room.total_bathrooms,
                summary: room.summary,
                address: room.address,
                city: room.city,
                province: room.province,
                has_tv: room.has_tv,
                has_kitchen: room.has_kitchen,
                has_air_con: room.has_air_con,
                has_heating: room.has_heating,
                has_internet: room.has_internet,
                price: room.price,
                room_image: JSON.parse(room.room_image), // room_image returns a string so we have to convert it again.
                latitude: room.latitude,
                longitude: room.longitude,
                createdAt: room.createdAt,
                updatedAt: room.updatedAt,
                listing_status: room.listing_status,
                User: room.User
            }
        )

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching room." })
    }
}

const getUserRooms = async (req, res) => {
    const userId = req.params.id

    try {
        const allRooms = await Room.findAll({
            where: { UserId: userId },
            include: [
                { model: User, attributes: { exclude: ['password'] } }
            ]
        })

        // if (allRooms.length <= 0) return res.status(404).json({ message: "The user has no created rooms." })

        if (allRooms) {
            const toReturn = allRooms.map(room => {
                const temp = {
                    id: room.id,
                    room_name: room.room_name,
                    room_type: room.room_type,
                    total_occupancy: room.total_occupancy,
                    total_bedrooms: room.total_bedrooms,
                    total_bathrooms: room.total_bathrooms,
                    summary: room.summary,
                    address: room.address,
                    city: room.city,
                    province: room.province,
                    has_tv: room.has_tv,
                    has_kitchen: room.has_kitchen,
                    has_air_con: room.has_air_con,
                    has_heating: room.has_heating,
                    has_internet: room.has_internet,
                    price: room.price,
                    room_image: JSON.parse(room.room_image), // room_image returns a string so we have to convert it again.
                    latitude: room.latitude,
                    longitude: room.longitude,
                    listing_status: room.listing_status,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt,
                    User: room.User
                }
                return temp
            })
            res.status(200).json(toReturn)  // NOTE: RETURNS room_image as String, has to be parsed.
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while fetching user's rooms." })
        console.log(error);
    }
}

const getAllRooms = async (req, res) => {
    try {
        const allRooms = await Room.findAll({
            include: [
                { model: User, attributes: { exclude: ['password'] } }
            ]
        })

        if (allRooms.length <= 0) return res.status(500).json({ message: "There are no rooms created just yet." })

        if (allRooms) {
            const toReturn = allRooms.map(room => {
                const temp = {
                    id: room.id,
                    room_name: room.room_name,
                    room_type: room.room_type,
                    total_occupancy: room.total_occupancy,
                    total_bedrooms: room.total_bedrooms,
                    total_bathrooms: room.total_bathrooms,
                    summary: room.summary,
                    address: room.address,
                    city: room.city,
                    province: room.province,
                    has_tv: room.has_tv,
                    has_kitchen: room.has_kitchen,
                    has_air_con: room.has_air_con,
                    has_heating: room.has_heating,
                    has_internet: room.has_internet,
                    price: room.price,
                    room_image: JSON.parse(room.room_image), // room_image returns a string so we have to convert it again.
                    latitude: room.latitude,
                    longitude: room.longitude,
                    listing_status: room.listing_status,
                    createdAt: room.createdAt,
                    updatedAt: room.updatedAt,
                    User: room.User
                }
                return temp
            })

            res.status(200).json(toReturn)  // NOTE: RETURNS room_image as String, has to be parsed.
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong while fetching all rooms." })
    }
}

const updateRoom = async (req, res) => {
    const { roomId, listing_status } = req.body
    const currentUser = req.user

<<<<<<< HEAD
    const roomToUpdate = await Room.findOne({
        where: { id: roomId }, include: [
            { model: User, attributes: { exclude: ['password'] } },
        ]
    })
=======
    const roomToUpdate = await Room.findOne({ where: { id: roomId } })
>>>>>>> d57a12e4f897270a858b6281d68093aa084ab5bb

    if (!roomToUpdate) return res.status(404).json({ message: "Room not found!" })

    if (roomToUpdate.UserId !== currentUser.id && !currentUser.is_admin) {
        return res.status(401).json({ message: "Cannot update status as you are not the creator of this reservation." })
    }

    try {
        if (listing_status) roomToUpdate.listing_status = listing_status.toString()

        const updatedRoom = await roomToUpdate.save()
        return res.status(200).json(updatedRoom)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while updating the user." })
    }
}

const deleteRoom = async (req, res) => {
    const id = req.params.id
    const currentUser = req.user

    try {
        const roomToDelete = await Room.findOne({ where: { id } })

        if (!roomToDelete) return res.status(404).json({ message: "Room not found!" })

        if (roomToDelete.UserId !== currentUser.id && currentUser.is_admin === false) {
            return res.status(401).json({ message: "Cannot delete as you are not the creator of this room." })
        }


        await Room.destroy({ where: { id } })
        res.json({ message: "Room deleted successfully" })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while deleting the room." })
    }
}

module.exports = { getRoom, createRoom, getAllRooms, deleteRoom, getUserRooms, updateRoom }