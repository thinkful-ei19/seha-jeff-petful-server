'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();
let Queue = require('./queue.js');

let cats = new Queue();
let dogs = new Queue();
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
 cats.enqueue({
  imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg', 
  imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
  name: 'Fluffy',
  sex: 'Female',
  age: 2,
  breed: 'Bengal',
  story: 'Thrown on the street'
});
cats.enqueue({
  imageURL:'https://tailandfur.com/wp-content/uploads/2014/10/animals-with-mustache-9.jpg', 
  imageDescription: 'Grey and Black cat with a milk mustache .',
  name: 'Gato',
  sex: 'Male',
  age: 3,
  breed: 'Domestic Shorthair',
  story: "Owner was Jealous, that he couldn't grow a mustache "
})
cats.enqueue({
  imageURL:'http://westerry.com/eric/_Media/cat-with-citrus-helmut-2_360.jpeg', 
  imageDescription: 'White Cat, thats a melon head ',
  name: 'Melody ',
  sex: 'Female',
  age: 4,
  breed: 'Domestic Shorthair',
  story: "Owner wasn't amused "
});

 dogs.enqueue ({
  imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
  imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
  name: 'Zeus',
  sex: 'Male',
  age: 3,
  breed: 'Golden Retriever',
  story: 'Owner Passed away'
})
dogs.enqueue({
  imageURL: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/french-bulldog-dog-breed-pictures/2-whitelaying.jpg',
  imageDescription: 'French Bulldog enjoying some rest after a long hike.',
  name: 'Jackson',
  sex: 'Male',
  age: 3,
  breed: 'French BullDog',
  story: "Owner moved to France,couldn't take him with him"
})
dogs.enqueue({
  imageURL: 'http://cdn3-www.dogtime.com/assets/uploads/gallery/pit-bull-dog-breed-pictures/pit-bull-dog-breed-picture-1.jpg',
  imageDescription: 'PitBull looking pretty as usual ',
  name: 'Athena',
  sex: 'Female',
  age: 1,
  breed: 'American Pitbull',
  story: "LandOwner didn't allow Pitbulls"
})
app.get('/api/cat', function(req, res) {
  res.json(cats.peek());
});

app.delete('/api/cat/', function(req, res) {
  res.json(cats.dequeue());
});

app.get('/api/dog', function(req, res) {
  res.json(dogs.peek());
});

app.delete('/api/dog/', function(req, res) {
  res.json(dogs.dequeue());
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
