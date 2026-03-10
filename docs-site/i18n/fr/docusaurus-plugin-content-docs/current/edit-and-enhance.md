---
id: edit-and-enhance
title: Édition et Amélioration
sidebar_position: 3
slug: /edit-and-enhance
---

# Édition et Amélioration des Documents

Après avoir capturé un document, OSS Document Scanner fournit des outils d'édition complets pour perfectionner vos numérisations.

![Écran d'Édition](/img/edit-1.png)

## Recadrage et Rotation

### Recadrage Manuel

Affinez les limites du document après la capture :

1. Ouvrez la vue d'édition pour une page numérisée
2. Sélectionnez l'outil **Recadrer**
3. Faites glisser les poignées de coin pour ajuster la zone du document
4. Faites glisser les points médians des bords pour des ajustements précis
5. Utilisez la grille superposée pour l'alignement
6. Appuyez sur **Appliquer** pour enregistrer les modifications

### Rotation

Corrigez l'orientation du document :

- **Rotation 90°** : Appuyez sur le bouton de rotation pour tourner par incréments de 90°
- **Auto-rotation** : L'application tente de détecter l'orientation correcte
- **Rotation libre** : Pour les documents légèrement inclinés, utilisez le curseur de rotation

### Correction de Perspective

L'application applique automatiquement la correction de perspective basée sur les bords détectés du document. Cela garantit :

- Les bords parallèles apparaissent parallèles
- Les documents rectangulaires apparaissent rectangulaires
- Les lignes de texte sont redressées

## Filtres d'Image

Appliquez des filtres pour améliorer la lisibilité du document :

### Noir et Blanc

Convertit en noir et blanc pur (binaire) :

- Idéal pour les documents textuels
- Taille de fichier la plus petite
- Meilleur pour le traitement OCR
- Seuil ajustable pour des résultats optimaux

### Niveaux de Gris

Supprime la couleur tout en préservant la gamme tonale :

- Bon pour les documents avec des diagrammes
- Taille de fichier plus petite que la couleur
- Apparence naturelle

### Couleur Améliorée

Améliore les documents en couleur :

- Balance des blancs automatique
- Amélioration du contraste
- Ajustement de la saturation des couleurs

### Original

Garde l'image telle que capturée :

- Préservation complète des couleurs
- Aucun traitement appliqué
- Taille de fichier la plus grande

### Amélioration Document

Amélioration intelligente pour les documents :

- Suppression des ombres
- Correction de l'éclairage inégal
- Netteté des bords
- Nettoyage du fond

## Ajustements Avancés

### Luminosité et Contraste

Affinez l'apparence de l'image :

1. Appuyez sur **Ajuster** dans la barre d'outils d'édition
2. Utilisez les curseurs pour ajuster :
   - **Luminosité** : Éclaircir ou assombrir l'image
   - **Contraste** : Augmenter ou diminuer la gamme tonale
3. Prévisualisez les modifications en temps réel
4. Appuyez sur **Appliquer** pour enregistrer

### Seuil (mode Noir et Blanc)

Contrôlez le point de coupure noir/blanc :

- Seuil plus bas : Plus de blanc, texte plus clair
- Seuil plus élevé : Plus de noir, texte plus gras
- Ajustable pour différents types de documents

## OCR (Reconnaissance Optique de Caractères)

Extrayez le texte des documents numérisés :

### Exécuter l'OCR

1. Ouvrez une page de document
2. Appuyez sur le bouton **OCR**
3. Sélectionnez la ou les langues du texte
4. Attendez la fin du traitement
5. Visualisez et copiez le texte extrait

### Détecter et Copier

Pour une extraction de texte rapide :

1. Ouvrez une page de document
2. Utilisez **Détecter et Copier** (`ocr_copy_text`) pour détecter rapidement le texte et le copier dans le presse-papiers
3. Le texte est automatiquement copié sans ouvrir la vue OCR complète

### Fonctionnalités OCR

- **Support multi-langues** : L'OCR fonctionne avec de nombreuses langues
- **Copier le texte** : Copiez le texte extrait dans le presse-papiers
- **Recherche** : Recherchez dans le texte extrait
- **Export** : Incluez le texte OCR dans les exports PDF
- **OCR transparent dans le PDF** : Ajoutez une couche de texte recherchable aux PDF exportés

### Conseils OCR

- Utilisez le filtre **Noir et Blanc** pour de meilleurs résultats
- Assurez une bonne qualité de capture
- Sélectionnez les bonnes langues
- Pour l'écriture manuscrite, les résultats peuvent varier
- Téléchargez les modèles de langue depuis **Paramètres** > **OCR** avant utilisation

:::note Traitement OCR
L'OCR utilise Tesseract pour la reconnaissance de texte. Le traitement se fait sur l'appareil pour la confidentialité. Voir `app/services/ocr.ts` pour les détails d'implémentation.
:::

## Gestion des Pages

### Réorganisation des Pages

Dans les documents multi-pages :

1. Ouvrez la vue du document
2. Appuyez sur le bouton **Réorganiser les Pages** (`reorder_pages`) dans la barre d'outils
3. Appuyez longuement sur une vignette de page
4. Faites glisser vers la nouvelle position
5. Relâchez pour déposer
6. Appuyez sur **Terminé** pour enregistrer le nouvel ordre

### Suppression de Pages

Supprimez les pages non désirées :

1. Ouvrez la vue du document
2. Sélectionnez les pages à supprimer (appuyez sur les vignettes)
3. Appuyez sur le bouton **Supprimer**
4. Confirmez la suppression

### Ajout de Pages

Ajoutez plus de pages aux documents existants :

1. Ouvrez le document
2. Appuyez sur **Ajouter une Page**
3. Capturez de nouvelles pages
4. Les pages sont ajoutées au document

### Division de Documents

Séparez un document multi-pages :

1. Ouvrez la vue du document
2. Sélectionnez les pages à extraire
3. Appuyez sur **Diviser** dans le menu
4. Un nouveau document est créé avec les pages sélectionnées

## Référence du Code Source

La fonctionnalité d'édition est implémentée dans :

| Fonctionnalité | Emplacement |
|----------------|-------------|
| Composants UI d'Édition | `app/components/edit/` |
| Traitement d'Images | `opencv/` et `cpp/src/` |
| Filtres/Transformations | `plugin-nativeprocessor/` |
| Service OCR | `app/services/ocr.ts` |
| Service Documents | `app/services/documents.ts` |

## Bonnes Pratiques

### Pour les Documents Textuels

1. Utilisez le filtre **Noir et Blanc**
2. Assurez un contraste élevé
3. Exécutez l'OCR pour des PDF recherchables
4. Utilisez la correction de perspective

### Pour les Photos/Diagrammes

1. Utilisez **Niveaux de Gris** ou **Couleur Améliorée**
2. Ajustez la luminosité/contraste si nécessaire
3. Gardez la résolution originale

### Pour les Reçus

1. Utilisez **Amélioration Document**
2. Appliquez la suppression des ombres
3. Augmentez légèrement le contraste
4. Envisagez le Noir et Blanc pour les reçus décolorés
