// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  const milkForm = document.getElementById('Form');
  const milkList = document.getElementById('List');
  const milkIDInput = document.getElementById('milkID'); 
  let milkArray = [];
  const newUrl = '/milk';


 

  // Function to open the edit modal
function openEditModal(milk) {
  const editModal = document.getElementById('editModal');
  const editForm = document.getElementById('editForm');
  const editID = document.getElementById('editID');
  const editQuantity = document.getElementById('editQuantity');
  const editMilkDate = document.getElementById('editMilkDate');
  
  editID.value = milk.id;
  editQuantity.value = milk.quantity;
  editMilkDate.value = milk.date; 


  saveButton.addEventListener('click', () => {
    const editedID = milk.id;
    const editedQuantity = document.getElementById('editQuantity').value;
    const editedMilkDate = document.getElementById('editMilkDate').value;

    // Create an object with the updated milk data
    const updatedmilk = {
      id: editedID,
      quantity: editedQuantity,
      date: editedMilkDate,
    };
    console.log("updated edit mode ", updatedmilk);
    // Make a PATCH request to update the milk data
    fetch(`/milk/${editedID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedmilk),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        //console.log('milk updated:', data);
        alert("milk updated");
        
        closeModal();
      })
      .catch((error) => {
        console.error('Error updating milk data:', error);
      });
  });


  editModal.style.display = 'block'; // Show the modal
}

// Function to close the edit modal
function closeEditModal() {
  const editModal = document.getElementById('editModal');
  editModal.style.display = 'none'; // Hide the modal
}




  // Function to open the delete modal
  function openDeleteModal(milk, deleteButton) {

    const deleteModal = document.getElementById('deleteModal');

    const deleteID = document.getElementById('deleteID');
    const deleteQuantity = document.getElementById('deleteQuantity');
    const deleteMilkDate = document.getElementById('deleteMilkDate');

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    deleteID.value = milk.id;
    deleteQuantity.value = milk.quantity;
    deleteMilkDate.value = milk.date;
    console.log("deklete ID: ", deleteID.value);
    deleteModal.style.display = 'block';

    confirmDeleteButton.addEventListener('click', () => {
      try {
        // Make an HTTP DELETE request to your server's API endpoint
        fetch(`/milk/${milk.id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('milk deleted:', data.message);
            alert("milk deleted!");
            closeModal();
        })
        .catch((error) => {
            console.error('Error deleting milk:', error);
        });
      } catch (error) {
        console.error('An error occurred:', error);
      }
      
  });
  
    cancelDeleteButton.addEventListener('click', () => {
        closeModal(); // Close the delete modal without performing the delete action
    });


  
    editModal.style.display = 'block'; // Show the modal
  }

  
    


// Function to retrieve milk information by ID
const getmilkById = (milkId) => {
  fetch(`/milk/${milkId}`);
  return fetch(`/milk/${milkId}`)
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
      console.error('Error fetching milk information:', error);
    });
};



  const addmilkToList = (milk) => {
  const tableBody = document.getElementById('milkList');
  const row = document.createElement('tr');
  row.id=milk.id;

  const idCell = document.createElement('td');
  const quantityCell = document.createElement('td');
  const dateCell = document.createElement('td');

  idCell.textContent = milk.id;
  quantityCell.textContent = milk.date;
  dateCell.textContent = milk.quantity;
  // Create table cells for edit and delete buttons
  const editCell = document.createElement('td');
  const deleteCell = document.createElement('td');

  // Create button elements for edit and delete
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');

  editButton.textContent = 'Edit';
  deleteButton.textContent = 'Delete';
  editButton.className = 'edit-button'; 
  editButton.dataset.milkId = milk.id;
  editButton.addEventListener('click', (e) => {
     getmilkById(milk.id)
     .then((editedmilk) => {
       openEditModal(editedmilk);
       console.log("edited milk: ", editedmilk);
    })
     .catch((error) => {
       console.error('Error in getmilkById:', error);
     });
  });
  deleteButton.className = 'delete-button';
  deleteButton.dataset.milkId = milk.id;
  

  // Append buttons to cells
  const buttonsCell = document.createElement('td');
  buttonsCell.className = 'buttons-cell';
  buttonsCell.appendChild(editButton);
  buttonsCell.appendChild(deleteButton);

  deleteButton.addEventListener('click', (e) => {
    getmilkById(milk.id)
    .then((toDeletemilk) => {
      console.log("index to delete: ", toDeletemilk);
      openDeleteModal(toDeletemilk,deleteButton);

   })
    .catch((error) => {
      console.error('Error in getmilkById:', error);
    });
 });

  row.appendChild(idCell);
  row.appendChild(quantityCell);
  row.appendChild(dateCell);
  row.appendChild(buttonsCell);

  tableBody.appendChild(row);
  };






  milkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const milkID = parseInt(document.getElementById('milkID').value,10);
    const milkQuantity = parseFloat(document.getElementById('milkQuantity').value, 10);
    const milkDate = document.getElementById('milkDate').value;
    const dateParts = milkDate.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; 
    const day = parseInt(dateParts[2]);

    const milkDateInput = new Date(year, month, day);
    console.log("quantitytyt : ", milkQuantity);

    // Make a POST request to add a new milk
    fetch('/milk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: milkID,
        date: milkDateInput.toISOString().split('T')[0],
        quantity: milkQuantity,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("milk before: ", data.createdmilk);

        // Add the new milk to the list
        addmilkToList(data.createdmilk);
        milkArray.push(data.createdmilk);
        console.log("milk after: ", data.createdmilk);
        //location.reload();
        // Clear the form fields
        milkForm.reset();
        getmilk();

        // Calculate the next available ID
        const nextAvailableID = getNextAvailableID();
        milkIDInput.value = nextAvailableID;
      })
      .catch((error) => {
        console.error('Error adding milk:', error);
      });
  });







// Function to fetch and display existing milk
const getmilk = () => {
  // Make a GET request to retrieve existing milk
  fetch('/milk/list/data')
    .then((response) => response.json())
    .then((data) => {
      console.log("data retrieved!");
      })
    .catch((error) => {
      console.error('Error fetching milk:', error);
    });

};
  // Function to fetch and display existing milk
  const fetchmilk = () => {
    // Make a GET request to retrieve existing milk
    fetch('/milk/list/data')
      .then((response) => response.json())
      .then((data) => {
        milkArray = data;
        data.forEach((milk) => {

          addmilkToList(milk);
        });

      milkIDInput.value = getNextAvailableID();

      })
      .catch((error) => {
        console.error('Error fetching milk:', error);
      });

  };





  const getNextAvailableID = () => {
    // Assuming milkList is an array containing existing milk
    console.log(milkArray);
    const existingIDs = milkArray.map((milk) => milk.id);
    const maxID = Math.max(...existingIDs);
    if (milkArray.length === 0) {
      return 1;
    } else {
    return maxID + 1;
  };
  };



  fetchmilk();
  history.pushState({}, '', newUrl);

const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', closeEditModal);

});
