//Get all the published fronted and backend courses,
//sort them by their price in descending order,
//pick only their name and author,
//and display them.

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises');

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: Date,
  isPublished: Boolean,
  price: Number
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
  return await Course
    .find({ isPublished: true})//OTHER OPTION ,tags: { $in: ['frontend', 'backend']}})
    .or([ { tags: 'frontend'}, { tags: 'backend'}])
    .sort({ price: -1}) //or ('-price')
    .select({ name: 1, author: 1, price: 1}); // or ('name author price')
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
