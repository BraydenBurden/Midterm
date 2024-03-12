const express = require('express');
const router = express.Router();

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

router.get('/', (req, res) => {
  res.render('index', { title: "ThreadThrills Board", messages: messages, timeAgo: timeAgo, formatDate: formatDate });
});

router.get('/new', (req, res) => {
  res.render('form', { title: 'New Message' });
});

router.post('/newMessage', (req, res) => {
  // Get data from the form
  const messageText = req.body.messageText;
  const messageUser = req.body.messageUser;

  // Create a new message object
  const newMessage = {
    text: messageText,
    user: messageUser,
    added: new Date()
  };

  // Add the new message to the messages array
  messages.push(newMessage);

  // Redirect back to the index page
  res.redirect('/');
});

router.post('/new', (req, res) => {
  const { messageUser, messageText } = req.body;

  // Validate and add the new message
  if (messageUser && messageText) {
    messages.push({ text: messageText, user: messageUser, added: new Date() });
  }

  res.redirect('/#bottom');
});


module.exports = router;
