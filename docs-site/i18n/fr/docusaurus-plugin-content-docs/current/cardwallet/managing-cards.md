---
id: managing-cards
title: Gérer les Cartes
sidebar_position: 3
slug: /cardwallet/managing-cards
---

# Gérer les Cartes

Apprenez à organiser, éditer et utiliser efficacement vos cartes numériques.

## Détails de la Carte

Chaque carte peut inclure :

- **Nom** : Le nom de la carte ou du magasin
- **Code-Barres** : Le code-barres scanné ou saisi
- **Notes** : Informations supplémentaires, numéros de membre, etc.
- **Couleur** : Couleur personnalisée pour une identification facile
- **Catégorie** : Grouper les cartes par type

## Éditer les Cartes

### Modifier les Informations de la Carte

1. Ouvrez la carte que vous voulez éditer
2. Appuyez sur le bouton **Éditer**
3. Mettez à jour les détails de la carte
4. Enregistrez vos modifications

### Changer la Couleur de la Carte

1. Éditez la carte
2. Appuyez sur le sélecteur de couleur
3. Sélectionnez une nouvelle couleur
4. Le fond de la carte sera mis à jour

### Ajouter des Notes

Stockez des informations utiles avec vos cartes :

- Numéros de membre
- Identifiants de compte
- Points de fidélité
- Dates d'expiration
- Emplacements des magasins

## Organiser les Cartes

### Catégories

Organisez les cartes en catégories :

- **Cartes de Fidélité** : Programmes de récompenses des magasins
- **Adhésions** : Gym, clubs
- **Cartes Cadeaux** : Crédits magasin et cartes cadeaux
- **Billets** : Événements, pass de transport
- **Autres** : Cartes diverses

### Options de Tri

Triez vos cartes par :

- **Nom** : Alphabétiquement
- **Récemment Utilisé** : Plus utilisées en premier
- **Récemment Ajouté** : Plus récentes en premier
- **Ordre Personnalisé** : Glisser-déposer

### Recherche

Trouvez rapidement des cartes avec la fonction de recherche :

1. Appuyez sur l'icône de recherche
2. Tapez le nom de la carte ou du magasin
3. Les résultats se filtrent pendant que vous tapez

## Utiliser les Cartes

### Afficher une Carte

1. Appuyez sur la carte dans votre liste
2. Le code-barres s'affiche en plein écran
3. Ajustez la luminosité si nécessaire
4. Présentez au scanner

### Accès Rapide

Pour les cartes fréquemment utilisées :

- **Widgets** : Ajoutez des cartes à votre écran d'accueil (Android)
- **Favoris** : Marquez les cartes d'une étoile pour un accès rapide
- **Récentes** : Les cartes récemment utilisées apparaissent en premier

### Boost de Luminosité

Lors de l'affichage d'un code-barres :

- La luminosité de l'écran augmente automatiquement
- Cela aide les scanners à lire le code
- La luminosité revient à la normale quand vous quittez

## Opérations en Lot

### Sélectionner Plusieurs Cartes

1. Appuyez longuement sur une carte pour démarrer la sélection
2. Appuyez sur des cartes supplémentaires pour les ajouter à la sélection
3. Utilisez la barre d'actions pour les opérations en lot

### Actions en Lot

- **Supprimer** : Supprimer plusieurs cartes à la fois
- **Déplacer** : Changer la catégorie de plusieurs cartes
- **Exporter** : Exporter les cartes sélectionnées

## Sauvegarde et Restauration

### Sauvegarde Locale

1. Allez dans Paramètres > Sauvegarde
2. Appuyez sur **Créer une Sauvegarde**
3. Choisissez l'emplacement de sauvegarde
4. Le fichier de sauvegarde est créé

### Restaurer depuis une Sauvegarde

1. Allez dans Paramètres > Sauvegarde
2. Appuyez sur **Restaurer la Sauvegarde**
3. Sélectionnez votre fichier de sauvegarde
4. Les cartes sont restaurées

### Synchronisation Cloud

Pour une sauvegarde automatique, voir [Synchronisation et Sauvegarde](/sync-and-backup).

## Partager les Cartes

### Partager une Carte

1. Ouvrez la carte
2. Appuyez sur le bouton **Partager**
3. Choisissez comment partager :
   - Comme image
   - Comme texte (numéro du code-barres)

### Importer des Cartes Partagées

1. Recevez les données de carte partagées
2. Ouvrez dans CardWallet
3. Vérifiez et enregistrez la carte

## Confidentialité et Sécurité

### Stockage des Données

- Toutes les données de carte sont stockées localement sur votre appareil
- Aucune donnée n'est envoyée à des serveurs externes
- La synchronisation cloud est optionnelle et utilise votre propre serveur

### Cartes Sensibles

Pour les cartes contenant des informations sensibles :

- Utilisez la fonction de verrouillage de l'app
- Ne stockez pas de codes PIN ou mots de passe dans les notes
- Soyez prudent lors du partage

## Référence du Code Source

La gestion des cartes est implémentée dans :

| Fonctionnalité | Emplacement |
|----------------|-------------|
| Interface Liste de Cartes | `app/components/list/CardsList.svelte` |
| Cellule de Carte | `app/components/list/CardListCell.svelte` |
| Service QR Code | `app/services/qrcode.ts` |
| Stockage | `app/services/documents.ts` |

## Astuces et Conseils

### Organiser par Couleur

Utilisez des couleurs cohérentes pour les types de cartes :
- 🔵 Bleu pour l'épicerie
- 🟢 Vert pour les cafés
- 🔴 Rouge pour les restaurants
- 🟡 Jaune pour le divertissement

### Ajout Rapide

Double-appuyez sur le bouton + pour scanner rapidement sans boîtes de dialogue de confirmation.

### Sauvegardez Régulièrement

Configurez la synchronisation cloud ou créez des sauvegardes régulières pour éviter de perdre vos cartes.
