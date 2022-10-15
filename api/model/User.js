const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Create user as a mongoose schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name can't be empty!"]
  },
  email: {
    type: String,
    required: [true, "Email can't be empty!"]
  },
  password: {
    type: String,
    required: [true, "Password can't be empty!"]
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

//Genarate JWT token as encoded user detail
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email },
    "secret"
  );
  //Add to user's token array in database
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;