---
id: export
title: Exporter les Documents
sidebar_position: 4
slug: /export
---

# Exportation des Documents

OSS Document Scanner prend en charge plusieurs formats d'exportation et options de partage pour envoyer vos documents où vous en avez besoin.

![Options d'Exportation](/img/export-1.png)

## Formats d'Exportation

### Exportation PDF

Le format le plus polyvalent pour le partage de documents :

#### PDF Standard

- Contient les images numérisées comme pages
- Taille de fichier compacte
- Compatible universellement

#### PDF avec OCR (PDF Recherchable)

- Inclut une couche de texte invisible de l'OCR
- Le texte est recherchable et sélectionnable
- Idéal pour l'archivage

#### Paramètres PDF

Configurez les options d'exportation PDF :

| Paramètre | Description |
|-----------|-------------|
| Taille de Page | A4, Letter, Taille originale ou personnalisé |
| Orientation | Portrait, Paysage ou Auto |
| Marges | Aucune, Petite, Moyenne, Grande |
| Qualité | Basse, Moyenne, Élevée, Maximum |
| Compression | JPEG, PNG ou mixte |

### Exportation d'Images

Exportez comme fichiers images individuels :

#### JPEG

- Tailles de fichiers plus petites
- Qualité configurable (1-100%)
- Idéal pour les photos et documents en couleur
- Largement compatible

#### PNG

- Compression sans perte
- Tailles de fichiers plus grandes
- Idéal pour les documents textuels
- Supporte la transparence

#### Paramètres d'Image

| Paramètre | Description |
|-----------|-------------|
| Qualité | 1-100% (JPEG uniquement) |
| Résolution | Originale, 150 DPI, 300 DPI, 600 DPI |
| Espace Colorimétrique | Couleur, Niveaux de gris, Noir et Blanc |

### Autres Formats

#### TIFF

- Format d'archivage professionnel
- Options de compression sans perte
- Support multi-pages
- Tailles de fichiers plus grandes

## Méthodes d'Exportation

### Partager

Utilisez la feuille de partage système pour envoyer des documents :

1. Ouvrez le document
2. Appuyez sur **Partager**
3. Sélectionnez le format d'exportation
4. Choisissez l'application de destination

Compatible avec :
- Applications email
- Applications de messagerie
- Applications de stockage cloud
- Autres applications de documents

### Enregistrer sur l'Appareil

Enregistrez les exports sur le stockage local :

1. Ouvrez le document
2. Appuyez sur **Exporter**
3. Choisissez le format et les paramètres
4. Sélectionnez l'emplacement d'enregistrement
5. Appuyez sur **Enregistrer**

### Imprimer

Imprimez les documents directement :

1. Ouvrez le document
2. Appuyez sur **Imprimer**
3. Sélectionnez l'imprimante
4. Configurez les paramètres d'impression
5. Appuyez sur **Imprimer**

:::tip Conseils d'Impression
Pour de meilleurs résultats, exportez d'abord en PDF, puis imprimez. Cela garantit un formatage cohérent sur différentes imprimantes.
:::

## Exportation par Lots

Exportez plusieurs documents à la fois :

### Sélection des Documents

1. Allez à la liste des documents
2. Appuyez longuement pour entrer en mode sélection
3. Sélectionnez plusieurs documents
4. Appuyez sur **Exporter**

### Options de Lot

- **PDF Unique** : Combiner tous les documents en un seul PDF
- **PDF Séparés** : Exporter chaque document comme PDF individuel
- **Archive d'Images** : Exporter tout comme images dans un fichier ZIP
- **Images Individuelles** : Exporter chaque page comme image séparée

## Guide de Qualité d'Exportation

### Pour l'Impression

- Format : PDF
- Résolution : 300 DPI minimum
- Qualité : Élevée ou Maximum
- Couleur : Selon le type de document

### Pour l'Email

- Format : PDF (compressé) ou JPEG
- Résolution : 150 DPI
- Qualité : Moyenne
- Tenez compte des limites de taille de fichier

### Pour l'Archivage

- Format : PDF avec OCR ou TIFF
- Résolution : 300-600 DPI
- Qualité : Maximum
- Couleur : Originale

### Pour le Web

- Format : JPEG ou PDF
- Résolution : 150 DPI ou moins
- Qualité : Moyenne
- Optimisez pour la taille de fichier

## Nommage des Fichiers

### Nommage Automatique

Modèle de nommage par défaut : `Document_AAAA-MM-JJ_HHMMSS`

### Nommage Personnalisé

Personnalisez le modèle de nommage dans les paramètres :

- `{date}` - Date de capture
- `{time}` - Heure de capture
- `{index}` - Numéro séquentiel
- `{title}` - Titre du document

### Nommage par Lots

Pour les exports par lots :
- La numérotation séquentielle est ajoutée automatiquement
- Un préfixe personnalisé peut être spécifié

## Intégration Cloud

Export direct vers les services cloud (lorsque configurés) :

- Google Drive
- Dropbox
- OneDrive
- Serveurs WebDAV
- Stockage cloud personnalisé

Voir [Synchronisation et Sauvegarde](/sync-and-backup) pour les instructions de configuration.

## Dépannage

### PDF trop gros

- Réduisez le paramètre de qualité
- Utilisez la compression JPEG
- Diminuez la résolution
- Utilisez le Noir et Blanc pour les documents textuels

### Échec de l'exportation

- Vérifiez l'espace de stockage disponible
- Essayez un format différent
- Réduisez le nombre de pages
- Redémarrez l'application

### Problèmes de qualité

- Utilisez un paramètre de résolution plus élevé
- Choisissez PNG pour les documents textuels
- Assurez une bonne qualité de capture originale
- Appliquez les filtres appropriés avant l'exportation
