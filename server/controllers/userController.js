
// GET /api/user/

export const getUserData = async (req, res) =>{
    try{
        const role = req.user.role;
        const favourites = req.user.favourites;
        res.json({success: true, role, favourites})
    } catch (error) {
        res.json({success: false, message: error.message} );
    }
}

//FAVOUROTES OR WISHLIST
export const addToFavourites = async (req, res) => {
    try {
        const {favourites} = req.body;
        const user = await req.user;

        if(user.favourites.length < 4) {
            user.favourites.push(favourites);
        } else {
            user.favourites.shift(); // Remove the oldest item
            user.favourites.push(favourites); // Add the new item
        }
        await user.save();
        res.json({success: true, message: 'Wishlist updated successfully'});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}