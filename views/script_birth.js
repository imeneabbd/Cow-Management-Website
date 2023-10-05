// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const birthForm = document.getElementById('Form');
  const birthList = document.getElementById('List');
  const birthIDInput = document.getElementById('birthID'); // Get the birth ID input element
  let birthArray = [];
  const newUrl = '/births';


 /////////////////////////////////////////////////////

  // Function to open the edit modal
function openEditModal(birth) {
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const editID = document.getElementById('editID');
  const editCowID = document.getElementById('editCowID');
  const editBirthDate = document.getElementById('editBirthDate');
  
  editID.value = birth.id; 
  editCowID.value = birth.cowid; 
  editBirthDate.value = birth.date; 

//////////////////////////////////////////////////////
  saveButton.addEventListener('click', () => {
    const editedID = birth.id;
    const editedCowID = document.getElementById('editCowID').value;
    const editedBirthDate = document.getElementById('editBirthDate').value;

    const updatedbirth = {
      id: editedID,
      cowid: editedCowID,
      date: editedBirthDate,
    };
    console.log("updated edit mode ", updatedbirth);
    // Make a PATCH request to update the birth data
    fetch(`/births/${editedID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedbirth),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        //console.log('birth updated:', data);
        alert("birth updated");
        
        closeModal();
      })
      .catch((error) => {
        console.error('Error updating birth data:', error);
      });
  });


  editModal.style.display = 'block'; // Show the modal
}

//////////////////////////////////////////////////////
// Function to close the edit modal
function closeEditModal() {
  const editModal = document.getElementById('editModal');
  editModal.style.display = 'none'; // Hide the modal
}


//////////////////////////////////////////////////////

  // Function to open the edit modal
  function openDeleteModal(birth, deleteButton) {

    const deleteModal = document.getElementById('deleteModal');

    const deleteID = document.getElementById('deleteID');
    const deleteCowID = document.getElementById('deleteCowID');
    const deleteBirthDate = document.getElementById('deleteBirthDate');

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    deleteID.value = birth.id;
    deleteCowID.value = birth.cowid;
    deleteBirthDate.value = birth.date;
    // Display the delete modal
    console.log("deklete ID: ", deleteID.value);
    deleteModal.style.display = 'block';

    confirmDeleteButton.addEventListener('click', () => {
      try {
        // Make an HTTP DELETE request to your server's API endpoint
        fetch(`/births/${birth.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('birth deleted:', data.message);
            alert("birth deleted!");
            closeModal();
        })
        .catch((error) => {
            console.error('Error deleting birth:', error);
        });
      } catch (error) {
        console.error('An error occurred:', error);
      }
      
  });
  
    cancelDeleteButton.addEventListener('click', () => {
        closeModal(); 
    });


  
    editModal.style.display = 'block'; // Show the modal
  }

  /////////////////////////////////////////////////////
    


// Function to retrieve birth information by ID
const getbirthById = (birthId) => {
  fetch(`/births/${birthId}`);
  return fetch(`/births/${birthId}`)
     .then((response) => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
      })
     .then((data) => {
       return data;
     })
    .catch((error) => {
      console.error('Error fetching birth information:', error);
    });
};

////////////////////////////////////////////////////

  const addbirthToList = (birth) => {
  const tableBody = document.getElementById('birthList');
  const row = document.createElement('tr');
  row.id=birth.id;
  console.log("idcell", birth.cowid);

  const idCell = document.createElement('td');
  const cowidCell = document.createElement('td');
  const dateCell = document.createElement('td');
  console.log("cowidcell", birth.cowid);

  idCell.textContent = birth.id;
  cowidCell.textContent = birth.cowid;
  dateCell.textContent = birth.date;
  const editCell = document.createElement('td');
  const deleteCell = document.createElement('td');

  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  editButton.textContent = 'Edit';
  deleteButton.textContent = 'Delete';
  editButton.className = 'edit-button'; 
  editButton.dataset.birthId = birth.id;
  editButton.addEventListener('click', (e) => {
     getbirthById(birth.id)
     .then((editedbirth) => {
       openEditModal(editedbirth);
       console.log("edited birth: ", editedbirth);
    })
     .catch((error) => {
       console.error('Error in getbirthById:', error);
     });
  });
  deleteButton.className = 'delete-button'; 
  deleteButton.dataset.birthId = birth.id;
  

  const buttonsCell = document.createElement('td');
  buttonsCell.className = 'buttons-cell';
  buttonsCell.appendChild(editButton);
  buttonsCell.appendChild(deleteButton);

  deleteButton.addEventListener('click', (e) => {
    getbirthById(birth.id)
    .then((toDeletebirth) => {
      console.log("index to delete: ", toDeletebirth);
      openDeleteModal(toDeletebirth,deleteButton);

   })
    .catch((error) => {
      console.error('Error in getbirthById:', error);
    });
 });

  row.appendChild(idCell);
  row.appendChild(cowidCell);
  row.appendChild(dateCell);
  row.appendChild(buttonsCell);

  tableBody.appendChild(row);
  };





/////////////////////////////////////////////////////
  birthForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const birthID = parseInt(document.getElementById('birthID').value,10);
    const cowBirthID = document.getElementById('cowBirthID').value;
    const birthDate = document.getElementById('birthDate').value;
    const dateParts = birthDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Months are zero-based
    const day = parseInt(dateParts[2]);

    const birthDateInput = new Date(year, month, day);

    // Make a POST request to add a new birth
    fetch('/births', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: birthID,
        cowid: cowBirthID,
        date: birthDateInput.toISOString().split('T')[0],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new birth to the list
        addbirthToList(data.createdbirth);
        birthArray.push(data.createdbirth);
        console.log("birth: ", data.createdbirth);
        //location.reload();
        // Clear the form fields
        birthForm.reset();
        getbirths();

        // Calculate the next available ID
        const nextAvailableID = getNextAvailableID();
        birthIDInput.value = nextAvailableID;
      })
      .catch((error) => {
        console.error('Error adding birth:', error);
      });
  });






///////////////////////////////////////////////
// Function to fetch and display existing births
const getbirths = () => {
  // Make a GET request to retrieve existing births
  fetch('/births/list/data')
    .then((response) => response.json())
    .then((data) => {
      console.log("data retrieved!");
      })
    .catch((error) => {
      console.error('Error fetching births:', error);
    });

};
  // Function to fetch and display existing births
  const fetchbirths = () => {
    // Make a GET request to retrieve existing births
    fetch('/births/list/data')
      .then((response) => response.json())
      .then((data) => {
        birthArray = data;
        data.forEach((birth) => {

          addbirthToList(birth);
        });

      birthIDInput.value = getNextAvailableID();

      })
      .catch((error) => {
        console.error('Error fetching births:', error);
      });

  };



/////////////////////////////////////////

  const getNextAvailableID = () => {
    console.log(birthArray);
    const existingIDs = birthArray.map((birth) => birth.id);
    const maxID = Math.max(...existingIDs);
    if (birthArray.length === 0) {
      return 1;
    } else {
    return maxID + 1;
  };
  };

////////////////////////////////////////

  fetchbirths();
  history.pushState({}, '', newUrl);

const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeEditModal);

});
