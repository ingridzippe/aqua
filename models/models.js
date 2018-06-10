const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// const sequelize = new Sequelize('database', null, null, {
//   host: 'localhost',
//   dialect: 'postgres',
//
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
// });

console.log('getss shere')
sequelize
  .authenticate()
  .then(() => {
    console.log('sequelize: Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// sequelize.query(`create table users (
//     id int primary key not null,
//     email varchar,
//     password varchar,
//     displayName varchar,
//     imgUrl varchar,
//     bio varchar,
//     fbId varchar);`)
// .then(function(result) {
//   console.log('RESULT', result);
// })
// .catch(function(err) {
//   console.log('whoops this thing errored', err)
// });

// sequelize.query(`create table contents (
//     id int primary key not null,
//     displayName varchar,
//     date date,
//     location varchar,
//     description varchar,
//     domain varchar,
//     url varchar,
//     image varchar);`)
// .then(function(result) {
//   console.log('RESULT', result);
// })
// .catch(function(err) {
//   console.log('whoops this thing errored', err)
// });

// sequelize.query(`create table follows (
//     id int primary key not null);`)
// .then(function(result) {
//   console.log('RESULT', result);
// })
// .catch(function(err) {
//   console.log('whoops this thing errored', err)
// });

var User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  imgUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bio: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fbId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

var Content = sequelize.define('content', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  domain: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

var Follow = sequelize.define('follow', {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
});

// var Tweet = sequelize.define('tweet', {
//   id: {
//     type: Sequelize.INTEGER,
//     unique: true,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   displayName: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   content: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
// });

// var Event = sequelize.define('event', {
//   id: {
//     type: Sequelize.INTEGER,
//     unique: true,
//     autoIncrement: true,
//     primaryKey: true
//   },
//   displayName: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   eventDate: {
//     type: Sequelize.DATE,
//     allowNull: true,
//   },
//   eventLocation: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   eventDescription: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
// });

var Content = sequelize.define('content', {
    id: {
     type: Sequelize.INTEGER,
     unique: true,
     autoIncrement: true,
     primaryKey: true
    },
    // userid: {
    //  type: Sequelize.STRING,
    //  allowNull: true
    // },
    eventname: {
      type: Sequelize.STRING,
      allowNull: true
    },
    eventdate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    eventlocation: {
      type: Sequelize.STRING,
      allowNull: true
    },
    eventimage: {
      type: Sequelize.STRING,
      allowNull: true
    },
    eventdescription: {
      type: Sequelize.STRING,
      allowNull: true
    },
    eventlongitude: {
      type: Sequelize.STRING,
      allowNull: true
    },
    eventlatitude: {
      type: Sequelize.STRING,
      allowNull: true
    },
    createdAt: {
     type: Sequelize.DATE,
     allowNull: true
    },
});


User.hasMany(Content, {foreignKey: 'userid'})
Content.belongsTo(User, {foreignKey: 'userid'})

User.hasMany(Follow, {foreignKey: 'follower'})
Follow.belongsTo(User, {foreignKey: 'follower'})
User.hasMany(Follow, {foreignKey: 'following'})
Follow.belongsTo(User, {foreignKey: 'following'})

// User.hasMany(Tweet, {foreignKey: 'userid'})
// Tweet.belongsTo(User, {foreignKey: 'userid'})

// User.hasMany(Event, {foreignKey: 'userid'})
// Event.belongsTo(User, {foreignKey: 'userid'})

// User.hasMany(Reaction, {foreignKey: 'userid'})
// Reaction.belongsTo(User, {foreignKey: 'userid'})
// Event.hasMany(Reaction, {foreignKey: 'eventid'})
// Reaction.belongsTo(Event, {foreignKey: 'eventid'})

module.exports = {
  // Export models here
  User: User,
  Content: Content,
  Follow: Follow
};
