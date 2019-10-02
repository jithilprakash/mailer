const fs = require("fs");
const express = require("express");

const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
const requestIp = require("request-ip");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ type: "*/*" }));

app.use(requestIp.mw());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  port: 25,
  auth: {
    user: process.env.email_username,
    pass: process.env.email_password
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post("/sendMail", async (req, res) => {
  try {
    const body = req.body;
    const options = {
      from: `${body.name}`,
      to: "jithilprakashpj@gmail.com",
      subject: "Query Form",
      text: `${body.message}\nEmail id : ${body.email}`
    };
    await transporter.sendMail(options, (err, info) => {
      if (err) {
        return res.status(500).send("Error when sending mail");
      }
      return res.status(200).send("Mail Sent Successfully");
    });
  } catch (error) {
    console.log("Error", err);
    return res.status(500).send("Error when sending mail");
  }
});

app.listen(4001, () => {
  console.log("App Running on port 4001");
});
