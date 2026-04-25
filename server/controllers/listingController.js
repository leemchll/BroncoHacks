/**
 * @file listingController.js
 * @description Handles all logic related to listings
 * 
 * Functions:
 * - getListings: return all listings
 * - createListing: create a new listing
 */


let listings = [];

/**
 * @function getListings
 * @description Returns all listings
 * @route GET /api/listings
 * @access Public
 */
export const getListings = (req, res) => {
  res.json(listings);
};

/**
 * @function createListing
 * @description Creates a new listing and adds it to the list
 * @route POST /api/listings
 * @access Public
 */
export const createListing = (req, res) => {
  const newListing = {
    id: Date.now(),
    ...req.body,
  };

  listings.push(newListing);
  res.status(201).json(newListing);
};
