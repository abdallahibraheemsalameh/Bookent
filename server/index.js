require('dotenv/config');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
let path = require('path');
const fs = require('fs');
const { createToken, validateToken } = require('./jwt');

const UserModel = require('./models/user');
const BookModel = require('./models/book');
const ConversationModel = require('./models/conversation');
const MessageModel = require('./models/message');
const ReportsModel = require('./models/report');

const cloudinary = require('./utils/cloud');

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// multer storage for users

const storage = multer.diskStorage({});
const limits = { fileSize: 1024 * 1024 * 5 };
const upload = multer({ storage: storage, limits: limits });

//----------------------------------------------------------------------------
// user funcs

// sign up

app.post('/newUser', (req, res) => {
  const user = req.body.signUser;
  const username = user.username;

  UserModel.findOne({ username }) //check if username used before
    .then((result) => {
      if (result) res.status(403).send('Username is used before');
      else {
        bcrypt.hash(user.pass, 10).then((hash) => {
          const Newuser = new UserModel({ ...user, pass: hash });
          Newuser.save();
          res.send(Newuser);
        });
      }
    })
    .catch((err) => res.status(400).send('something went wrong'));
});

// log in

app.post('/getUser', (req, res) => {
  const user = req.body.logUser;
  const username = user.username;
  const pass = user.pass;

  UserModel.findOne({ username }) //check if username is found
    .then((user) => {
      if (!user) return res.status(403).send('Username not found');
      else {
        bcrypt.compare(pass, user.pass).then((match) => {
          if (!match) res.status(403).send('Password is wrong!');
          else {
            const accessToken = createToken(user);

            res.cookie('access-token', accessToken, {
              maxAge: 60 * 60 * 24 * 1000,
              httpOnly: true,
            });

            user = Object.assign(user, { pass: undefined });

            res.send({ user, token: accessToken });
          }
        });
      }
    })
    .catch((err) => res.status(400).send('something went wrong'));
});

// update user's info

app.put(
  '/updateUser',
  validateToken,
  upload.single('profileImg'),
  async (req, res) => {
    const profileImg = req.file ? req.file.path : req.body.profileImg;
    const _id = req.body._id;
    const username = req.body.username;
    let pass = '';
    const phone = req.body.phone;
    const country = req.body.country;
    const prevUsername = req.body.prevUsername;
    const bookslist = JSON.parse(req.body.booksList) || [];
    let imgresult;

    // get the booklist and change the props of useeeeer
    bookslist.map((book) => {
      book.owner = username;
      book.country = country;
      book.ownerPhone = phone;
      return book;
    });

    if (req.body.pass) {
      pass = req.body.pass;
      bcrypt.hash(pass, 10).then((hash) => {
        pass = hash;
      });
    }

    const updateProfileImg = async (id, profileImg) => {
      return await cloudinary.uploader.upload(profileImg, {
        public_id: `${id}`,
      });
    };

    await UserModel.findOne({ username }) //check if username used before
      .then(async (result) => {
        if (result && username != prevUsername)
          res.status(403).send('Username is used before');
        else {
          try {
            if (req.file) imgresult = await updateProfileImg(_id, profileImg);

            UserModel.findById(_id, (error, userToUpdate) => {
              userToUpdate.username = username;
              userToUpdate.phone = phone;
              userToUpdate.country = country;
              userToUpdate.profileImg = imgresult
                ? imgresult.secure_url
                : profileImg;
              userToUpdate.booksList = bookslist;
              if (pass) userToUpdate.pass = pass;
              userToUpdate.save();

              // update books database

              BookModel.updateMany(
                { ownerId: _id },
                {
                  $set: {
                    country: country,
                    owner: username,
                    ownerPhone: phone,
                  },
                }
              ).then();
            });
          } catch {
            (err) => res.status(400).send('something went wrong');
          }
          res.send({
            profileImg: imgresult ? imgresult.secure_url : profileImg,
            bookslist,
          });
        }
      });
  }
);

app.get('/getOwner/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId;
  const user = await UserModel.findOne(
    { _id: ownerId },
    { profileImg: 1, username: 1, booksList: 1 }
  );
  res.send(user);
});

