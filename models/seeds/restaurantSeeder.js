const db = require("../../config/mongoose");
const Restaurant = require("../restaurants");
const User = require("../users");
const restaurantList = require("../../mock_data/restaurant.json");
const userList = require("../../mock_data/user.json");
const bcrypt = require("bcryptjs");

db.on("error", () => {
  console.log("fail to connect to mongo db!");
});

db.once("open", () => {
  Promise.all(
    userList.seed_users.map((seedUser) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(seedUser.password, salt))
        .then((hash) =>
          User.create({
            name: seedUser.name,
            email: seedUser.email,
            password: hash,
          })
        )
        .then((user) => {
          const userId = user._id;
          return Promise.all(
            restaurantList.results.map((restaurant, index) => {
              if (seedUser.favRestaurant.includes(index)) {
                return Restaurant.create({ ...restaurant, userId });
              }
            })
          );
        });
    })
  )
    .then(() => {
      console.log("done");
      process.exit();
    })
    .catch((err) => console.log(err));
});
