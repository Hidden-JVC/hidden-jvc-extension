# Hidden JVC Extension

Hidden JVC est un forum intégré aux forums de https://www.jeuxvideo.com/.

Le projet est actuellement en version Alpha.

* [Téléchargement](#Téléchargement)
* [Fonctionnalités](#Fonctionnalités)
* [Roadmap](#Roadmap)
* [Compatibilité](#Compatibilité)
* [FAQ](#FAQ)
* [Compilation](#Compilation)

## Téléchargement

* ![](https://raw.githubusercontent.com/reek/anti-adblock-killer/gh-pages/images/firefox.png) Firefox : https://github.com/Hidden-JVC/hidden-jvc-extension/releases/latest

#### version maintenue par [@borrougagnou](https://github.com/borrougagnou) :
* ![](https://raw.githubusercontent.com/reek/anti-adblock-killer/gh-pages/images/chrome.png) Chrome : https://chrome.google.com/webstore/detail/hidden-jvc/mdghlmpglafocnnpohgfeckaickmkapc

## Fonctionnalités

* Pouvoir poster des messages sur des topics JVC visible uniquement pour les utilisateurs d'Hidden JVC.

* Pouvoir poster sur des topics lock de JVC.

* Pouvoir créer des topics sur les serveurs d'Hidden JVC mais néanmoins toujours consultable depuis JVC.

* Pouvoir poster avec ou sans compte

* Mode fic pour ne voir que les posts de l'auteur d'un topic.

## Roadmap

* Pouvoir consulter les topics d'Hidden JVC sur un site web intégré a l'extension et sur https://hiddenjvc.com.

* Pouvoir connecter l'extension à différents serveurs Hidden JVC.

* Pouvoir backup des topics JVC

## FAQ

### Quelles différences avec JVP (https://wiki.jvflux.com/JV_Parallele) ?

Hidden JVC est open source alors si jamais les devs actuels ne sont plus actifs d'autres devs pourront prendre la main.

### Pourquoi une extension web plutôt qu'un userscript

Quand le propriétaire d'un site web est hostile à un userscript comme l'a été webedia avec JVP, ça devient très vite difficile voir impossible de pouvoir contrer les tentatives de bloquer le bon fonctionnement du userscript.

Une extension web à beaucoup plus de pouvoir qu'un userscript et permet de bypass les scripts de webedia.

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

Ces commandes vont générer le fichier `hidden-jvc-extension.zip` le répertoire `./build`
