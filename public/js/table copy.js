const openMenu = (action) => {
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
    title.textContent = `${action}`;
    
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

    // Return the created elements
    return { modal, editModal, body, closeBtn, title };
};

const openEditForm = (object, type) => {
    // Get modal elements
    const { modal, editModal, body, closeBtn, title } = openMenu(`Edit the ${type}`);

    // Create form
    const form = document.createElement('form');
    form.id = 'editObjectForm';
    form.action = `/${type}s/update/${object.id}`;
    form.method = 'POST';
    
    // Create form fields
    const eventFields = [
        { id: 'eventId', type: 'hidden', label: '', name: 'id' },
        { id: 'name', type: 'text', label: 'Nom:', name: 'name' },
        { id: 'city', type: 'text', label: 'Ville:', name: 'city' },
        { id: 'date', type: 'date', label: 'Date:', name: 'date' },
        { id: 'adresse', type: 'text', label: 'Adresse:', name: 'adresse' }
    ];

    const userFields = [
        { id: 'userId', type: 'hidden', label: '', name: 'id' },
        { id: 'firstname', type: 'text', label: 'Prénom:', name: 'firstname' },
        { id: 'lastname', type: 'text', label: 'Nom:', name: 'lastname' },
        { id: 'email', type: 'email', label: 'Email:', name: 'email' },
        { id: 'phone', type: 'tel', label: 'Téléphone:', name: 'phone' },
        { id: 'date_of_birth', type: 'date', label: 'Date de naissance:', name: 'date_of_birth' },
        { id: 'administrator', type: 'checkbox', label: 'Administrateur:', name: 'administrator' }
    ];

    const formFields = type === 'event' ? eventFields : userFields;

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

            if(field.type !== 'checkbox') {
                input.required = true;
            }
            
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

    // Create cancel button 
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('modal__btn');
    cancelBtn.textContent = 'Cancel changes';
    
    // Assemble the modal
    form.appendChild(submitBtn);
    form.appendChild(cancelBtn);
    editModal.appendChild(closeBtn);
    editModal.appendChild(title);
    editModal.appendChild(form);
    modal.appendChild(editModal);
    body.appendChild(modal);
    
    // Fill form fields
    form.querySelectorAll('input').forEach(input => {
        const fieldName = input.name;
        if (input.type === 'date' && object[fieldName]) {
            // Handle date fields
            const date = new Date(object[fieldName]);
            input.value = date.toISOString().split('T')[0];
        } else if (input.type === 'checkbox') {
            // Handle checkbox fields
            input.checked = object[fieldName] === true || object[fieldName] === 1;
        } else {
            // Handle all other fields
            input.value = object[fieldName] || '';
        }
    });

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

    cancelBtn.onclick = function() {
        modal.remove();
    }

};

const openDeleteForm = (object, type) => {
    const { modal, editModal, body, closeBtn, title } = openMenu(`Delete the ${type} ?`);

    // Create form
    const form = document.createElement('form');
    form.id = 'deleteObjectForm';
    form.action = `/${type}s/delete/${object.id}`;
    form.method = 'POST';

    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('modal__btn');
    submitBtn.textContent = 'Yes';

    // Create cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('modal__btn', 'modal__btn--cancel');
    cancelBtn.textContent = 'No';

    // Assemble the modal
    form.appendChild(submitBtn);
    form.appendChild(cancelBtn);
    editModal.appendChild(closeBtn);
    editModal.appendChild(title);
    editModal.appendChild(form);
    modal.appendChild(editModal);
    body.appendChild(modal);

    // Handle form submission
    form.onsubmit = async function(e) {
        e.preventDefault();
        const response = await fetch(this.action, { method: 'POST' });
        if (response.ok) {
            window.location.reload();
        }
    }

    cancelBtn.onclick = function() {
        modal.remove();
    }

};

