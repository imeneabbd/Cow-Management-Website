const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path'); 
let consultationData ;



router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'consultations.html'));
});

////////////////////////////////////////////////////

router.post('/', (req, res, next) =>{
    const newconsultation = {
        id :  parseInt(req.body.id,10),
        cowid :  parseInt(req.body.cowid,10),
        date : req.body.date,
        diagnostic : req.body.diagnostic
        };


    fs.readFile('consultations.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        const consultations = JSON.parse(data, (key, value) => {
            if (key === 'cowid') {
                return parseInt(value, 10); // Convert to int
            }
            return value; 
        });
        consultations.push(newconsultation);
        console.log("new consul: ", newconsultation);

        const updatedData = JSON.stringify(consultations, null, 2);
        
        fs.writeFile('consultations.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }
            res.status(201).json({
                message: 'consultation added successfully',
                createdconsultation: newconsultation,
            });
        });
    });

});


////////////////////////////////////////////////////
router.get('/:consultationId',(req, res, next) => {
    const id =  parseInt(req.params.consultationId);
    fs.readFile('consultations.json', 'utf8', (err, data) => {
        if (err) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }
        consultationData = JSON.parse(data);
    });

    const editedconsultation = consultationData.find((consultation) => consultation.id === id);

    if (editedconsultation) {
        console.log("edited consultation:", editedconsultation);
        res.json(editedconsultation);
    } else {
        res.status(404).json({
            message: 'consultation not found'
        });
    }
});

////////////////////////////////////////////////////

router.get('/list/data', (req, res, next) => {
    fs.readFile('consultations.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        consultationData = JSON.parse(data);
        res.status(200).json(JSON.parse(data));
    });
});


router.patch('/:consultationId', (req, res, next) => {
    const id = parseInt(req.params.consultationId);
    const updatedconsultationData = req.body; 
    console.log("updatedconsultationData: ",updatedconsultationData);
    fs.readFile('consultations.json', 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ error: 'An error occurred while reading the file.' });
      }
      const consultations = JSON.parse(data);
  
      const consultationToUpdate = consultations.find((consultation) => consultation.id === id);
  
      if (!consultationToUpdate) {
        return res.status(404).json({ message: 'consultation not found' });
      }
  
      Object.assign(consultationToUpdate, updatedconsultationData);
  
      const updatedData = JSON.stringify(consultations, null, 2);
  
      fs.writeFile('consultations.json', updatedData, (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'An error occurred while writing the file.' });
        }
          res.status(200).json({
          message: 'consultation updated successfully',
          updatedconsultation: consultationToUpdate,
        });
      });
    });
  });
////////////////////////////////////////////////////

  router.delete('/:consultationId', (req, res, next) => {
    console.log("-------------------------------------------deletetetetetete");
    const idToDelete = parseInt(req.params.consultationId, 10);

    fs.readFile('consultations.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'An error occurred while reading the file.' });
        }

        const consultations = JSON.parse(data);

        const indexToDelete = consultations.findIndex((consultation) => consultation.id === idToDelete);

        if (indexToDelete === -1) {
            return res.status(404).json({ message: 'consultation not found' });
        }

        consultations.splice(indexToDelete, 1);
        console.log('index: ', indexToDelete);

        const updatedData = JSON.stringify(consultations, null, 2);
        console.log(updatedData);
        fs.writeFile('consultations.json', updatedData, (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'An error occurred while writing the file.' });
            }

            res.status(200).json({ message: 'consultation deleted successfully' });
        });
    });
});

module.exports = router;