// GET api/user/

export const getUserData = async ( req, res ) => {
    try {
        const role = req.user.role;
        const favorites = req.user.favorites;
        res.json({ success: true, role, favorites})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}