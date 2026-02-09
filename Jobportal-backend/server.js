const express = require('express');
const dotenv =require('dotenv');
const cors =require('cors');
const {connectDb} =require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const companyRoutes = require('./routes/companyRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();

connectDb();

const app =express();

app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.use(cors());

app.get('/',(req,res)=>{
    res.status(200).json({
        message:'welcome to job portal'
    });
});

app.use('/api/auth',authRoutes);

app.use('/api/jobs',jobRoutes);

app.use('/api/applications',applicationRoutes);

app.use('/api/companies', companyRoutes);

app.use('/api/posts', postRoutes);

app.use('/api/comments', commentRoutes);

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
});