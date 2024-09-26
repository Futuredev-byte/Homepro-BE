export const authCheck = (req, res, next) => {
    // return res.json({message: "User authentication middleware running"})
    console.log("User authentication middleware running");
    let isAuth = true;
    if(isAuth) {
        console.log("User is authenticated"); 
        res.json({message: "authorized"});
   
    }else{
        console.log("User is not authenticated!");
        res.status(401).json({message: "Unauthorized"});
    }
    next();
};


export const globalMiddleware = (req, res, next) => {
    // res.json({ message: "General middleware activated!" })
    console.log("General middleware activated!");
    
    next();
    
}


