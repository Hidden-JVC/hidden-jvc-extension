# Hidden JVC Extension

Hidden JVC est un forum intégré aux forums de http://www.jeuxvideo.com/.

## Fonctionnalités

* Pouvoir poster des messages sur des topics JVC visible uniquement pour les utilisateurs d'Hidden JVC.

* Pouvoir créer et poster sur des topics indépendants mais néanmoins toujours consultable depuis JVC.

* Pouvoir poster anonymement sans avoir à se créer un compte bien qu'on puisse toujours réserver un pseudo et poser avec un compte vérifié.

* Pouvoir consulter les topics indépendants sur un site web intégré a l'extension et sur https://hiddenjvc.com.

* Pouvoir connecter l'extension à différent serveur Hidden JVC.

* Mode fic sur les topics Hidden JVC qui permet de ne voir que les posts de l'auteur tu topic.

## Compatibilité
L'extension est compatible avec tous les navigateurs modernes.
Néanmois seul firefox permet de contrer efficacement les tentatives de webedia de bloquer l'intégration d'Hidden JVC.

## Documentation utilisateur
TODO: lien vers le wiki github

## FAQ

### Quelles différences avec JVP (https://wiki.jvflux.com/JV_Parallele) ?

* Hidden JVC est open source alors si jamais les devs actuels ne sont plus actifs d'autres devs pourront prendre la main

* Un des problèmes de JVP était que webedia incluaient des scripts sur JVC pour le bloquer. Par conséquence le temps qu'un fix arrive le forum était inaccessible et qu'une grosse partie de la communauté se lassait très vite. On n'a plus ce problème avec Hidden JVC car les forums sont consultable sur deux autres platformes (site web et pages d'extension)

### Pourquoi une extension web plutôt qu'un userscript

Quand le propriétaire d'un site web est hostile à un userscript comme l'a été webedia avec JVP, ça devient très vite difficile voir impossible de pouvoir contrer les tentatives de bloquer le bon fonctionnement du userscript.

Une extension web elle à beaucoup plus de pouvoir qu'un userscript et permet donc de bypass les scripts de webedia. Je pense notament à cette fonctionnalité de firefox qui permet de modifié la réponse d'une requête avant même qu'elle n'arrive dans l'onglet: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData

## Compiler sois-même l'extension

### Compilation

Prérequis: Git et Node.js

    git clone https://github.com/m7r-227/hidden-jvc-extension.git
    cd hidden-jvc-extension
    npm install
    npm run build

Ces commandes vont générer un build de l'extension dans le répertoire `./build`

### Installation
Firefox:

* Aller sur about:debugging

## Contribuer

Le projet Hidden JVC est réparti sur 4 répos:

### L'extension web
Permet d'intégrer les forums dans JVC au travers d'une extension web.

https://github.com/m7r-227/hidden-jvc-extension

### Le serveur
L'api REST qui permet d'intérroger la bdd en postgres

https://github.com/m7r-227/hidden-jvc-server

### Le site web
Le site web qui permet de consulter Hidden JVC en dehors de JVC

https://github.com/m7r-227/hidden-jvc-website

### Le markup language
Implémentation de jvcode

https://github.com/m7r-227/open-jvcode
