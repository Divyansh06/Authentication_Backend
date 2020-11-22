const Mongo = require("mongodb");
const { getDB } = require("../Utils/database");

class User {
  constructor(name, email, password) {
    this._id = new Mongo.ObjectID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = new Date().getTime();
  }

  async save() {
    const db = getDB();
    const userFound = await db
      .collection("user")
      .findOne({ email: this.email })
      .catch((err) => {
        throw err;
      });
    if (userFound) {
      throw new Error("Email address already exists.");
    }
    const result = await db
      .collection("user")
      .insertOne(this)
      .catch((err) => {
        throw err;
      });
    return {
      userId: this._id,
      name: this.name,
      email: this.email,
    };
  }

  static async findById(id) {
    const db = getDB();
    const query = { _id: Mongo.ObjectID(id) };
    const result = await db.collection("user").findOne(query);
    return result;
  }

  static async findByEmail(email) {
    const db = getDB();
    const query = { email };
    const result = await db.collection("user").findOne(query);
    return result;
  }
}

module.exports = User;
