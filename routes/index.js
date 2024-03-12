const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Connect to MongoDB
mongoose.connect('mongodb+srv://braydenburden00:MidtermUserPass@testdb.iwqoxuz.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define the Message schema
const messageSchema = new mongoose.Schema({
  text: String,
  user: String,
  added: Date
});

// Create the Message model
const Message = mongoose.model('Message', messageSchema);

function formatDate(date) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: userTimeZone
  };

  // Format date
  const formattedDate = new Date(date).toLocaleString('en-US', options);
  return formattedDate;
}

function timeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return months === 1 ? '1mon ago' : `${months}mons ago`;
  if (days > 0) return days === 1 ? '1d ago' : `${days}d ago`;
  if (hours > 0) return hours === 1 ? '1h ago' : `${hours}h ago`;
  if (minutes > 0) return minutes === 1 ? '1min ago' : `${minutes}mins ago`;
  return 'just now';
}

const messages = [
   {
     text: "Hi there!",
     user: "Amando",
     added: new Date()
   },
   {
     text: "Hello World!",
     user: "Charles",
     added: new Date()
   },
];

router.get('/', async (req, res) => {
  try {
    // Fetch all messages from the database
    const messages = await Message.find().sort({ added: -1 });

    // Render the index page with the retrieved messages
    res.render('index', { title: 'ThreadThrills Board', messages: messages, timeAgo: timeAgo, formatDate: formatDate });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/new', (req, res) => {
  res.render('form', { title: 'New Message' });
});

router.post('/newMessage', async (req, res) => {
  const { messageText, messageUser } = req.body;

  // Create a new message object
  const newMessage = new Message({
    text: messageText,
    user: messageUser,
    added: new Date()
  });

  try {
    // Save the new message to the database
    await newMessage.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', (req, res) => {
  const { messageUser, messageText } = req.body;

  // Validate and add the new message
  if (messageUser && messageText) {
    messages.push({ text: messageText, user: messageUser, added: new Date() });
  }

  res.redirect('/');
});


module.exports = router;
