const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); 
let birthData ;


////////////////////////////////////////////////////
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'births.html'));
});

////////////////////////////////////////////////////

router.post('/', (req, res, next) =>{
    const newbirth = {
        id :  parseInt(req.body.id,10),
        cowid :  parseInt(req.body.cowid,10),
        date : req.body.date
        };


    fs.readFile('births.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        const births = JSON.parse(data, (key, value) => {
            if (key === 'cowid') {
                return parseInt(value, 10); // Convert to int
            }
            return value; 
        });
        births.push(newbirth);
        console.log("new birth: ", newbirth);

        const updatedData = JSON.stringify(births, null, 2);
        
        fs.writeFile('births.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }
            res.status(201).json({
                message: 'birth added successfully',
                createdbirth: newbirth,
            });
        });
    });

});

////////////////////////////////////////////////////

router.get('/:birthId',(req, res, next) => {
    const id =  parseInt(req.params.birthId);
    fs.readFile('births.json', 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        birthData = JSON.parse(data);
    });

    // Find the birth with the matching ID in the birthData array
    const editedbirth = birthData.find((birth) => birth.id === id);

    if (editedbirth) {
        console.log("edited birth:", editedbirth);
        res.json(editedbirth);
    } else {
        res.status(404).json({
            message: 'birth not found'
        });
    }
});

////////////////////////////////////////////////////

router.get('/list/data', (req, res, next) => {
    fs.readFile('births.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        birthData = JSON.parse(data);
        res.status(200).json(JSON.parse(data));
    });
});


router.patch('/:birthId', (req, res, next) => {
    const id = parseInt(req.params.birthId);
    const updatedbirthData = req.body; 
    console.log("updatedbirthData: ",updatedbirthData);
    // Read existing births data
    fs.readFile('births.json', 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
      }
      const births = JSON.parse(data);
  
      const birthToUpdate = births.find((birth) => birth.id === id);
  
      if (!birthToUpdate) {
        return res.status(404).json({ message: 'birth not found' });
      }
  
      Object.assign(birthToUpdate, updatedbirthData);
  
      const updatedData = JSON.stringify(births, null, 2);
  
      fs.writeFile('births.json', updatedData, (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'An error occurred while writing the file.' });
        }
  
        res.status(200).json({
          message: 'birth updated successfully',
          updatedbirth: birthToUpdate,
        });
      });
    });
  });
////////////////////////////////////////////////////

  router.delete('/:birthId', (req, res, next) => {
    console.log("-------------------------------------------deletetetetetete");
    const idToDelete = parseInt(req.params.birthId, 10);

    fs.readFile('births.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        const births = JSON.parse(data);

        const indexToDelete = births.findIndex((birth) => birth.id === idToDelete);

        if (indexToDelete === -1) {
            return res.status(404).json({ message: 'birth not found' });
        }

        births.splice(indexToDelete, 1);
        console.log('index: ', indexToDelete);

        const updatedData = JSON.stringify(births, null, 2);
        console.log(updatedData);
        fs.writeFile('births.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }

            // Send a response indicating the birth was successfully deleted
            res.status(200).json({ message: 'birth deleted successfully' });
        });
    });
});


module.exports = router;