# Parcours de démonstration — soutenance Senior Love

**Durée cible : 6 minutes**, en un bloc unique, à l'emplacement de la diapositive
« Démonstration » (23/26), juste avant le bilan.

---

## Préparation — à faire AVANT d'entrer dans la salle

| # | Action |
|---|---|
| 1 | `psql -U <user> -d senior -f app/database/database.sql` — repartir d'un jeu de données propre |
| 2 | `npm run dev` — laisser tourner, vérifier `http://127.0.0.1:3000` |
| 3 | **Deux fenêtres de navigateur** : A normale, B en navigation privée |
| 4 | Fenêtre B : connectée en `francoise.petit@test.fr` / `password`, sur la conversation avec Marie |
| 5 | Fenêtre A : déconnectée, sur la page d'accueil |
| 6 | Zoom navigateur à **125 %** — le vidéoprojecteur écrase les petits caractères |
| 7 | Masquer la barre de favoris, fermer les onglets parasites |
| 8 | **Vidéo de secours enregistrée** et accessible hors ligne |

> Les deux fenêtres sont indispensables : sans elles, impossible de démontrer le
> temps réel, qui est l'apport central de ta reprise 2026.

---

## Le parcours

### 1. L'accueil — le parti pris d'accessibilité · 20 s
**Fenêtre A**, page d'accueil.

> « L'application vise les 60 ans et plus. Tout part de là : grands caractères,
> contrastes marqués, libellés textuels plutôt que des icônes seules, et un
> nombre d'étapes réduit au minimum. »

---

### 2. Inscription — la validation serveur · 60 s ⭐
Clique sur *Inscription*. Remplis le formulaire, et saisis volontairement le mot
de passe **`password`**.

→ **Refus**, avec le message explicite sur la politique de complexité.

> « La validation est refaite intégralement côté serveur. Le navigateur peut être
> contourné, donc il ne constitue jamais une garantie. La politique impose douze
> caractères, majuscule, minuscule, chiffre et symbole. »

Reprends avec **`SeniorLove2026!`** → compte créé, connexion automatique.

*Compétence démontrée : développer des composants métier côté serveur.*

---

### 3. Le contrôle d'accès et la redirection · 30 s ⭐
Déconnecte-toi. Tape directement dans l'URL : **`/rencontre`**

→ Redirection vers la connexion, avec un message d'explication.

Connecte-toi en **`marie.dupont@test.fr` / `password`**

→ Tu arrives **sur `/rencontre`**, pas sur l'accueil.

> « L'intergiciel de garde mémorise l'adresse demandée avant de rediriger, puis
> y ramène le membre. Pour un public peu à l'aise avec la navigation, ce détail
> évite de le perdre. »

---

### 4. Rencontres — la réciprocité · 60 s ⭐
Montre la liste des membres, puis les filtres par centre d'intérêt et affinité.
Ouvre un profil.

> « Marie a renseigné qu'elle recherche des hommes. Elle ne voit donc que des
> profils masculins — mais uniquement ceux dont la préférence accepte les femmes.
> La compatibilité est vérifiée dans les deux sens, par un double filtre en base.
> Les contacts déjà établis et son propre profil sont exclus, et le mot de passe
> est systématiquement retiré des résultats. »

*Compétence démontrée : développer des composants d'accès aux données.*

---

### 5. Demande de contact — notification instantanée · 40 s ⭐
Depuis un profil non-contact, envoie une **demande de contact**.
Bascule sur la **fenêtre B**.

→ La notification apparaît **sans rechargement**, la pastille s'incrémente.

> « Une demande crée une ligne dans `user_contactrequest` et émet une
> notification temps réel. À l'acceptation, deux relations réciproques sont
> créées dans `user_relationship`. Ce n'est qu'à partir de là que les deux
> membres peuvent s'écrire. »

---

### 6. Le chat temps réel · 60 s ⭐⭐
**Fenêtre A** (Marie) : ouvre la conversation avec **Françoise**, déjà contact.
Écris un message.

