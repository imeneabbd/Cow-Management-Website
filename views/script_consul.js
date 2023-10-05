// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const consultationForm = document.getElementById('Form');
    const consultationList = document.getElementById('List');
    const consultationIDInput = document.getElementById('consulID');
    let consultationArray = [];
    const newUrl = '/consultations';
  
  
   
  
  function openEditModal(consultation) {
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editID = document.getElementById('editID');
    const editCowID = document.getElementById('editCowID');
    const editConsultationDate = document.getElementById('editConsultationDate');
    const editDiagnostic = document.getElementById('editDiagnostic');
    
    editID.value = consultation.id;
    editCowID.value = consultation.cowid; 
    editConsultationDate.value = consultation.date;
    editDiagnostic.value = consultation.diagnostic; 
  
  
    saveButton.addEventListener('click', () => {
      const editedID = consultation.id;
      const editedCowID = consultation.cowid;
      const editedConsultationDate = document.getElementById('editConsultationDate').value;
      const editedDiagnostic = document.getElementById('editDiagnostic').value;

      // Create an object with the updated consultation data
      const updatedconsultation = {
        id: editedID,
        cowid: editedCowID,
        date: editedConsultationDate,
        diagnostic: editedDiagnostic,
      };
      //console.log("updated edit mode ", updatedconsultation);
      // Make a PATCH request to update the consultation data
      fetch(`/consultations/${editedID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedconsultation),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          //console.log('consultation updated:', data);
          alert("consultation updated");          
          closeModal();
        })
        .catch((error) => {
          console.error('Error updating consultation data:', error);
        });
    });
  
  
    editModal.style.display = 'block'; 
  }
  
  // Function to close the edit modal
  function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'none'; 
  }
  
  
  
  
  
    // Function to open the edit modal
    function openDeleteModal(consultation, deleteButton) {
  
      const deleteModal = document.getElementById('deleteModal');
  
      const deleteID = document.getElementById('deleteID');
      const deleteCowID = document.getElementById('deleteCowID');
      const deleteConsultationDate = document.getElementById('deleteConsultationDate');
      const deleteDiagnostic= document.getElementById('deleteDiagnostic');
  
      const confirmDeleteButton = document.getElementById('confirmDeleteButton');
      const cancelDeleteButton = document.getElementById('cancelDeleteButton');
  
      // Populate the modal with consultation information
      deleteID.value = consultation.id;
      deleteCowID.value = consultation.cowid;
      deleteConsultationDate.value = consultation.date;
      deleteDiagnostic.value = consultation.diagnostic;
      // Display the delete modal
      //console.log("delete ID: ", deleteID.value);
      deleteModal.style.display = 'block';
  
      confirmDeleteButton.addEventListener('click', () => {
        // Retrieve the ID of the consultation you want to delete from the deleteButton's dataset
        try {
          // Make an HTTP DELETE request to your server's API endpoint
          fetch(`/consultations/${consultation.id}`, {
              method: 'DELETE',
          })
          .then((response) => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then((data) => {
              // Handle the response data if needed (e.g., show a success message)
              console.log('consultation deleted:', data.message);
              alert("consultation deleted!");
              closeModal();
          })
          .catch((error) => {
              console.error('Error deleting consultation:', error);
          });
        } catch (error) {
          console.error('An error occurred:', error);
        }
        
    });
    
      // event listener to the cancel delete button
      cancelDeleteButton.addEventListener('click', () => {
          closeModal(); 
      });
  
  
    
      editModal.style.display = 'block';
    }
  
    function closeDeleteModal() {
      const deleteModal = document.getElementById('deleteModal');
      deleteModal.style.display = 'none'; 
    }
      
  
  
  // Function to retrieve consultation information by ID
  const getconsultationById = (consultationId) => {
    fetch(`/consultations/${consultationId}`);
    return fetch(`/consultations/${consultationId}`)
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
        console.error('Error fetching consultation information:', error);
      });
  };
  
  
  
    const addconsultationToList = (consultation) => {
    const tableBody = document.getElementById('consultationList');
    const row = document.createElement('tr');
    row.id=consultation.id;
  
    const idCell = document.createElement('td');
    const cowidCell = document.createElement('td');
    const dateCell = document.createElement('td');
    const diagCell = document.createElement('td');
  
    idCell.textContent = consultation.id;
    cowidCell.textContent = consultation.cowid;
    dateCell.textContent = consultation.date;
    diagCell.textContent = consultation.diagnostic;
    // Create table cells for edit and delete buttons
    const editCell = document.createElement('td');
    const deleteCell = document.createElement('td');
  
    // Create button elements for edit and delete
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
  
    editButton.textContent = 'Edit';
    deleteButton.textContent = 'Delete';
    editButton.className = 'edit-button'; 
    editButton.dataset.consultationId = consultation.id;


    editButton.addEventListener('click', (e) => {
       getconsultationById(consultation.id)
       .then((editedconsultation) => {
         openEditModal(editedconsultation);
         console.log("edited consul: ", editedconsultation);
      })
       .catch((error) => {
         console.error('Error in getconsultationById:', error);
       });
    });
    deleteButton.className = 'delete-button'; 
    deleteButton.dataset.consultationId = consultation.id;
    
    
  
    // append buttons to cells
    const buttonsCell = document.createElement('td');
    buttonsCell.className = 'buttons-cell';
    buttonsCell.appendChild(editButton);
    buttonsCell.appendChild(deleteButton);
  
    deleteButton.addEventListener('click', (e) => {
      getconsultationById(consultation.id)
      .then((toDeleteconsultation) => {
        console.log("index to delete: ", toDeleteconsultation);
        openDeleteModal(toDeleteconsultation,deleteButton);

     })
      .catch((error) => {
        console.error('Error in getconsultationById:', error);
      });
   });
  
    row.appendChild(idCell);
    row.appendChild(cowidCell);
    row.appendChild(dateCell);
    row.appendChild(diagCell);
    row.appendChild(buttonsCell);
  
    tableBody.appendChild(row);
    };
  
  
  
  
  
  
    // Event listener for the form submission
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const consulID = parseInt(document.getElementById('consulID').value,10);
      const cowConsulID = document.getElementById('cowConsulID').value;
      const consulDate = document.getElementById('consulDate').value;
      const consulDiag = document.getElementById('consulDiag').value;

      const dateParts = consulDate.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; 
      const day = parseInt(dateParts[2]);
  
      const consulDateInput = new Date(year, month, day);

      // Make a POST request to add a new consultation
      fetch('/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: consulID,
          cowid: cowConsulID,
          date: consulDateInput.toISOString().split('T')[0],
          diagnostic: consulDiag,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add the new consultation to the list
          addconsultationToList(data.createdconsultation);
          consultationArray.push(data.createdconsultation);
          console.log("consultation: ", data.createdconsultation);
          //location.reload();
          
          consultationForm.reset();
          getconsultations();
  
          const nextAvailableID = getNextAvailableID();
          consultationIDInput.value = nextAvailableID;
        })
        .catch((error) => {
          console.error('Error adding consultation:', error);
        });
    });
  
  

  
  // Function to fetch and display existing consultations
  const getconsultations = () => {
    // Make a GET request to retrieve existing consultations
    fetch('/consultations/list/data')
      .then((response) => response.json())
      .then((data) => {
        console.log("added");
        })
      .catch((error) => {
        console.error('Error fetching consultations:', error);
      });
  
  };



    // Function to fetch and display existing consultations
    const fetchconsultations = () => {
      // Make a GET request to retrieve existing consultations
      fetch('/consultations/list/data')
        .then((response) => response.json())
        .then((data) => {
          consultationArray = data;
          data.forEach((consultation) => {
  
            addconsultationToList(consultation);
          });
          // Function to get the next available ID based on existing consultations in the list
  
        consultationIDInput.value = getNextAvailableID();
  
        })
        .catch((error) => {
          console.error('Error fetching consultations:', error);
        });
  
    };
  
  
  
  
  
    const getNextAvailableID = () => {
      console.log(consultationArray);
      const existingIDs = consultationArray.map((consultation) => consultation.id);
      const maxID = Math.max(...existingIDs);
      if (consultationArray.length === 0) {
        return 1;
      } else {
      return maxID + 1;
    };
    };
  
  


      // Call the function to fetch and display existing consultations

    fetchconsultations();
    history.pushState({}, '', newUrl);
  


    const closeButton = document.querySelector('.close');
  closeButton.addEventListener('click', closeEditModal);
  const closeButtondel = document.querySelector('.close');
  closeButton.addEventListener('click', closeDeleteModal);
  
  });
  