app.post('/addReport', (req, res) => {
  const sender = req.body.sender;
  const text = req.body.text;
  const target = req.body.target;
  const book = req.body.boook;
  const report = new ReportsModel({ sender, text, target, book });
  report.save();
  res.send('Your Report Submited');
});

//----------------------------------------------------------------------------
// books funcs

// add new book

app.put(
  '/addNewBook',
  validateToken,
  upload.single('coverPhoto'),
  async (req, res) => {
    const coverPhoto = req.file ? req.file.path : '';
    const bookName = req.body.bookName;
    const description = req.body.description;
    const bookGenere = req.body.bookGenere;
    const country = req.body.country;
    const time = req.body.time;
    const location = req.body.location;
    const owner = req.body.owner;
    const ownerId = req.body.ownerId;
    const ownerPhone = req.body.ownerPhone;
    const author = req.body.author;
    const year = req.body.year;
    const isbn = req.body.isbn;
    const booksList = JSON.parse(req.body.booksList) || [];
    let result;

    let newbook = {
      coverPhoto,
      bookName,
      bookGenere,
      description,
      country,
      time,
      location: [location.split(',')[0] + ',' + location.split(',')[1]],
      owner,
      ownerPhone,
      ownerId,
      year,
      isbn,
      author,
    };
    try {
      if (req.file)
        result = await cloudinary.uploader.upload(coverPhoto, {
          public_id: `${ownerId}${bookName}_book`,
        });

      const book = new BookModel({
        coverPhoto: result ? result.secure_url : coverPhoto,
        bookName,
        bookGenere,
        description,
        country,
        time,
        location,
        owner,
        ownerPhone,
        ownerId,
        year,
        isbn,
        author,
      });
      book.save((err, book) => {
        const _id = book._id.toString();
        newbook._id = _id;
        if (result) newbook.coverPhoto = result.secure_url;

        booksList[booksList.length] = newbook;

        UserModel.findById(ownerId, (err, userToUpdate) => {
          userToUpdate.booksList = booksList;
          userToUpdate.save();
        }).then(res.send(newbook));
      });
    } catch {
      (err) => res.status(400).send('something went wrong');
    }
  }
);

// edit book

app.put(
  '/editBook',
  validateToken,
  upload.single('coverPhoto'),
  async (req, res) => {
    const coverPhoto = req.file ? req.file.path : '';
    const _id = req.body._id;
    const bookName = req.body.bookName;
    const description = req.body.description;
    const bookGenere = req.body.bookGenere;
    const time = req.body.time;
    const location = req.body.location;
    const ownerId = req.body.ownerId;
    const prevImg = req.body.prevImg;
    const author = req.body.author;
    const year = req.body.year;
    const isbn = req.body.isbn;
    const newbooksList = JSON.parse(req.body.booksList) || [];
    let result;

    // update the target book
    for (const i in newbooksList) {
      if (newbooksList[i]._id === _id) {
        newbooksList[i].bookName = bookName;
        newbooksList[i].bookGenere = bookGenere;
        newbooksList[i].description = description;
        newbooksList[i].time = time;
        newbooksList[i].location = [
          location.split(',')[0] + ',' + location.split(',')[1],
        ];
        newbooksList[i].year = year;
        newbooksList[i].author = author;
        newbooksList[i].isbn = isbn;
        newbooksList[i].coverPhoto = coverPhoto || prevImg;
      }
    }

    try {
      if (req.file)
        result = await cloudinary.uploader.upload(coverPhoto, {
          public_id: `${ownerId}${bookName}_book`,
        });
      if (result) {
        for (const i in newbooksList) {
          if (newbooksList[i]._id === _id) {
            newbooksList[i].coverPhoto = result ? result.secure_url : prevImg;
          }
        }
      }
      UserModel.findById(ownerId, (err, userToUpdate) => {
        userToUpdate.booksList = newbooksList;
        userToUpdate.save();

        BookModel.findById(_id, (err, bookToUpdate) => {
          bookToUpdate.bookName = bookName;
          bookToUpdate.bookGenere = bookGenere;
          bookToUpdate.description = description;
          bookToUpdate.time = time;
          bookToUpdate.location = location;
          bookToUpdate.year = year;
          bookToUpdate.author = author;
          bookToUpdate.isbn = isbn;
          (bookToUpdate.coverPhoto = result ? result.secure_url : prevImg),
            bookToUpdate.save();
        });
        res.send(newbooksList);
      });
    } catch {
      (err) => res.status(400).send('something went wrong');
    }
  }
);

