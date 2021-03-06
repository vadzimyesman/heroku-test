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
        let {message,nickname}=req.body
        console.log(message)
        sequelize.query(`
        INSERT INTO messages (message, nickname)
        VALUES ('${message}', '${nickname}');
        SELECT * FROM messages
        `)
        .then(dbRes=>{

          console.log(dbRes[0])
          res.status(200).send(dbRes[0])
        })
        .catch(err=>console.log(err))
      },


      showAllPosts: (req,res) =>{
        sequelize.query(`
        SELECT * FROM messages
        `)
        .then(dbRes=>{
          console.log(dbRes[0])
          res.status(200).send(dbRes[0])
        })
        .catch(err=>console.log(err))
      },

      startNewGame: (req,res) =>{
        let {nickname}=req.body
        console.log(nickname)
        sequelize.query(`
        INSERT INTO admin (nickname)
        VALUES ('${nickname}')
        `)
      },



      adminCheck: (req,res) =>{
        sequelize.query(`
        SELECT * FROM admin
        `)
        .then(dbRes=>{
          let data={
            adminExists:false,
            adminNickname:"no admin yet"
          }
          if(dbRes[0].length===1){
            console.log(`Admin is ${dbRes[0][0].nickname}`)
            data.adminExists=true
            data.adminNickname=dbRes[0][0].nickname
            res.status(200).send(data)
          } else {
            console.log(`Admin is no admin yet!`)
            res.status(200).send(data)
          }
        })
      },


      killGame: (req,res) =>{
        sequelize.query(`
        DROP TABLE admin;
        CREATE TABLE admin (
          admin_id serial primary key,
          nickname varchar(30)
        );
        DROP TABLE messages;
        CREATE TABLE messages (
          message_id serial primary key, 
          message varchar(30),
          nickname varchar(30)
        ); 
        DROP TABLE players;
        CREATE TABLE players(
          player_id SERIAL PRIMARY KEY,
          nickname varchar(30),
          red boolean,
          spy boolean
          )
        `)
        res.status(200).send("Game killed")
      },

      redSpy: (req,res) =>{
        let {nickname}=req.body
        sequelize.query(`
        INSERT INTO players (nickname,red,spy)
        VALUES ('${nickname}', 'true','true');
        SELECT * FROM players
        `)
        .then((dbRes)=>{
          console.log(dbRes[0])
          resObject={
            redSpy : "",
            redAgents : [],
            blueSpy : "",
            blueAgents : []
          }

          dbRes[0].map((element)=>{
            if (element.red){
              if (element.spy){
                resObject.redSpy=element.nickname
              } else {
                resObject.redAgents.push(element.nickname+" ")
              }
            } else {
              if (element.spy){
                resObject.blueSpy=element.nickname
              } else {
                resObject.blueAgents.push(element.nickname+" ")
              }
            }

        })
          res.status(200).send(resObject)
        })
        
      },

      
      
      blueSpy: (req,res) =>{
        let {nickname}=req.body
        sequelize.query(`
        INSERT INTO players (nickname,red,spy)
        VALUES ('${nickname}', 'false','true');
        SELECT * FROM players
        `)
        .then((dbRes)=>{
          console.log(dbRes[0])
          resObject={
            redSpy : "",
            redAgents : [],
            blueSpy : "",
            blueAgents : []
          }

          dbRes[0].map((element)=>{
            if (element.red){
              if (element.spy){
                resObject.redSpy=element.nickname
              } else {
                resObject.redAgents.push(element.nickname+" ")
              }
            } else {
              if (element.spy){
                resObject.blueSpy=element.nickname
              } else {
                resObject.blueAgents.push(element.nickname+" ")
              }
            }

        })
          res.status(200).send(resObject)
        })
        
      },

      
      
      redAgent: (req,res)=>{
        let {nickname}=req.body
        sequelize.query(`
        INSERT INTO players (nickname,red,spy)
        VALUES ('${nickname}', 'true','false');
        SELECT * FROM players
        `)
        .then((dbRes)=>{
          console.log(dbRes[0])
          resObject={
            redSpy : "",
            redAgents : [],
            blueSpy : "",
            blueAgents : []
          }

          dbRes[0].map((element)=>{
            if (element.red){
              if (element.spy){
                resObject.redSpy=element.nickname
              } else {
                resObject.redAgents.push(element.nickname+" ")
              }
            } else {
              if (element.spy){
                resObject.blueSpy=element.nickname
              } else {
                resObject.blueAgents.push(element.nickname+" ")
              }
            }

        })
          res.status(200).send(resObject)
        })
        
      },

      
      
      blueAgent: (req,res)=>{
        let {nickname}=req.body
        sequelize.query(`
        INSERT INTO players (nickname,red,spy)
        VALUES ('${nickname}', 'false','false');
        SELECT * FROM players
        `)
        .then((dbRes)=>{
          console.log(dbRes[0])
          resObject={
            redSpy : "",
            redAgents : [],
            blueSpy : "",
            blueAgents : []
          }

          dbRes[0].map((element)=>{
            if (element.red){
              if (element.spy){
                resObject.redSpy=element.nickname
              } else {
                resObject.redAgents.push(element.nickname+" ")
              }
            } else {
              if (element.spy){
                resObject.blueSpy=element.nickname
              } else {
                resObject.blueAgents.push(element.nickname+" ")
              }
            }

        })
          res.status(200).send(resObject)
        })
        
      }, 
      
      
      
      showTeams: (req,res)=>{
        sequelize.query(`
        SELECT * from players
        WHERE player_id=1
        `)
        .then(dbRes=>{
          if (dbRes[0].length!==0){
            sequelize.query(`
            SELECT * FROM players
            `)
            .then((dbRes)=>{
              console.log(dbRes[0])
              resObject={
                redSpy : "",
                redAgents : [],
                blueSpy : "",
                blueAgents : [],
                allPlayers : []
              }
    
              dbRes[0].map((element)=>{
                if (element.red){
                  if (element.spy){
                    resObject.redSpy=element.nickname
                  } else {
                    resObject.redAgents.push(element.nickname+" ")
                  }
                } else {
                  if (element.spy){
                    resObject.blueSpy=element.nickname
                  } else {
                    resObject.blueAgents.push(element.nickname+" ")
                  }
                }
                resObject.allPlayers.push(element.nickname)
            })
              res.status(200).send(resObject)
            })
          }  else{
                resObject={
                  redSpy : "",
                  redAgents : [],
                  blueSpy : "",
                  blueAgents : [],
                  allPlayers : []
                }
                res.status(200).send(resObject)
          }
        })
        
      }

  }