→ **Fenêtre B** : il arrive instantanément, le compteur de non-lus s'incrémente.

Réponds depuis B → il arrive dans A.

> « C'est la partie qui m'a demandé le plus de réflexion. Sur une liaison
> persistante, l'identifiant de l'émetteur ne peut pas venir du client : il
> serait falsifiable. Je partage donc l'intergiciel de session d'Express avec
> Socket.io — une socket sans session valide est refusée — et avant chaque
> enregistrement, le serveur vérifie en base que le destinataire est bien un
> contact accepté. Chaque membre a son salon privé. »

*Le moment le plus fort de la démonstration. Ne le bâcle pas.*

---

### 7. Événement, participation et commentaire · 40 s
Ouvre **« Randonnée en forêt de Fontainebleau »**.

- Clique sur participer → puis à nouveau → **bascule** inscription/désinscription
- Dépose un commentaire, puis **modifie-le**

> « La participation fonctionne en bascule : une seule action, un seul bouton.
> Un membre ne peut modifier que ses propres commentaires ; un administrateur
> peut en revanche en supprimer n'importe lequel. »

---

### 8. Le refus d'accès · 20 s ⭐
Toujours connecté en Marie, tape **`/admin`** dans l'URL.

→ **Statut 403** et page d'erreur dédiée.

> « Le rôle administrateur est revérifié en base à chaque requête, pas lu dans
> la session. Une session ouverte avant un retrait de droits ne donne donc plus
> accès au back-office. »

---

### 9. Le back-office · 40 s
Déconnecte-toi, connecte-toi en **`admin@seniorlove.fr` / `password`**.

Montre le tableau de bord et ses statistiques, la table de gestion des membres,
puis supprime un commentaire.

*Compétence démontrée : composants de gestion de contenu.*

---

### 10. Bonus si le temps le permet · 20 s
Dans *Mon compte*, tente de téléverser un **PDF** comme photo de profil.

→ Refus.

> « Filtrage par type MIME limité à JPEG, PNG et WebP, taille bornée à cinq
> méga-octets, et nom de fichier intégralement régénéré côté serveur — le nom
> fourni par le client n'est jamais réutilisé. »

---

## Si tu dois raccourcir

Coupe dans cet ordre : **10**, puis **1**, puis **9**.

Ne coupe **jamais** les étapes marquées ⭐ : ce sont celles qui démontrent une
compétence que le jury doit évaluer. Les étapes **2, 3, 4, 6 et 8** forment le
noyau incompressible (environ 4 minutes).

---

## Comptes de test

| Adresse | Mot de passe | Rôle | Utilité dans la démo |
|---|---|---|---|
| `marie.dupont@test.fr` | `password` | membre | fil rouge — contact de Françoise |
| `francoise.petit@test.fr` | `password` | membre | fenêtre B, pour le temps réel |
| `admin@seniorlove.fr` | `password` | administrateur | back-office |

---

## Les trois questions à préparer

Le jury interroge 30 minutes après ta présentation. Ces trois-là tombent presque
à coup sûr :

**« Comment sécurisez-vous la messagerie temps réel ? »**
Session Express partagée avec Socket.io, socket sans session refusée, identité
lue côté serveur uniquement, relation revérifiée en base à chaque message,
salons privés par utilisateur.

**« Pourquoi deux tables pour la mise en relation plutôt qu'un statut ? »**
Parce que la contrainte est alors portée par la structure et non par le code :
il devient impossible qu'existe une relation dont le statut serait incohérent.

**« Comment déployez-vous l'application ? »**
C'est ton point faible, assume-le : la documentation couvre l'installation en
développement, le déploiement en production reste à formaliser — configuration
de production, migration de la base, reverse-proxy et HTTPS. Annonce-le comme
l'axe d'amélioration prioritaire que tu as identifié, avant qu'on te le
reproche.
