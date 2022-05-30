const express = require("express");
const helmet = require("helmet");

const PORT = 3000;
require('dotenv').config();
const config = {
    CLIENT_ID : process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET
}

const app = express();

app.use(helmet());
function checkLoggedIn(req,res,next){
    const isLoggedIn = true;
    if(!isLoggedIn){
        return res.status(401).json({
            error: "You must be logged in to view this page"
        })
    }
    next();
}
app.get('/auth/google',(req,res)=>{

})
app.get('/auth/google/callback',(req,res)=>{
    
})
app.get('/auth/logout',(req,res)=>{
    
})
app.get('/secret',checkLoggedIn,(req,res)=>{
    return res.send('secret page');
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
