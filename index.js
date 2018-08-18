const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(()=> console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err))

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
    lowercase: true,
    //uppercase: true,
    trim: true
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function(v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: 'A course should have at least one tag.'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() { return this.isPublished; },
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v),

  }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    category: 'Web',
    author: 'Mosh',
    tags: ['frontend'],
    isPublished: true,
    price: 15.8
  });

  try{
    const result = await course.save();
    console.log(result);
  }
  catch (ex) {
    for (field in ex.errors)
      console.log(ex.errors[field].message);
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course
    .find({ author: 'Mosh', isPublished: true})
    .skip((pageNumber -1) * pageSize)
    .limit(pageSize)
    .sort({name: 1})
    .select({name: 1, tags: 1})
  console.log(courses);
}

async function updateCourse(id){
  const course = await Course.findByIdAndUpdate( id, {
    $set: {
      author: 'Jason',
      isPublished: false
    }
  }, { new: true });
    console.log(course);
}

async function removeCourse(id){
  // const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

createCourse();
//createCourse();
//getCourses();


//VALIDATION
//
//Async Validator
//
//Example (uses a callback function)
//
//    validate: {
//       isAsync: true,
//       validator: function(v, callback) {
//         setTimeout(() => {
//           const result = v && v.length > 0;
//           callback(result);
//         }, 4000);
//       },
//       message: 'A course should have at least one tag.'
//     }
//
//Validation Errors
//  try{
//     const result = await course.save();
//     console.log(result);
//   }
//   catch (ex) {
//     for (field in ex.errors)
//       console.log(ex.errors[field].message);
//   }
// }

//REMOVING DOCUMENTS***************************
//
//EXAMPLE #1 (deleteOne or deleteMany)
//async function removeCourse(id){
//   const result = await Course.deleteOne({ _id: id }); //Could use deleteMany instead of deleteOne to delete more than one document
//   console.log(result);
// }
//
// removeCourse('5b77318b898c0c9eb892a9a3');
//
//EXAMPLE #2 (fineByIdAndRemove)
//
//async function removeCourse(id){
//   const course = await Course.findByIdAndRemove(id);
//   console.log(course);
// }
//
// removeCourse('5b77318b898c0c9eb892a9a3');

//UPDATING DOCUMENTS***************************
//#1
//Approach: Query first
//findbyId()
//Modify its  properties
//------  course.set({
//        isPublished: true,
//        author: 'Another Author' ***OPTIONAL APPROACH to line 47 and 48
//      });
//save()
//
//EXAMPLE:
//async function updateCourse(id){
//   const course = await Course.findById(id);
//     if (!course) return;
//
//     course.isPublished = true;
//     course.author = 'Another Author';
//
//     const result = await course.save();
//     console.log(result);
// }
//
// updateCourse('5b77318b898c0c9eb892a9a3');

//#2
//Approach: Update first
//Update directly
//Optionally: get the updated document
//
//EXAMPLE
//async function updateCourse(id){
//   const result = await Course.update({ _id: id }, {
//     $set: {
//       author: 'Mosh',
//       isPublished: false
//     }
//   });
//     console.log(result);
// }
//
// updateCourse('5b77318b898c0c9eb892a9a3');
//
//Another EXAMPLE
//async function updateCourse(id){
//   const course = await Course.findByIdAndUpdate( id, {
//     $set: {
//       author: 'Jason',
//       isPublished: false
//     }
//   }, { new: true });
//     console.log(course);
// }
//
// updateCourse('5b77318b898c0c9eb892a9a3');




//Class e.g. Human is a blueprint
//Object e.g. John is an instance of a class or blueprint


//COMPARISON OPERATORS********************************
// eq (equal)
// ne (not eaul)
// gt (greater than)
// gte (greater than or equal to)
// lt (less than)
// lte (less than or equal to )
// in
// nin (not in)
//
//EXAMPLES
//
//.find({ price: { $gte: 10, $lte: 20 } })
//.find({ price: { $in: [10, 15, 20] }})

//LOGICAL OPERATORS
//and
//or
//
//EXAMPLES
//
// .find()
//   .or([ { author: 'Mosh'}, { isPublished: true }])
//   .and([ ])

//REGULAR EXPRESSIONS
//
//EXAMPLES
//
//    // Starts with Mosh
//     .find({ author: /^Mosh/ })// use ^ to find things that start with Mosh
//
//     // Ends with Hamedani
//     .find({ author: /Hamedani$/i })// Ends use $ and i if not case sensitive
//
//     // Contains Mosh
//     .find({ author: /.*Mosh.*/i }) //i again for not case sensitive
//
// COUNTING
//EXAMPLE
//    .find({ author: 'Mosh', isPublished: true})
//     .limit(10)
//     .sort({name: 1})
//     .count();
//          OUTPUTS : 2
// collection.count is deprecated, and will be removed in a future version.
// Use collection.countDocuments or collection.estimatedDocumentCount instead
//
// PAGINATION
//
//async function getCourses() {
//   const pageNumber = 2;
//   const pageSize = 10;
//   // /api/courses?pageNumber=2&pageSize=10
//
//   const courses = await Course
//     .find({ author: 'Mosh', isPublished: true})
//     .skip((pageNumber -1) * pageSize)
//     .limit(pageSize)
//     .sort({name: 1})
//     .select({name: 1, tags: 1})
//   console.log(courses);
// }