// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const cowForm = document.getElementById('Form');
  const cowList = document.getElementById('List');
  const cowIDInput = document.getElementById('cowID'); 
  let cowArray = [];
  const newUrl = '/cows';


 

  // Function to open the edit modal
function openEditModal(cow) {
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const editID = document.getElementById('editID');
  const editCowName = document.getElementById('editCowName');
  const editCowBreed = document.getElementById('editCowBreed');
  const editEntryDate = document.getElementById('editEntryDate');
  
  editID.value = cow.id; 
  editCowName.value = cow.name; 
  editCowBreed.value = cow.breed; 
  editEntryDate.value = cow.dateOfBirth;


  saveButton.addEventListener('click', () => {
    const editedID = document.getElementById('editID').value;
    const editedCowName = document.getElementById('editCowName').value;
    const editedCowBreed = document.getElementById('editCowBreed').value;
    const editedDate = document.getElementById('editEntryDate').value;
  
    // Create an object with the updated cow data
    const updatedCow = {
      id: editedID,
      name: editedCowName,
      breed: editedCowBreed,
      dateOfBirth: editedDate,
    };
  
    // Make a PATCH request to update the cow data
    fetch(`/cows/${editedID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCow),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        //console.log('Cow updated:', data);
        alert("cow updated");
        
        closeModal();
      })
      .catch((error) => {
        console.error('Error updating cow data:', error);
      });
  });


  editModal.style.display = 'block'; // Show the modal
}

// Function to close the edit modal
function closeEditModal() {
  const editModal = document.getElementById('editModal');
  editModal.style.display = 'none'; // Hide the modal
}




  // Function to open the edit modal
  function openDeleteModal(cow, deleteButton) {

    const deleteModal = document.getElementById('deleteModal');

    const deleteCowID = document.getElementById('deleteCowID');
    const deleteCowName = document.getElementById('deleteCowName');
    const deleteCowBreed = document.getElementById('deleteCowBreed');
    const deleteEntryDate = document.getElementById('deleteEntryDate');

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    deleteCowID.value = cow.id;
    deleteCowName.value = cow.name;
    deleteCowBreed.value = cow.breed;
    deleteEntryDate.value = cow.dateOfBirth;
    // Display the delete modal
    
    deleteModal.style.display = 'block';

    confirmDeleteButton.addEventListener('click', () => {
      try {
        // Make an HTTP DELETE request to your server's API endpoint
        fetch(`/cows/${cow.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Cow deleted:', data.message);
            alert("cow deleted!");
            closeModal();
        })
        .catch((error) => {
            console.error('Error deleting cow:', error);
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

  
    


// Function to retrieve cow information by ID
const getCowById = (cowId) => {
  fetch(`/cows/${cowId}`);
  return fetch(`/cows/${cowId}`)
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
      console.error('Error fetching cow information:', error);
    });
};



  const addcowToList = (cow) => {
  const tableBody = document.getElementById('cowList');
  const row = document.createElement('tr');
  row.id=cow.id;

  const idCell = document.createElement('td');
  const nameCell = document.createElement('td');
  const breedCell = document.createElement('td');
  const dobCell = document.createElement('td');

  idCell.textContent = cow.id;
  nameCell.textContent = cow.name;
  breedCell.textContent = cow.breed;
  dobCell.textContent = cow.dateOfBirth;
  const editCell = document.createElement('td');
  const deleteCell = document.createElement('td');

  // Create button elements for edit and delete
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  editButton.textContent = 'Edit';
  deleteButton.textContent = 'Delete';
  editButton.className = 'edit-button'; 
  editButton.dataset.cowId = cow.id;
  editButton.addEventListener('click', (e) => {
     getCowById(cow.id)
     .then((editedCow) => {
       openEditModal(editedCow);
    })
     .catch((error) => {
       console.error('Error in getCowById:', error);
     });
  });
  deleteButton.className = 'delete-button'; 
  deleteButton.dataset.cowId = cow.id;
  

  const buttonsCell = document.createElement('td');
  buttonsCell.className = 'buttons-cell';
  buttonsCell.appendChild(editButton);
  buttonsCell.appendChild(deleteButton);

  deleteButton.addEventListener('click', (e) => {
    getCowById(cow.id)
    .then((toDeleteCow) => {
      openDeleteModal(toDeleteCow,deleteButton);
      // Use history.pushState() to modify the URL
      //history.pushState({}, '', newUrl);
   })
    .catch((error) => {
      console.error('Error in getCowById:', error);
    });
 });

  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(breedCell);
  row.appendChild(dobCell);
  row.appendChild(buttonsCell);

  tableBody.appendChild(row);
  };






  // Event listener for the form submission
  cowForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cowID = parseInt(document.getElementById('cowID').value,10);
    const cowName = document.getElementById('cowName').value;
    const cowBreed = document.getElementById('breed').value;
    const cowDateOfBirthInput = document.getElementById('entryDate').value;
    const dateParts = cowDateOfBirthInput.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; 
    const day = parseInt(dateParts[2]);

    const cowDateOfBirth = new Date(year, month, day);
    // Make a POST request to add a new cow
    fetch('/cows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: cowID,
        name: cowName,
        breed: cowBreed,
        dateOfBirth: cowDateOfBirth.toISOString().split('T')[0],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new cow to the list
        addcowToList(data.createdcow);
        cowArray.push(data.createdcow);
        //location.reload();
        cowForm.reset();
        getcows();

        // Calculate the next available ID
        const nextAvailableID = getNextAvailableID();
        cowIDInput.value = nextAvailableID;
      })
      .catch((error) => {
        console.error('Error adding cow:', error);
      });
  });







// Function to fetch and display existing cows
const getcows = () => {
  // Make a GET request to retrieve existing cows
  fetch('/cows/list/data')
    .then((response) => response.json())
    .then((data) => {
      console.log("added");
      })
    .catch((error) => {
      console.error('Error fetching cows:', error);
    });

};
  // Function to fetch and display existing cows
  const fetchcows = () => {
    // Make a GET request to retrieve existing cows
    fetch('/cows/list/data')
      .then((response) => response.json())
      .then((data) => {
        cowArray = data;
        data.forEach((cow) => {

          addcowToList(cow);
        });

      cowIDInput.value = getNextAvailableID();

      })
      .catch((error) => {
        console.error('Error fetching cows:', error);
      });

  };





  const getNextAvailableID = () => {
    console.log(cowArray);
    const existingIDs = cowArray.map((cow) => cow.id);
    const maxID = Math.max(...existingIDs);
    if (cowArray.length === 0) {
      return 1;
    } else {
    return maxID + 1;
  };
  };



  fetchcows();
  history.pushState({}, '', newUrl);

const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeEditModal);

});
