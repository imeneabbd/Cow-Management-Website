const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); 
let cowData ;

////////////////////////////////////////////////////////

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'cows.html'));
});

////////////////////////////////////////////////////////

router.post('/', (req, res, next) =>{
    const newcow = {
        id : req.body.id,
        name : req.body.name,
        breed : req.body.breed,
        dateOfBirth : req.body.dateOfBirth
        };
    // Read existing cows data
    fs.readFile('cows.json', 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        const cows = JSON.parse(data);
        // Add the new cow to the cows array
        cows.push(newcow);
        //cowData = cows;


        // Convert the updated cows array back to JSON
        const updatedData = JSON.stringify(cows, null, 2);
        cowData = JSON.parse(updatedData);
        //console.log("cowData in post: ", cowData);
        fs.writeFile('cows.json', updatedData, (writeErr) => {
        if (writeErr) {
            return res.status(500).json({ error: 'An error occurred while writing the file.' });
        }
        res.status(201).json({
            message: 'cow added successfully',
            createdcow: newcow,
        });
        });
    });
});

///////////////////////////////////////////////////////////////
router.get('/:cowId',(req, res, next) => {
    const id =  parseInt(req.params.cowId);
    fs.readFile('cows.json', 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        cowData = JSON.parse(data);
    });

    const editedCow = cowData.find((cow) => cow.id === id);

    if (editedCow) {
        console.log("edited Cow:", editedCow);
        res.json(editedCow);
    } else {
        res.status(404).json({
            message: 'Cow not found'
        });
    }
});

///////////////////////////////////////////////////////////////////

router.get('/list/data', (req, res, next) => {
    fs.readFile('cows.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        cowData = JSON.parse(data);
        res.status(200).json(JSON.parse(data));
    });
});

///////////////////////////////////////////////////////////////////////
router.patch('/:cowId', (req, res, next) => {
    const id = parseInt(req.params.cowId);
    const updatedCowData = req.body; 
  
    // Read existing cows data
    fs.readFile('cows.json', 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
      }
      const cows = JSON.parse(data);
  
      // Find the cow with the matching ID in the cows array
      const cowToUpdate = cows.find((cow) => cow.id === id);
  
      if (!cowToUpdate) {
        return res.status(404).json({ message: 'Cow not found' });
      }
  
      Object.assign(cowToUpdate, updatedCowData);
  
      // Convert the updated cows array back to JSON
      const updatedData = JSON.stringify(cows, null, 2);
  
      // Write the updated JSON data back to the file
      fs.writeFile('cows.json', updatedData, (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'An error occurred while writing the file.' });
        }
  
        // Send a response indicating the cow was successfully updated
        res.status(200).json({
          message: 'Cow updated successfully',
          updatedCow: cowToUpdate,
        });
      });
    });
  });
//////////////////////////////////////////////////////////////////////////

  router.delete('/:cowId', (req, res, next) => {
    console.log("-------------------------------------------deletetetetetete");
    const idToDelete = parseInt(req.params.cowId, 10);

    // Read the cow data from the JSON file
    fs.readFile('cows.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        const cows = JSON.parse(data);

        const indexToDelete = cows.findIndex((cow) => cow.id === idToDelete);

        if (indexToDelete === -1) {
            return res.status(404).json({ message: 'Cow not found' });
        }

        cows.splice(indexToDelete, 1);
        console.log('index: ', indexToDelete);

        const updatedData = JSON.stringify(cows, null, 2);
        console.log(updatedData);
        fs.writeFile('cows.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }

            res.status(200).json({ message: 'Cow deleted successfully' });
        });
    });
});

module.exports = router;