// delete book

app.put('/deleteBook/', validateToken, async (req, res) => {
  const id = req.body.book._id;
  const user = req.body.user;
  user.booksList = user.booksList.filter((bo) => bo._id !== id);
  try {
    await cloudinary.uploader.destroy(
      user._id + req.body.book.bookName + '_book'
    );
    UserModel.findById(user._id, (err, userToUpdate) => {
      userToUpdate.booksList = user.booksList;
      userToUpdate.save();

      BookModel.findByIdAndRemove(id).exec();
      res.send(user);
    });
  } catch {
    (err) => res.status(400).send('something went wrong');
  }
});

// get random books onload

app.get('/getBooks', validateToken, async (req, res) => {
  const pageSize = 6;
  const page = parseInt(req.query.page || '0');
  const totalPages = await BookModel.countDocuments();
  const books = await BookModel.find()
    .limit(pageSize)
    .skip(pageSize * page);
  res.send({ totalPages: Math.ceil(totalPages / pageSize), books });
});

// get books by filters

app.post('/getSpecificBooks', validateToken, async (req, res) => {
  const bookName = req.body.bookName;
  const bookGenere = req.body.bookGenere;
  const country = req.body.country;

  const query = {
    $and: [
      {
        $or: [
          {
            bookName,
          },
          {
            author: bookName,
          },
          {
            isbn: bookName,
          },
        ],
      },
      {
        bookGenere,
      },
      {
        country,
      },
    ],
  };

  !country && query['$and'].pop();
  !bookGenere && query['$and'].splice(1, 1);
  !bookName && query['$and'].shift();

  Object.keys(query).forEach((key) => console.log(query[key]));
  const books = await BookModel.find(query);
  res.send(books);
});

// add to favorite

app.put('/addToFav', validateToken, async (req, res) => {
  const book = req.body.book;
  const user = req.body.user;
  user.favList.push(book);
  try {
    await UserModel.findById(user._id, (err, userToUpdate) => {
      userToUpdate.favList = user.favList;
      userToUpdate.save();
      res.send(user);
    });
  } catch {
    (err) => res.status(400).send('something went wrong');
  }
});

// remove from favorite

app.put('/removeToFav', validateToken, async (req, res) => {
  const book = req.body.book._id;
  const user = req.body.user;
  user.favList = user.favList.filter((bo) => bo._id !== book);
  try {
    await UserModel.findById(user._id, (err, userToUpdate) => {
      userToUpdate.favList = user.favList;
      userToUpdate.save();
      res.send(user);
    });
  } catch {
    (err) => res.status(400).send('failed');
  }
});

// err image more 5mb
app.use(function (err, req, res, next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.send(res.status(403).send('File Too Big, Maximum size 5mb'));
    return;
  }
});

//----------------------------------------------------------------------------
// chat funcs

//new conv

app.post('/newConv', async (req, res) => {
  const newConversation = new ConversationModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.send(savedConversation);
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

//get conv of a user

app.get('/getConv/:userId', async (req, res) => {
  try {
    const conversation = await ConversationModel.find({
      members: { $in: [req.params.userId] },
    });
    res.send(conversation);
  } catch (err) {
    res.status(400).send('something went wrong');
  }
});

// get conv includes two userId

app.get('/findConv/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await ConversationModel.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.send(conversation);
  } catch (err) {
    res.status(400).send('chat not found');
  }
});

//add msg

app.post('/addMsg', async (req, res) => {
  const newMessage = new MessageModel(req.body.message);
  try {
    const savedMessage = await newMessage.save();
    res.send(savedMessage);
  } catch (err) {
    console.log(err);
  }
});

//get msg

app.get('/getMsg/:conversationId', async (req, res) => {
  try {
    const messages = await MessageModel.find({
      conversationId: req.params.conversationId,
    });
    res.send(messages);
  } catch (err) {
    console.log(err);
  }
});

const handleClick = async (user) => {
  try {
    const res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
    setCurrentChat(res.data);
  } catch (err) {
    console.log(err);
  }
};

//get a user
app.get('/getUser/:id', async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get('/', (req, res) => {
  res.send('at Home');
});

app.listen(3001);
