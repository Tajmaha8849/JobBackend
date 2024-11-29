import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect("mongodb+srv://Shubham12P:Shubham12P@cluster0.chy56.mongodb.net/",{
        dbName:"JobPortal",
    }).then(()=>{
        console.log("Connected to database.")
    }).catch(()=>{
        console.log("Some error ocurred.")
    })
}

// export const dbConnection=()=>mongoose.connect("mongodb+srv://shubhamprajapati9537:9265556597@cluster0.mongodb.net/JobPortal", {
//     dbName: "M",
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     retryWrites: true,
//   })
//   .then(() => {
//     console.log("Connected to database.");
//   })
//   .catch((error) => {
//     console.error("Database connection error:", error.message);
//   });
