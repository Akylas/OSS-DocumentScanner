---
id: scanning-cards
title: Scanner des Cartes
sidebar_position: 2
slug: /cardwallet/scanning-cards
---

# Scanner des Cartes

OSS CardWallet facilite la numérisation de vos cartes physiques en scannant leurs codes-barres.

## Scanner un Code-Barres

### Utiliser l'Appareil Photo

1. Appuyez sur le bouton **+** pour ajouter une nouvelle carte
2. Sélectionnez **Scanner un Code-Barres**
3. Pointez votre appareil photo vers le code-barres
4. L'application détectera et scannera automatiquement le code-barres
5. Vérifiez les informations détectées et ajoutez les détails de la carte

### Conseils pour un Meilleur Scan

- **Bon éclairage** : Assurez un éclairage adéquat sur le code-barres
- **Mains stables** : Maintenez votre appareil stable pendant le scan
- **Code-barres propre** : Assurez-vous que le code-barres n'est pas endommagé ou masqué
- **Bonne distance** : Tenez votre appareil à 10-15 cm du code-barres
- **Évitez les reflets** : Inclinez la carte pour éviter les reflets sur les cartes plastifiées

## Saisie Manuelle

Si le scan ne fonctionne pas, vous pouvez entrer les données du code-barres manuellement :

1. Appuyez sur le bouton **+**
2. Sélectionnez **Saisie Manuelle**
3. Choisissez le format du code-barres
4. Entrez le numéro du code-barres
5. Ajoutez les détails de la carte et enregistrez

## Formats de Codes-Barres Supportés

### Codes-Barres 1D (Linéaires)

| Format | Utilisation Courante |
|--------|---------------------|
| CODE_128 | Usage général, expédition |
| CODE_39 | Industriel, automobile |
| EAN_13 | Produits de détail (Europe) |
| EAN_8 | Petits produits de détail |
| UPC_A | Produits de détail (Amérique du Nord) |
| UPC_E | Petits emballages |
| ITF | Expédition, logistique |
| CODABAR | Bibliothèques, banques de sang |

### Codes-Barres 2D

| Format | Utilisation Courante |
|--------|---------------------|
| QR_CODE | URLs, cartes de fidélité, billets |
| DATA_MATRIX | Électronique, petits articles |
| AZTEC | Billets, cartes d'embarquement |
| PDF_417 | Cartes d'identité, permis de conduire |

## Scanner depuis des Images

Vous pouvez également scanner des codes-barres depuis des images existantes :

1. Appuyez sur le bouton **+**
2. Sélectionnez **Importer depuis la Galerie**
3. Choisissez une image contenant un code-barres
4. L'application détectera et extraira le code-barres

## Scan par Lots

Pour ajouter plusieurs cartes rapidement :

1. Activez le **Mode par Lots** dans les paramètres de scan
2. Scannez chaque carte successivement
3. L'application mettra les cartes en file d'attente pour que vous ajoutiez les détails plus tard
4. Vérifiez et enregistrez chaque carte quand vous avez terminé

## Dépannage

### Code-Barres Non Détecté

- Assurez-vous que le code-barres est entièrement visible dans le cadre
- Essayez de vous rapprocher ou de vous éloigner du code-barres
- Améliorez les conditions d'éclairage
- Vérifiez si le format du code-barres est supporté

### Mauvais Format de Code-Barres Détecté

- Sélectionnez manuellement le bon format dans les paramètres
- Utilisez la saisie manuelle pour spécifier le format exact

### Appareil Photo Flou

- Nettoyez l'objectif de votre appareil photo
- Assurez un éclairage adéquat
- Maintenez l'appareil stable
