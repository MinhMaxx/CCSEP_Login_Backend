const User = require("../model/User");

//Register method
exports.register = async (req, res) => {
  try {
    //Find user with the same email in the database
    let isUser = await User.find({ email: req.body.email });

    //If there's an user with the register's email
    if (isUser.length >= 1) {
      //Cancel the registration request
      return res.status(409).json({
        message: "The email have already been used!"
      });
    }

    //If the register's email have not been used then create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    //Stored and respond with the user detail + JWT token
    let data = await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ data, token });
  } catch (err) {
    //Respond with and error if caught one
    res.status(400).json({ err: err.message });
  }
};


//Login method
exports.login = async (req, res) => {
  try {
    //Obtain email and password from request body
    const {email,  password}  = req.body;

    
    // ----------EXPLOIT---------- // 
    const user = await User.findOne({email,password}).exec();
    // This method use the findOne function which can be exploited
    // ----------EXPLOIT---------- // 


    //Respond with and error if can't an user
    if (!user) {
      return res
        .status(401)
        .json({ error: "Incorrect email or password!" });
    }

    //Respond with JWT token if user cretidential is correct
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    //Respond with and error if caught one
    res.status(400).json({ err: err });
  }
};


//Get user detail method
exports.getUserDetails = async (req, res) => {
  await res.json(req.userData);
};