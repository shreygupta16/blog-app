const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

exports.signUp = async (req, res) => {
    const {username, password} = req.body;
    
    try{
        const hashpassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username: username,
            password: hashpassword
        });
        req.session.user = newUser;
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail'
        })
    }
};

exports.login = async (req, res) => {
    const {username, password} = req.body;

    try{
        const user = await User.findOne({username});

        if(!user){
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password);

        if(isCorrect){
            req.session.user = user;
            res.status(200).json({
                status: 'success'
            })
        }
        else{
            console.log(err);
            res.status(400).json({
                status: 'fail',
                message: 'Incorrect Password'
            })
        }
    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail'
        })
    }
};

// exports.deleteUser = async (req, res) => {
//     try{
//         const user = await User.findByIdAndDelete(req.params.id);

//         res.status(200).json({
//             status: "success",
//         });
//     }catch(err){
//         res.status(400).json({
//             status: "fail",
//         });
//     }
// };

// exports.getAllUsers = async (req, res) => {
//     try{
//         const users = await User.find();

//         res.status(200).json({
//             status: "success",
//             results: users.length,
//             data: {
//                 users,
//             },
//         });
//     }catch(err){
//         console.log(err);
//         res.status(400).json({
//             status: "fail",
//         });
//     }
// };