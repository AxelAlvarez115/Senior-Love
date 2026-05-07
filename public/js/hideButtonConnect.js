console.log(isLogged) //test de isLogged
function hideconnect(){
    if (req.session.isLogged){ //essaie de voir si l'utilisateur est connecté
    disconnected.classList.add('hidden');
    connected.classList.remove('hidden');
    console.log('hide connexion button');
} else {
    disconnected.classList.remove('hidden');
    connected.classList.add('hidden');
    console.log('disconnect seen and connexion hide');}
}

export default hideconnect;
