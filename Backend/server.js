// Accessing Express
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// To handle cross platform we gona use cors
const cors = require("cors");
// For environmental variable we are going to use dotenv package
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const JWTSECRET = process.env.JWTSECRET || "restaurantmanagement";
const db = mysql.createPool({
  host: process.env.HOSTNAME || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "1234",
  database: process.env.DATABASE || "food_db",
});

app.get("/", (req, res) => {
  return res.json("From backend");
});

app.get("/restaurants", async (req, res) => {
  try {
    const [restaurants] = await db.query("SELECT * FROM Restaurants");
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields" });
  }
  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (results[0].Email !== email) {
      return res.status(401).json({ error: "Email Doesn't Exist" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const payload = {
      userId: user.id,
      email: user.email,
    };
    const options = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, JWTSECRET, options);
    res.json({
      token,
      firstName: user.FirstName,
      lastName: user.LastName,
      email: user.Email,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields" });
  }
  try {
    const existingUser = (
      await db.query("SELECT * FROM users WHERE email = ?", [email])
    ).filter((item) => !item);
    if (existingUser.length > 1) {
      return res.status(409).json({ error: "Email address already in use" });
    }
    const hashedPassword = await hashPassword(password);

    const [results] = await db.query(
      "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword]
    );

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

app.get("/restaurant_info", async (req, res) => {
  try {
    const [info] = await db.query("SELECT * FROM restaurant_info");
    res.json(info);
  } catch (error) {
    console.error("Error in fetching restuarant detail", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/dishes", (req, res) => {
  db.query("SELECT * FROM Dishes", (error, results, fields) => {
    if (error) {
      console.error("Error fetching dishes data:", error);
      res.status(500).json({ error: "Internal server error!" });
      return;
    }
    const a = results.map((data) => console.log(data));
    // Map the results to the specified JSON format
    const mappedData = results.map((item) => ({
      card: {
        card: {
          "@type":
            "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory",
          title: item.categoryName,
          restaurantId: item.restaurantId,
          itemCards: [
            {
              "@type": "type.googleapis.com/swiggy.presentation.food.v2.Dish",
              analytics: {},
              hideRestaurantDetails: true,
              info: {
                badgesV2: {},
              },
              category: item.categoryName,
              defaultPrice: item.defaultPrice,
              description: item.description,
              id: item.id,
              imageId: item.imageId,
              isVeg: item.isVeg,
              itemAttribute: item.itemAttribute,
              itemBadge: {},
              itemPriceStrikeOff: true,
              name: item.name,
              ratings: {
                aggregatedRating: {},
              },
              ribbon: {},
              showImage: true,
              variants: {},
              variantsV2: {
                variantGroups: [],
                pricingModels: [],
              },
            },
          ],
        },
      },
    }));
    res.json(mappedData);
  });
});

app.listen(8081, () => {
  console.log("listening...");
});
