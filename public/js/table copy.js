const openMenu = (action) => {
    const body = document.querySelector('body');

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const editModal = document.createElement('div');
    editModal.id = 'editModal';
    editModal.classList.add('modal__content');

    const header = document.createElement('div');
    header.classList.add('modal__header');

    const title = document.createElement('h2');
    title.classList.add('modal__title');
    title.textContent = `${action}`;

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('modal__close');
    closeBtn.textContent = '×';

    closeBtn.onclick = function() {
        modal.remove();
        document.body.style.overflow = '';
    };

    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    };

    header.appendChild(title);
    header.appendChild(closeBtn);

    return { modal, editModal, body, header };
};

const openEditForm = (object, type) => {
    const { modal, editModal, body, header } = openMenu(
        type === 'event' ? 'Modifier l\'évènement' : 'Modifier l\'utilisateur'
    );

    const form = document.createElement('form');
    form.id = 'editObjectForm';
    form.action = `/${type}s/update/${object.id}`;
    form.method = 'POST';

    const eventFields = [
        { id: 'eventId',   type: 'hidden', label: '',                  name: 'id' },
        { id: 'name',      type: 'text',   label: 'Nom',               name: 'name' },
        { id: 'city',      type: 'text',   label: 'Ville',             name: 'city' },
        { id: 'date',      type: 'date',   label: 'Date',              name: 'date' },
        { id: 'adresse',   type: 'text',   label: 'Adresse',           name: 'adresse' }
    ];

    const userFields = [
        { id: 'userId',        type: 'hidden',   label: '',                    name: 'id' },
        { id: 'firstname',     type: 'text',     label: 'Prénom',              name: 'firstname' },
        { id: 'lastname',      type: 'text',     label: 'Nom',                 name: 'lastname' },
        { id: 'email',         type: 'email',    label: 'Email',               name: 'email' },
        { id: 'phone',         type: 'tel',      label: 'Téléphone',           name: 'phone' },
        { id: 'date_of_birth', type: 'date',     label: 'Date de naissance',   name: 'date_of_birth' },
        { id: 'administrator', type: 'checkbox', label: 'Administrateur',      name: 'administrator' }
    ];

    const formFields = type === 'event' ? eventFields : userFields;

    const body_div = document.createElement('div');
    body_div.classList.add('modal__body');

    formFields.forEach(field => {
        if (field.type === 'hidden') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.id = field.id;
            input.name = field.name;
            form.appendChild(input);
            return;
        }

        if (field.type === 'checkbox') {
            const row = document.createElement('div');
            row.classList.add('modal__checkbox-row', 'modal__field--full');

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = field.id;
            input.name = field.name;

            const label = document.createElement('label');
            label.setAttribute('for', field.id);
            label.textContent = field.label;

            row.appendChild(input);
            row.appendChild(label);
            body_div.appendChild(row);
            return;
        }

        const fieldDiv = document.createElement('div');
        fieldDiv.classList.add('modal__field');

        const label = document.createElement('label');
        label.classList.add('modal__label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;

        const input = document.createElement('input');
        input.classList.add('modal__input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.name;
        input.required = true;

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(input);
        body_div.appendChild(fieldDiv);
    });

    form.appendChild(body_div);

    const footer = document.createElement('div');
    footer.classList.add('modal__footer');

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('modal__btn', 'modal__btn--cancel');
    cancelBtn.textContent = 'Annuler';
    cancelBtn.onclick = function() {
        modal.remove();
        document.body.style.overflow = '';
    };

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('modal__btn', 'modal__btn--primary');
    submitBtn.textContent = 'Enregistrer';

    footer.appendChild(cancelBtn);
    footer.appendChild(submitBtn);
    form.appendChild(footer);

    editModal.appendChild(header);
    editModal.appendChild(form);
    modal.appendChild(editModal);
    body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    form.querySelectorAll('input').forEach(input => {
        const fieldName = input.name;
        if (input.type === 'date' && object[fieldName]) {
            const date = new Date(object[fieldName]);
            input.value = date.toISOString().split('T')[0];
        } else if (input.type === 'checkbox') {
            input.checked = object[fieldName] === true || object[fieldName] === 1;
        } else {
            input.value = object[fieldName] || '';
        }
    });

    form.onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                window.location.reload();
            } else {
                alert('Erreur lors de la modification');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur lors de la modification');
        }
    };
};

const openDeleteForm = (object, type) => {
    const { modal, editModal, body, header } = openMenu(
        `Supprimer ${type === 'event' ? 'l\'évènement' : 'l\'utilisateur'} ?`
    );

    const form = document.createElement('form');
    form.id = 'deleteObjectForm';
    form.action = `/${type}s/delete/${object.id}`;
    form.method = 'POST';

    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('modal__body', 'modal__body--single');

    const confirmText = document.createElement('p');
    confirmText.style.cssText = 'color:#444;font-size:0.92rem;grid-column:1/-1;';
    confirmText.textContent = 'Cette action est irréversible. Voulez-vous continuer ?';
    bodyDiv.appendChild(confirmText);
    form.appendChild(bodyDiv);

    const footer = document.createElement('div');
    footer.classList.add('modal__footer');

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.classList.add('modal__btn', 'modal__btn--cancel');
    cancelBtn.textContent = 'Annuler';
    cancelBtn.onclick = function() {
        modal.remove();
        document.body.style.overflow = '';
    };

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.classList.add('modal__btn', 'modal__btn--primary');
    submitBtn.textContent = 'Supprimer';

    footer.appendChild(cancelBtn);
    footer.appendChild(submitBtn);
    form.appendChild(footer);

    editModal.appendChild(header);
    editModal.appendChild(form);
    modal.appendChild(editModal);
    body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    form.onsubmit = async function(e) {
        e.preventDefault();
        const response = await fetch(this.action, { method: 'POST' });
        if (response.ok) {
            window.location.reload();
        }
    };
};
