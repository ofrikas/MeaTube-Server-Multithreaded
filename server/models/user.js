// models/User.js
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String, 
    required: true,
    unique: true
  },
  image: { 
    type: String
  },
  subscribers: {
    type: Number,
    default: 0
  }
}, { timestamps: true });
userSchema.index({ username: 1 }, { unique: true });


userSchema.statics.addUser = async function(userData) {
  const { username, password, passwordConfirmation, displayName, image } = userData;

  // Check if all fields are filled out
  if (!username || !password || !passwordConfirmation || !displayName || !image) {
    throw new Error("All fields must be filled out!");
  }

  // Check if passwords match
  if (password !== passwordConfirmation) {
    throw new Error("Passwords do not match!");
  }

  // Check password complexity
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("Password is not complex enough! Please choose another password according to password details.");
  }

  try {

    const newUser = new this(userData);
    const savedUser = await newUser.save();

    return savedUser;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new Error('Validation Error: ' + error.message);
    } else if (error.code === 11000) { // Handle duplicate key error
      throw new Error('A user with this username is already exists.');
    } else {
      throw new Error('Error adding user: ' + error.message);
    }
  }
};


// Static method to find user by ID
userSchema.statics.findUserById = async function(userId) {
  try {
    const user = await this.findOne({_id:userId});
    return user;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new Error('Validation Error: ' + error.message);
    } else {
        throw new Error('Error adding user: ' + error.message);
    }
  }
};

userSchema.statics.findUserByChannelName = async function(channelName) {
  try {
    const user = await this.findOne({ displayName: channelName });
    return user;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new Error('Validation Error: ' + error.message);
    } else {
      throw new Error('Error finding user by channel name: ' + error.message);
    }
  }
};

userSchema.statics.findUserByUsername = async function(username) {
  try {
    const user = await this.findOne({username: username });
    return user;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new Error('Validation Error: ' + error.message);
    } else {
      throw new Error('Error finding user by username: ' + error.message);
    }
  }
};

userSchema.statics.updateUser = async function(username, updatedData) {
  try {
      // Use findOneAndUpdate to update the user by its username
      const updatedUser = await this.findOneAndUpdate(
          { username: username }, 
          updatedData, 
          { new: true, runValidators: true } // Options: return the updated document, and run validation
      );

      // If no user is found with the given username, throw an error
      if (!updatedUser) {
          throw new Error('User not found');
      }

      return updatedUser;
  } catch (error) {
      if (error.name === 'ValidationError') {
          throw new Error('Validation Error: ' + error.message);
      } else {
          throw new Error('Error updating user: ' + error.message);
      }
  }
};


// Define a static method to delete a user by userId
userSchema.statics.deleteUser = async function(userId) {
  try {
      const deletedUser = await this.findOneAndDelete({ username: userId });

      if (!deletedUser) {
          throw new Error('User not found');
      }

      return deletedUser;
  } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;