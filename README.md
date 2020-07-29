# Hidden JVC Extension

Hidden JVC est un forum intégré aux forums de https://www.jeuxvideo.com/.

Le projet est actuellement en version Alpha.

* [Téléchargement](#Téléchargement)
* [Fonctionnalité](#Fonctionnalité)
* [Roadmap](#Roadmap)
* [Compatibilité](#Compatibilité)
* [FAQ](#FAQ)
* [Compilation](#Compilation)

## Téléchargement

* ![](https://raw.githubusercontent.com/reek/anti-adblock-killer/gh-pages/images/firefox.png) Firefox : https://github.com/Hidden-JVC/hidden-jvc-extension/releases/latest

#### version maintenue par [@borrougagnou](https://github.com/borrougagnou) :
* ![](https://raw.githubusercontent.com/reek/anti-adblock-killer/gh-pages/images/chrome.png) Chrome : https://chrome.google.com/webstore/detail/hidden-jvc/mdghlmpglafocnnpohgfeckaickmkapc
* ![](https://raw.githubusercontent.com/reek/anti-adblock-killer/gh-pages/images/opera.png) Opera : Stable \[en cours\]![](https://raw.githubusercontent.com/reek/anti-adblock-killer/gh-pages/images/close16.png), Developer ✔, Next ✔

## Fonctionnalité

* Pouvoir poster des messages sur des topics JVC visible uniquement pour les utilisateurs d'Hidden JVC.

* Pouvoir créer et poster sur des topics indépendants mais néanmoins toujours consultable depuis JVC.

* Pouvoir poster anonymement sans avoir à se créer un compte bien qu'on puisse toujours réserver un pseudo et poser avec un compte vérifié.

* Mode fic pour ne voir que les posts de l'auteur d'un topic.

## Roadmap

* Pouvoir consulter les topics indépendants sur un site web intégré a l'extension et sur https://hiddenjvc.com.

* Pouvoir connecter l'extension à différent serveur Hidden JVC.

* Pouvoir poster sur des topics lock de JVC.


## Compatibilité
L'extension est compatible avec tous les navigateurs modernes.
Néanmois seul firefox permet de contrer efficacement les tentatives de webedia de bloquer l'intégration d'Hidden JVC.

## FAQ

### Quelles différences avec JVP (https://wiki.jvflux.com/JV_Parallele) ?

* Hidden JVC est open source alors si jamais les devs actuels ne sont plus actifs d'autres devs pourront prendre la main.

* Un des problèmes de JVP était que webedia incluait des scripts sur JVC pour le bloquer. Par conséquence le temps qu'un fix arrive le forum était inaccessible et une grosse partie de la communauté se lassait très vite. On n'a plus ce problème avec Hidden JVC car les forums sont consultables sur deux autres platformes (site web et pages d'extension)

### Pourquoi une extension web plutôt qu'un userscript

Quand le propriétaire d'un site web est hostile à un userscript comme l'a été webedia avec JVP, ça devient très vite difficile voir impossible de pouvoir contrer les tentatives de bloquer le bon fonctionnement du userscript.

Une extension web elle à beaucoup plus de pouvoir qu'un userscript et permet donc de bypass les scripts de webedia. Je pense notament à cette fonctionnalité de firefox qui permet de modifié la réponse d'une requête avant même qu'elle n'arrive dans l'onglet: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/filterResponseData

### Pourquoi pas chrome

Avec firefox Quantum (v57) en 2017
Chrome n'a toujours pas implémenté depuis plus de 9 ans
https://bugs.chromium.org/p/chromium/issues/detail?id=104058
https://bugs.chromium.org/p/chromium/issues/detail?id=487422

diminution du pouvoir des extension de bloquer les pubs
https://blog.mozilla.org/addons/2019/09/03/mozillas-manifest-v3-faq/

## Compilation

Prérequis:
* Git
* Node.js
* 7zip / p7zip

Installation:

    git clone https://github.com/Hidden-JVC/hidden-jvc-extension
    cd hidden-jvc-extension
    npm ci
    npm run build

Ces commandes vont générer un build de l'extension dans le répertoire `./build`
