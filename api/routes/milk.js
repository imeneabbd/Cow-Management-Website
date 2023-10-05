const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); 
let milkData ;



router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'milk.html'));
});

////////////////////////////////////////////////////

router.post('/', (req, res, next) =>{
    const newmilk = {
        id :  parseInt(req.body.id,10),
        date : req.body.date,
        quantity :  parseFloat(req.body.quantity,10)

        };


    fs.readFile('milk_production.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        const milk = JSON.parse(data, (key, value) => {
            if (key === 'quantity') {
                return parseFloat(value, 10); // Convert to int
            }
            return value; 
        });
        milk.push(newmilk);
        console.log("new milk update: ", newmilk);

        const updatedData = JSON.stringify(milk, null, 2);
        
        fs.writeFile('milk_production.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }
            res.status(201).json({
                message: 'milk added successfully',
                createdmilk: newmilk,
            });
        });
    });

});

////////////////////////////////////////////////////

router.get('/:milkId',(req, res, next) => {
    const id =  parseInt(req.params.milkId);
    fs.readFile('milk_production.json', 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        milkData = JSON.parse(data);
    });

    const editedmilk = milkData.find((milk) => milk.id === id);

    if (editedmilk) {
        console.log("edited milk:", editedmilk);
        res.json(editedmilk);
    } else {
        res.status(404).json({
            message: 'milk not found'
        });
    }
});

////////////////////////////////////////////////////

router.get('/list/data', (req, res, next) => {
    fs.readFile('milk_production.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        // Send the JSON data as a JSON response
        milkData = JSON.parse(data);
        res.status(200).json(JSON.parse(data));
    });
});

////////////////////////////////////////////////////
router.patch('/:milkId', (req, res, next) => {
    const id = parseInt(req.params.milkId);
    const updatedmilkData = req.body; 
    console.log("updatedmilkData: ",updatedmilkData);
    // Read existing milk data
    fs.readFile('milk_production.json', 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
      }
      const milk = JSON.parse(data);
  
      const milkToUpdate = milk.find((milk) => milk.id === id);
  
      if (!milkToUpdate) {
        return res.status(404).json({ message: 'milk not found' });
      }
  
      // Update the milk data with the provided changes
      Object.assign(milkToUpdate, updatedmilkData);
  
      // Convert the updated milk array back to JSON
      const updatedData = JSON.stringify(milk, null, 2);
  
      // Write the updated JSON data back to the file
      fs.writeFile('milk_production.json', updatedData, (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'An error occurred while writing the file.' });
        }
  
        res.status(200).json({
          message: 'milk updated successfully',
          updatedmilk: milkToUpdate,
        });
      });
    });
  });

////////////////////////////////////////////////////
  router.delete('/:milkId', (req, res, next) => {
    console.log("-------------------------------------------deletetetetetete");
    const idToDelete = parseInt(req.params.milkId, 10);

    // Read the milk data from the JSON file
    fs.readFile('milk_production.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        const milk = JSON.parse(data);

        // Find the index of the milk with the specified ID
        const indexToDelete = milk.findIndex((milk) => milk.id === idToDelete);

        if (indexToDelete === -1) {
            return res.status(404).json({ message: 'milk not found' });
        }

        milk.splice(indexToDelete, 1);
        console.log('index: ', indexToDelete);

        const updatedData = JSON.stringify(milk, null, 2);
        console.log(updatedData);
        fs.writeFile('milk_production.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }

            res.status(200).json({ message: 'milk deleted successfully' });
        });
    });
});
module.exports = router;