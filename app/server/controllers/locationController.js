const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
const getLocations = async (req, res, next) => {
    try {
        const locations = await Location.find({ isActive: true });
        res.json(locations);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all locations (Admin)
// @route   GET /api/locations/admin
// @access  Private/Admin
const getAllLocations = async (req, res, next) => {
    try {
        const locations = await Location.find({});
        res.json(locations);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = async (req, res, next) => {
    try {
        const { name, address, city, coordinates, openingHours, phone, isActive } = req.body;
        const location = new Location({
            name,
            address,
            city,
            coordinates,
            openingHours,
            phone,
            isActive: isActive !== undefined ? isActive : true
        });
        const created = await location.save();
        res.status(201).json(created);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = async (req, res, next) => {
    try {
        const location = await Location.findById(req.params.id);
        if (location) {
            location.name = req.body.name || location.name;
            location.address = req.body.address || location.address;
            location.city = req.body.city || location.city;
            location.coordinates = req.body.coordinates || location.coordinates;
            location.openingHours = req.body.openingHours || location.openingHours;
            location.phone = req.body.phone || location.phone;
            location.isActive = req.body.isActive !== undefined ? req.body.isActive : location.isActive;
            const updated = await location.save();
            res.json(updated);
        } else {
            res.status(404);
            throw new Error('Location not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private/Admin
const deleteLocation = async (req, res, next) => {
    try {
        const location = await Location.findById(req.params.id);
        if (location) {
            await location.deleteOne();
            res.json({ message: 'Location removed' });
        } else {
            res.status(404);
            throw new Error('Location not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLocations,
    getAllLocations,
    createLocation,
    updateLocation,
    deleteLocation
};
