# Schémas du Dossier-Projet — Senior Love

Sources des schémas à insérer dans `Dossier_projet_Senior_Love_Axel_Alvarez.docx`.
Aucune installation nécessaire : chaque fichier se colle dans un visualiseur web
gratuit qui exporte en PNG ou SVG.

---

## Les fichiers

**Quatre schémas sont déjà rendus en PNG** et prêts à être insérés dans le dossier.
Les deux autres demandent un passage par un visualiseur web (une minute chacun).

| Fichier | Schéma | État | Emplacement dans le dossier |
|---|---|---|---|
| `01-mcd.mmd` | Modèle conceptuel (notation crow's foot) | ✅ `01-mcd.png` | Spéc. techniques §5a |
| `01bis-mcd-merise.mocodo` | Modèle conceptuel **notation Merise** | ⚙️ [mocodo.net](https://mocodo.net) | Spéc. techniques §5a |
| `02-mld.dbml` | Modèle logique de données | ⚙️ [dbdiagram.io](https://dbdiagram.io/d) | Spéc. techniques §5b |
| `03-cas-utilisation.puml` | Cas d'utilisation UML | ⚙️ [plantuml.com](https://www.plantuml.com/plantuml/uml/) | Spéc. fonctionnelles §3 |
| `04-navigation.mmd` | Diagramme de navigation | ✅ `04-navigation.png` | Spéc. fonctionnelles §4 |
| `05-architecture.mmd` | Architecture technique | ✅ `05-architecture.png` | Spéc. techniques §1 |
| `06-planning.mmd` | Planning (Gantt) | ✅ `06-planning.png` | Cahier des charges §6 |

> **Merise ou crow's foot ?** `01-mcd.png` emploie la notation crow's foot, lisible
> mais anglo-saxonne. La plupart des jurys de titre professionnel français
> attendent la **notation Merise** (entités rectangulaires, associations ovales,
> cardinalités 0,N / 1,1). Utilisez `01bis-mcd-merise.mocodo` sur mocodo.net si
> votre référentiel l'exige — en cas de doute, demandez à votre formateur.

---

## Mode d'emploi

### Mermaid (`.mmd`)
1. Ouvrir <https://mermaid.live>
2. Coller le contenu du fichier dans le panneau de gauche
3. **Actions → PNG** (ou SVG pour une qualité d'impression supérieure)

### dbdiagram.io (`.dbml`)
1. Ouvrir <https://dbdiagram.io/d>
2. Coller le contenu dans l'éditeur
3. **Export → PNG / PDF**

### PlantUML (`.puml`)
1. Ouvrir <https://www.plantuml.com/plantuml/uml/>
2. Coller le contenu, valider
3. Clic droit sur l'image → *Enregistrer l'image sous*

### Rendu local (facultatif)
```bash
npx -y @mermaid-js/mermaid-cli -i 01-mcd.mmd -o 01-mcd.png -b white -w 2000
```

---

## À propos du planning

**`06-planning.mmd`** couvre la **reprise individuelle, du 1er mai au 1er juillet**,
avec les dates réelles du projet.

La version initiale n'y figure pas : elle a été menée en équipe de quatre sur un
mois — une semaine de conception (charte graphique, wireframes, modèle de
données), deux semaines de développement, une semaine de débogage. Elle est
décrite dans le tableau de chronologie du dossier de projet.

> ⚠️ Le parseur Gantt de Mermaid **n'accepte aucun commentaire `%%` avant le
> mot-clé `gantt`** : il concatène les lignes et échoue sur `%%gantt`. Si vous
> ajoutez des commentaires, placez-les après la ligne `gantt`.

Format d'une ligne de tâche :

```
Nom de la tâche    :identifiant, 2026-05-01, 7d
```

---

## Ce qui ne peut pas être généré ainsi

**Les maquettes** (6 emplacements) — à produire dans un outil de maquettage, ou à
remplacer par des captures de l'application en précisant explicitement au jury
qu'il s'agit du rendu final et non de maquettes préalables.
Outils : Figma (gratuit), Excalidraw, Balsamiq, Penpot.

**Les captures d'écran** (12 emplacements) — elles doivent venir de l'application
en fonctionnement. Lancer le projet, se connecter avec un compte de test, et
capturer chaque écran demandé par les légendes du dossier.

```bash
npm install
psql -U <utilisateur> -d <base> -f app/database/database.sql
npm run dev
```
