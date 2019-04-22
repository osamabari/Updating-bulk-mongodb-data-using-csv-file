// Import express
const express = require('express');
const app = express();
// Import csvtojson module
const csv = require('csvtojson');
// Import Mongodb
const mongoClient = require('mongodb').MongoClient,
  assert = require('assert'),
  ObjectId = require('mongodb').ObjectId;

// Server up and running on port 7600
const server = app.listen(7600, (err, callback) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Your nodejs server running on port 7600');
  }
});

// Mongodb Connection URL 
const url = 'mongodb://localhost:27017/csvfilereader';

// Use connect method to connect to the Server
mongoClient.connect(url, (err, db) => {
  assert.equal(null, err);

  console.log("Connected correctly to server");

  updateDocuments(db, function () {
    db.close();
  });
});


const updateDocuments = (db, callback) => {
  // Get the documents collection
  let collection = db.collection('documents');
  // Get the bulk update instance for documents collection
  const bulk = collection.initializeUnorderedBulkOp();


  // CSV File Path
  const csvFilePath = 'file.csv';

  /**
   * Read csv file and save every row of
   * data on mongodb database
   */
  try {
    csv()
      .fromFile(csvFilePath)
      .on('csv', (csvRow) => {
        console.log(csvRow[0],csvRow[1])
        //updating bulk data
        bulk.find({ _id: ObjectId(csvRow[0]) }).update({ $set: { title: csvRow[1] } });
      })
      .on('done', (error) => {
        //now excuting bulk update command to update all data
        bulk.execute();
        console.log('end')
      });
  } catch (err) {
    console.log(collection.find())
    console.error(err)
  }
}


