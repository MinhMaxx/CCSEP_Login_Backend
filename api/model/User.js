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

// Hash the password before saving the user model
userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
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

//Search for a user by email then compare passsword with the encrypted password
userSchema.statics.findByCredentials = async (email, password) => {
  try
  {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new Error({ error: "Incorrect email or password!" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error({ error: "Incorrect email or password!" });
    }
    return user;
  }
  catch(err){
    return null;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;