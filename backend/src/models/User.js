const bcrypt = require('bcryptjs');

// In-memory user storage
const users = [];
let userIdCounter = 1;

class User {
  constructor(data) {
    this._id = data._id || userIdCounter++;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.role = data.role || 'user';
    this.lastLogin = data.lastLogin || new Date();
    this.createdAt = data.createdAt || new Date();
    this.stats = data.stats || {};
  }

  // Hash password before saving
  async save() {
    if (this._isPasswordModified) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this._isPasswordModified = false;
    }

    // Update or add user to in-memory storage
    const existingIndex = users.findIndex(u => u._id === this._id);
    if (existingIndex >= 0) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    
    return this;
  }

  // Compare passwords for login
  async comparePassword(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  }

  // Static methods
  static findOne(query) {
    return Promise.resolve(
      users.find(user => {
        for (const [key, value] of Object.entries(query)) {
          if (user[key] !== value) {
            return false;
          }
        }
        return true;
      })
    );
  }

  static findById(id) {
    return Promise.resolve(users.find(user => user._id == id));
  }

  static create(userData) {
    const newUser = new User(userData);
    newUser._isPasswordModified = true;
    return newUser.save();
  }
}

module.exports = User;
