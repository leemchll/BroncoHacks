// createListing
// getListings
// getListingByld
// deleteListing

let listings = [];

export const getListings = (req, res) => {
  res.json(listings);
};

export const createListing = (req, res) => {
  const newListing = {
    id: Date.now(),
    ...req.body,
  };

  listings.push(newListing);
  res.status(201).json(newListing);
};