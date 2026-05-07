function openEditTable(object, action) {
    const body = document.querySelector('body');
    
    // Create modal container
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Create modal content
    const editModal = document.createElement('div');
    editModal.id = 'editModal';
    editModal.classList.add('modal__content');
    
    // Create close button
    const closeBtn = document.createElement('span');
    closeBtn.classList.add('modal__close');
    closeBtn.textContent = '×';
    
    // Create title
    const title = document.createElement('h2');
    title.classList.add('modal__title');
    title.textContent = 'Edit Event';
    
    // Create form
    const form = document.createElement('form');
    form.id = 'editObjectForm';
    form.action = `/events/update/${object.id}`;
    form.method = 'POST';
    
    // Create form fields
    const eventFields = [
        { id: 'eventId', type: 'hidden', label: '', name: 'id' },
        { id: 'name', type: 'text', label: 'Nom:', name: 'name' },
        { id: 'city', type: 'text', label: 'Ville:', name: 'city' },
        { id: 'date', type: 'date', label: 'Date:', name: 'date' },
        { id: 'adresse', type: 'text', label: 'Adresse:', name: 'adresse' }
    ];

    // User fields
    const userFields = [
        { id: 'userId', type: 'hidden', label: '', name: 'id' },
        { id: 'firstname', type: 'text', label: 'Prénom:', name: 'firstname' },
        { id: 'lastname', type: 'text', label: 'Nom:', name: 'lastname' },
        { id: 'email', type: 'email', label: 'Email:', name: 'email' },
        { id: 'phone', type: 'tel', label: 'Téléphone:', name: 'phone' },
        { id: 'date_of_birth', type: 'date', label: 'Date de naissance:', name: 'date_of_birth' },
        { id: 'administrator', type: 'checkbox', label: 'Administrateur:', name: 'administrator' }
    ];

    // Form fields
    const formFields = action === 'event' ? eventFields : userFields;

    formFields.forEach(field => {
        if (field.type !== 'hidden') {
            const group = document.createElement('div');
            group.classList.add('form__group');
            
            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label;
            
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.name = field.name;
            input.required = true;
            
            group.appendChild(label);
            group.appendChild(input);
            form.appendChild(group);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.name = field.name;
            form.appendChild(input);
        }
    });
    
    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('modal__btn');
    submitBtn.textContent = 'Save Changes';
    
    // Assemble the modal
    form.appendChild(submitBtn);
    editModal.appendChild(closeBtn);
    editModal.appendChild(title);
    editModal.appendChild(form);
    modal.appendChild(editModal);
    body.appendChild(modal);
    
    // Fill form fields
    form.querySelectorAll('input:not(#date)').forEach(input => {
        input.value = object[input.id];
    });

    if(object.date) {
        form.querySelector('#date').value = new Date(object.date).toISOString().split('T')[0];
    }
    
    // Close modal when clicking the X
    closeBtn.onclick = function() {
        modal.remove();
    }

    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    }

    // Handle form submission
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error updating event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating event');
        }
    }
};