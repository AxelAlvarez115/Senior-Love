const deleteButns = document.querySelectorAll('.delete-comment');
const form = document.querySelector('.comment-form');

form.addEventListener('submit', async (e) => {
    if(e.target.elements.contents.value === '') {
        e.preventDefault();
        const alertMessage = document.querySelector('.alert');
        if(alertMessage) alertMessage.remove();
        const alertT = document.createElement('div');
        alertT.classList.add('alert', 'alert--error');
        alertT.innerHTML = `
            <p class='alert__text' role='alert'>Le contenu du commentaire ne peux pas être vide</p>
            <button class="alert__button alert__button--error"><i class="bx bx-x"></i></button>
        `;
        form.prepend(alertT);

        const closeButton = alertT.querySelector('.alert__button');
        closeButton.addEventListener('click', () => {
            alertT.remove();
        });
    }
});

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const alertMessage = document.querySelector('.alert');
//     const contents = e.target.elements.contents.value;
//     const eventId = e.target.dataset.eventid;
//     console.log(e.target.dataset)
//     const response = await fetch(`/commentaire/${eventId}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({contents: contents})
//     });
//     const data = await response.json();
//     if(alertMessage) alertMessage.remove();
//     if(!data.success) {
//         const alertT = document.createElement('p');
//         alertT.textContent = 'Le commentaire ne peut pas être vide';
//         alertT.classList.add('alert', 'alert--error');
//         form.prepend(alertT);
//     }
//     else {      
//         const comment = data.comment;
//         const commentContainer = document.querySelector('.segment__container');
//         const commentDiv = document.createElement('div');
//         commentDiv.classList.add('comment');
//         commentDiv.innerHTML = `
//         <div>
//             <div class="comment__infos">
//                 <p class="comment__infos__user">${comment.User.firstname} ${comment.User.lastname}</p>
//                 <p class="comment__infos__date">Publié le ${new Date(comment.updatedAt).toLocaleDateString('fr-FR')}</p>
//             </div>
//             <form action="/evenement/<%= event.id %>/<%= comment.id %>/modif-com" method="POST">
//                 <input type="text" class="comment__content--input" name="content" value="<%= comment.contents %>"></input>
//                 <button class="comment__button" type="submit">Mettre à jour</button>
//             </form>
//                 <button type="button" class="comment__button delete-comment" data-comment-id="<%= comment.id %>">Supr</button>
//         </div>`;
//         commentContainer.append(commentDiv)
//         e.target.elements.contents.value = '';
//     }
// });

// deleteButns.forEach(btn => {
//     btn.addEventListener('click', async (e) => {
//         const alertMessage = document.querySelector('.alert');
//         const commentId = e.target.dataset.commentId;
//         console.log(commentId);
//         const response = await fetch(`/commentaire/${commentId}`, {
//             method: 'DELETE'
//         });
//         const data = await response.json();
//         if(alertMessage) alertMessage.remove();
//         if(!data.success) {
//             const alertT = document.createElement('p');
//             alertT.textContent = 'Vous ne pouvez pas supprimer ce commentaire';
//             alertT.classList.add('alert', 'alert--error');
//             form.prepend(alertT);
//         }
//         else {
//             e.target.parentElement.remove();
//             const alertT = document.createElement('p');
//             alertT.textContent = 'Le commentaire a bien été supprimé';
//             alertT.classList.add('alert');
//             form.prepend(alertT);
//         }
//     });
// });