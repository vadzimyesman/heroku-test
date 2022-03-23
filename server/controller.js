require('dotenv').config()
const {DATABASE_URL} = process.env
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
require("dotenv").config()

const Sequelize = require("sequelize")

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
  })

  module.exports = {

      seedDataBase: (req,res)=>{
          sequelize.query(`
          drop table if exists passwords;
          drop table if exists nicknames;

          create table nicknames (
            nickname_id serial primary key, 
            nickname varchar(30)
          );

          create table passwords (
            password_id serial primary key, 
            password varchar(30),
            nickname_id INTEGER NOT NULL REFERENCES nicknames(nickname_id)
          );
          `)
          .then(() => {
          console.log('DB seeded!')
          res.sendStatus(200)
          })
          .catch(err => console.log('error seeding DB', err))
      },

      loginPart: (req,res)=>{
         let {nickname, password} = req.body
         console.log(nickname, password)
         sequelize.query(`
         SELECT * FROM nicknames
         JOIN passwords on nicknames.nickname_id=passwords.nickname_id
         WHERE nickname='${nickname}' AND password='${password}'
         `)
         .then(dbRes=>{
            //let response=true
            if (dbRes[0].length!==0){
                console.log(dbRes[0].length+"?????????????????")
                res.status(200).send(true)
            } else {
                console.log(dbRes[0].length+"&&&&&&&&&&&&&&&")
                res.status(200).send(false)
            }
            
         })
         .catch(err=>console.log(err))
      },

      registerPart: (req,res)=>{
          let {nickname, password} =req.body
          console.log(nickname, password)
          sequelize.query(`
          SELECT * FROM nicknames
          WHERE nickname='${nickname}'
          `)
          .then(dbRes=>{
              console.log(dbRes[0]+"OOOOOOOOOOOOOOOOOOOOOOOOOOOO")
              if (dbRes[0].length!==0){
                res.status(200).send(false)
              } else {
                  sequelize.query(`
                  INSERT INTO nicknames (nickname)
                  VALUES ('${nickname}')
                  `)
                  sequelize.query(`
                  SELECT nickname_id FROM nicknames
                  WHERE nickname='${nickname}'
                  `)
                  .then((dbRes)=>{
                    sequelize.query(`
                    INSERT INTO passwords (password, nickname_id)
                    VALUES ('${password}',${dbRes[0][0].nickname_id})
                    `)
                  })
                  .catch(err=>console.log(err))

                res.status(200).send(true)
              }
          })
      },


      postMessage: (req,res) =>{
        let {message}=req.body
        console.log(message)
        sequelize.query(`
  
        INSERT INTO messages (message)
        VALUES ('${message}');
        SELECT * FROM messages
        `)
        .then(dbRes=>{
          console.log(dbRes[0])
          res.status(200).send(dbRes[0])
        })
        .catch(err=>console.log(err))
      }


  }
