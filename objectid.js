// _id: 5a724953ab83547957541e6a

// 12 bytes
  // first 4 bytes: timestamp
  // next 3 bytes: machine identifier
  // next 2 bytes: process identifier
  // next 3 bytes: counter

// 1 byte = 8 bits
// 2 ^ 8 = 256
// 2 ^ 24 = 16 million

//MongoDB Driver talks to MongoDB
//Driver itself generates a unique identifier itself
//Mongoose talks to MongoDB Driver to make a new ID

//YOU CAN CREATE YOUR OWN UNIQUE IDENTIFIER

const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();

console.log(id);

