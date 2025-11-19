import { clerkClient } from "@clerk/express";

export const protectAdmin = async(req, res, next) => {
    try {
        // Debug: Check if req.auth exists
        if (!req.auth) {
            console.error('req.auth is not available - Clerk middleware may not be working');
            return res.json({success: false, message: "Authentication middleware not configured"});
        }

        const auth = req.auth();
        console.log('Auth object:', auth); // Debug log

        const userId = auth?.userId;
        
        if(!userId){
            console.error('No userId found in auth');
            return res.json({success: false, message: "Authentication required"});
        }

        console.log('Fetching user with ID:', userId); // Debug log
        const user = await clerkClient.users.getUser(userId);
        console.log('User metadata:', user.privateMetadata); // Debug log

        if(user.privateMetadata.role !== 'admin'){
            return res.json({success: false, message: "You are not authorized - not an admin"});
        }

        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        console.error('Error details:', error.message);
        return res.json({success: false, message: `Authorization failed: ${error.message}`});
    }
}