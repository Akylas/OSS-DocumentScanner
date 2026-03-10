---
id: passbook
title: Support Passbook et PKPass
sidebar_label: Passbook (PKPass)
sidebar_position: 4
---

# Support Passbook et PKPass

OSS CardWallet prend entièrement en charge les fichiers Apple Passbook (PKPass), vous permettant d'importer, visualiser et gérer des passes numériques comme les cartes d'embarquement, billets d'événements, cartes de fidélité et coupons.

## Qu'est-ce que PKPass ?

PKPass est le format de fichier utilisé par Apple Wallet (anciennement Passbook). Ces passes numériques sont couramment utilisés pour :

- ✈️ **Cartes d'embarquement** - Billets d'avion et de train
- 🎫 **Billets d'événements** - Concerts, cinéma, événements sportifs
- 🏪 **Cartes de fidélité** - Programmes de récompenses des magasins
- 🎁 **Coupons** - Bons de réduction numériques
- 🎟️ **Cartes cadeaux** - Cartes prépayées

## Importer des Passes

### Depuis des fichiers

1. Appuyez sur le bouton **+** dans CardWallet
2. Sélectionnez **Importer PKPass**
3. Parcourez jusqu'à votre fichier `.pkpass`
4. Le pass sera importé et affiché

### Depuis un email ou le web

Lorsque vous recevez un fichier PKPass par email ou le téléchargez depuis un site web :

1. Appuyez sur le fichier `.pkpass`
2. Sélectionnez **Ouvrir avec OSS CardWallet**
3. Le pass sera automatiquement importé

### Depuis un QR Code

Certains services fournissent des passes via QR codes :

1. Appuyez sur **Scanner** dans CardWallet
2. Scannez le QR code
3. S'il pointe vers un fichier PKPass, il sera téléchargé et importé

## Visualiser les Passes

Une fois importés, vos passes affichent toutes les informations pertinentes :

- **En-tête du pass** avec logo et nom de l'organisation
- **Informations principales** (numéro de vol, nom de l'événement, etc.)
- **Champs secondaires** (date, heure, siège, etc.)
- **Code-barres/QR code** pour le scan sur place
- **Verso du pass** avec détails supplémentaires

### Affichage selon le type

Chaque type de pass a un style visuel unique :

| Type de Pass | Style d'affichage |
|--------------|-------------------|
| Carte d'embarquement | Disposition en bande horizontale |
| Billet d'événement | Style ticket avec perforations |
| Carte de magasin | Disposition carte avec logo |
| Coupon | Design style coupon |
| Générique | Disposition carte standard |

## Gérer les Passes

### Organiser les passes

- **Catégories** : Groupez les passes par type (voyage, divertissement, shopping)
- **Favoris** : Marquez les passes importants pour un accès rapide
- **Archives** : Déplacez les passes expirés vers les archives

### Mettre à jour les passes

Certains passes supportent les mises à jour automatiques :

- Notifications push pour les changements de porte
- Horaires d'embarquement mis à jour
- Nouvelles offres de coupons

*Note : Les mises à jour automatiques nécessitent que l'émetteur du pass supporte cette fonctionnalité.*

### Supprimer des passes

1. Ouvrez le pass que vous souhaitez supprimer
2. Appuyez sur le menu **⋮**
3. Sélectionnez **Supprimer**
4. Confirmez la suppression

## Exporter des Passes

### Partager en PKPass

Exportez les passes pour les partager ou les sauvegarder :

1. Ouvrez le pass
2. Appuyez sur **Partager**
3. Sélectionnez **Exporter en PKPass**
4. Choisissez la destination (email, stockage cloud, etc.)

### Ajouter à Apple Wallet

Si vous utilisez également un iPhone :

1. Exportez le pass en PKPass
2. Envoyez-le à votre iPhone
3. Ouvrez le fichier pour l'ajouter à Apple Wallet

## Support des codes-barres

CardWallet supporte tous les formats de codes-barres utilisés dans les fichiers PKPass :

- **QR Code** - Format le plus courant
- **PDF417** - Utilisé pour les cartes d'embarquement
- **Aztec** - Code-barres 2D compact
- **Code 128** - Code-barres linéaire

### Afficher les codes-barres

Pour un scan facile sur place :

1. Ouvrez le pass
2. Appuyez sur le code-barres pour l'agrandir
3. Ajustez la luminosité de l'écran si nécessaire
4. Présentez au scanner

## Conseils d'utilisation

### Avant de voyager

- ✅ Importez les cartes d'embarquement avant d'arriver à l'aéroport
- ✅ Assurez-vous que votre téléphone est chargé
- ✅ Testez que le code-barres s'affiche correctement

### Aux événements

- ✅ Ouvrez le billet avant d'atteindre l'entrée
- ✅ Augmentez la luminosité de l'écran pour un meilleur scan
- ✅ Ayez une sauvegarde (capture d'écran ou copie imprimée)

### Pour les cartes de fidélité

- ✅ Gardez les cartes de magasin facilement accessibles
- ✅ Mettez à jour les passes quand les offres changent
- ✅ Vérifiez les dates d'expiration des coupons

## Dépannage

### Le pass ne s'importe pas

- Assurez-vous que le fichier a l'extension `.pkpass`
- Vérifiez que le fichier n'est pas corrompu
- Essayez de retélécharger le pass depuis la source

### Le code-barres ne scanne pas

- Augmentez la luminosité de l'écran au maximum
- Nettoyez votre écran
- Essayez de zoomer sur le code-barres
- Assurez-vous de tenir le téléphone stable

### Les informations du pass ne s'affichent pas

- Certains passes peuvent avoir des informations limitées
- Vérifiez le verso du pass pour plus de détails
- Contactez l'émetteur du pass si des informations manquent

## Confidentialité et sécurité

- Les passes sont stockés localement sur votre appareil
- Aucune donnée n'est envoyée à des serveurs externes
- Les informations sensibles dans les passes sont chiffrées
- Vous contrôlez quels passes conserver ou supprimer
