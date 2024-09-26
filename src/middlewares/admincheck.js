export const isAdminCheck = (req, res, next) => {
    let admCheck = true;
    if(admCheck) {
        console.log("Admin is verified");
    }else{
        console.log("Admin is not verified");
        res.status(401).json({message: "Not verified"})
    }
    next()
}


// export const adminMiddlewares = (req, res, next) => {
//     res.json({ message: "Admin middlewares activated!"})
//     next();
// }