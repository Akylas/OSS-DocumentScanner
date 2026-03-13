---
id: settings
title: Paramètres
sidebar_position: 6
slug: /settings
---

# Paramètres

Configurez OSS Document Scanner et OSS CardWallet selon vos préférences et votre flux de travail.

![Écran des Paramètres](/img/settings-1.png)

:::tip Clés de Traduction
Les noms et descriptions des paramètres utilisent des clés de traduction du système i18n de l'application (`app/i18n/`). Cela garantit que la documentation reste synchronisée avec l'interface de l'application.
:::

## Paramètres Généraux

### Langue
<!-- Clé de traduction : language -->
Changez la langue de l'interface de l'application.

1. Allez dans **Paramètres** > **Langue**
2. Sélectionnez votre langue préférée
3. L'application redémarre avec la nouvelle langue

Les langues supportées incluent l'anglais, le français, l'allemand, l'espagnol et [bien d'autres contribuées via Weblate](https://hosted.weblate.org/engage/oss-document-scanner/).

### Apparence
<!-- Clés de traduction : appearance, appearance_settings -->
Thème et autres paramètres d'apparence.

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Thème | `theme.title` | Choisir Clair, Sombre, Noir ou Auto (système) |
| Thème de Couleur | `color_theme.title` | Par défaut, Couleurs dynamiques ou E-ink |
| Noir Automatique | `auto_black` | Utiliser le noir pur pour le thème sombre automatique |
| Colonnes | `nb_columns` | Nombre de colonnes dans les listes de documents (1-7) |
| Colonnes (Paysage) | `nb_columns_landscape` | Nombre de colonnes en mode paysage |
| Colonnes Vue Document | `nb_columns_view` | Nombre de colonnes dans la vue document |
| Colonnes Vue Document (Paysage) | `nb_columns_view_landscape` | Nombre de colonnes dans la vue document en paysage |

**Spécifique Android :**

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Afficher la Tuile Paramètres Rapides | `show_quicksettings_tile` | Afficher une tuile Paramètres Rapides pour ouvrir l'app directement depuis le volet de notifications |

**Spécifique CardWallet :**

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Forcer le Fond Blanc QRCode | `force_white_background_qrcode` | Certains lecteurs ne peuvent pas lire les QRCode noirs sur fond blanc |

## Paramètres de Sécurité
<!-- Clés de traduction : security, security_settings -->

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Autoriser les Captures d'Écran | `allow_app_screenshot` | Autoriser les captures d'écran de l'application (Android uniquement) |
| Verrouillage Biométrique | `biometric_lock` | Verrouiller l'application avec la biométrie / code PIN |
| Verrouillage Auto Biométrique | `biometric_auto_lock` | Si activé, l'app se verrouille quand elle passe en arrière-plan |

## Paramètres de Données
<!-- Clés de traduction : data, data_settings -->
Paramètres de stockage et de données.

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Emplacement de Stockage | `storage_location` | Choisir entre Stockage Interne ou Carte SD |

:::warning
Déplacer des données entre emplacements de stockage redémarrera l'application et déplacera tous vos documents.
:::

## Paramètres de l'Appareil Photo
<!-- Clés de traduction : camera, camera_settings -->

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Utiliser l'Appareil Photo Système | `use_system_camera` | Utiliser l'appareil photo système au lieu de la vue de l'app (Android uniquement). Quand activé, certaines fonctionnalités comme le lot ou l'auto-scan seront désactivées |
| Démarrer l'App sur l'Appareil Photo | `start_app_on_cam` | L'app démarrera toujours sur l'appareil photo. Changer ce paramètre nécessite un redémarrage de l'app |
| Miroir Caméra Frontale | `front_cam_mirrored` | Si l'aperçu de la caméra frontale doit être en miroir |

## Paramètres de Détection de Document
<!-- Clés de traduction : document_detection, document_detection_settings -->

| Paramètre | Clé de Traduction | Description | Par Défaut |
|-----------|-------------------|-------------|------------|
| Recadrage Activé | `crop_enabled` | Détecter les bords du document et recadrer | Activé |
| Toujours Demander l'Édition du Recadrage | `always_prompt_crop_edit` | Lors de la capture sans mode lot, toujours demander de confirmer/éditer la région du document avant de créer le document | Désactivé |
| Seuil de Redimensionnement de l'Aperçu | `preview_resize_threshold` | Taille à laquelle l'image de la caméra est redimensionnée pour détecter les documents. Plus grand signifie meilleure détection mais plus lent | - |
| Marge Document Non Détecté | `document_not_detected_margin` | Si aucun document n'est trouvé, les coins sont définis à la taille de l'image avec une légère marge | - |
| Sensibilité de la Loupe | `magnifier_sensitivity` | Sensibilité du glissement des coins. 1 signifie aussi rapide que le mouvement de votre doigt | 0.5 |

## Paramètres Auto Scan
<!-- Clés de traduction : autoscan, autoscan_settings -->

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Auto Scan | `auto_scan` | Découvrir et ajouter des documents automatiquement |
| Seuil de Distance | `auto_scan_distance_threshold` | Quand la caméra bouge, l'auto scan doit déterminer si on voit toujours le même document. C'est le seuil de distance |
| Durée Auto Scan | `auto_scan_duration` | Durée en millisecondes avant que le document soit ajouté |
| Délai Auto Scan | `auto_scan_delay` | Délai avant de démarrer l'auto scan sur un document découvert |

## Paramètres OCR
<!-- Clés de traduction : ocr, ocr_settings -->
Paramètres de Reconnaissance Optique de Caractères pour la détection de texte dans les documents numérisés.

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| OCR Activé | `ocr_enabled` | L'OCR sera déclenché à chaque modification de document en utilisant les langues sélectionnées |
| Langues OCR | `languages` | Sélectionner les langues à utiliser pour la détection de texte. Téléchargez les modèles de langue si nécessaire |

### Fonctionnalités OCR

- **Détecter le Texte** (`ocr_document`) : Détecter et extraire automatiquement le texte des documents numérisés
- **Détecter et Copier** (`ocr_copy_text`) : Détecter rapidement le texte et le copier dans le presse-papiers
- **Texte OCR Transparent dans le PDF** (`draw_ocr_text`) : Ajouter une couche de texte recherchable dans les PDF exportés

:::info
Les modèles OCR doivent être téléchargés avant utilisation. L'application vous demandera de télécharger les modèles de langue manquants si nécessaire.
:::

## Paramètres de Nommage des Documents
<!-- Clés de traduction : document_naming_template, document_naming_settings -->
Paramètres liés au nom des documents et des images/PDF exportés.

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Format de Date du Nom de Document | `document_name_date_format` | Le nom du document est créé basé sur la date de création. Cela vous permet de changer le format |
| Utiliser le Nom du Document | `filename_use_document_name` | Utiliser le nom du document quand possible pour les fichiers exportés |
| Format de Date du Nom de Fichier | `filename_date_format` | Le nom du fichier exporté est basé sur l'heure actuelle. Cela vous permet de changer le format |

### Syntaxe du Format de Date

Vous pouvez utiliser :
- `ISO` pour le format ISO 8601
- `timestamp` pour epoch (durée en ms depuis 1970)
- Format personnalisé utilisant le [format Day.js](https://day.js.org/docs/en/display/format)

## Paramètres d'Import PDF
<!-- Clés de traduction : pdf_import, pdf_import_settings -->

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Mode d'Import d'Images PDF | `import_pdf_images` | Choisir comment importer les images d'un PDF |

**Modes d'Import :**
- **Demander à Chaque Fois** (`ask_everytime`) - Demander pour chaque PDF
- **Page comme Image** (`pdf_one_image_per_page`) - Chaque page comme une image
- **Trouver les Images PDF** (`pdf_one_image_per_pdf_image`) - Trouver les images PDF et les importer (les autres données comme le texte ne seront pas importées)

## Paramètres d'Export PDF
<!-- Clés de traduction : pdf_export, pdf_export_settings -->

### Options PDF Générales

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Dossier d'Export | `export_folder` | Dossier où écrire les fichiers exportés (Android uniquement) |
| Mot de Passe PDF | `optional_pdf_password` | Protection optionnelle par mot de passe pour les PDF exportés |

### Options de Mise en Page

| Paramètre | Clé de Traduction | Options |
|-----------|-------------------|---------|
| Taille du Papier | `paper_size` | A4, A3, Letter, Pleine |
| Orientation de la Page | `orientation` | Portrait, Paysage, Auto |
| Éléments par Page | `items_per_page` | Nombre de pages par feuille (1, 2, 4, etc.) |
| Marge de Page | `page_padding` | Marges autour des pages |

### Paramètres d'Image dans le PDF

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Seuil de Taille d'Image | `image_size_threshold` | Les images insérées dans le PDF avec largeur/hauteur supérieure seront redimensionnées |
| Échelle de Chargement d'Image | `image_load_scale` | Échelle appliquée aux images insérées dans le PDF (0.5 - 10) |
| Qualité JPEG | `jpeg_quality` | Niveau de compression JPG pour le PDF exporté (0-100). Mettre à 0 pour désactiver la compression JPG |
| Dessiner le Texte OCR | `draw_ocr_text` | Ajouter une couche de texte OCR transparent dans le PDF |

## Paramètres d'Image
<!-- Clés de traduction : image_settings, image_settings_desc -->
Tous les paramètres liés aux images.

| Paramètre | Clé de Traduction | Description | Options |
|-----------|-------------------|-------------|---------|
| Format d'Image | `image_format` | Format d'image à utiliser dans toute l'application | PNG (meilleure qualité, taille plus grande), JPEG |
| Qualité d'Image | `image_quality` | Qualité de compression (0-100) utilisée pour les images JPG | 0-100 |

## Paramètres des Opérations
<!-- Clés de traduction : operations, operations_settings_desc -->
Paramètres liés aux opérations appliquées sur les images.

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Opérations Parallèles | `transformer_batch_size` | Nombre d'images à transformer en parallèle (1-10). Plus c'est plus rapide mais pourrait faire planter l'app à cause de l'utilisation mémoire |
| Paramètres de Traitement d'Image | `image_processing_settings` | Définir les transformations, luminosité, contraste qui seront appliqués à chaque nouvelle numérisation |

## Paramètres des Dossiers
<!-- Clés de traduction : folders, folders_settings_desc -->

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Utiliser la Couleur comme Fond | `folder_color_as_background` | Quand activé, la couleur du dossier sera utilisée comme couleur de fond. Sinon elle sera utilisée pour la petite icône du dossier |

## Paramètres de Synchronisation
<!-- Clés de traduction : sync, sync_settings_desc -->
Paramètres de synchronisation.

| Paramètre | Clé de Traduction | Description |
|-----------|-------------------|-------------|
| Sync au Démarrage | `sync_on_start` | L'application doit-elle essayer de synchroniser les documents au démarrage |

### Services de Synchronisation

| Service | Clé de Traduction | Description |
|---------|-------------------|-------------|
| Sync des Données App | `data_sync` | Synchroniser les données de l'app pour utiliser l'app sur plusieurs appareils |
| Sync des Images | `image_sync` | Synchroniser les images des documents avec les filtres et transformations appliqués |
| Sync PDF | `pdf_sync` | Synchroniser les PDF des documents avec les paramètres, filtres et transformations appliqués |

Voir [Synchronisation et Sauvegarde](/sync-and-backup) pour les instructions détaillées de configuration.

## Sauvegarde / Restauration
<!-- Clés de traduction : backup_restore -->

| Action | Clé de Traduction | Description |
|--------|-------------------|-------------|
| Exporter les Paramètres | `export_settings` | Exporter tous les paramètres de l'application pour les importer plus tard |
| Importer les Paramètres | `import_settings` | Importer tous les paramètres d'une sauvegarde précédente |

## Autres Paramètres

### Bibliothèques Tierces
<!-- Clé de traduction : third_parties -->
Voir la liste des bibliothèques tierces utilisées dans l'application.

### Évaluer l'Application
<!-- Clé de traduction : review_application -->
Laisser un avis sur l'app store (versions Play Store uniquement).

## Référence des Clés de Traduction

Tous les paramètres utilisent des clés de traduction de `app/i18n/en.json`. Lors de la contribution à la documentation, référencez ces clés pour assurer la précision :

```json
{
  "auto_scan": "découvrir et ajouter des documents automatiquement",
  "crop_enabled": "détecter les bords du document et recadrer",
  "biometric_lock": "Sécurité biométrique",
  "sync_on_start": "synchroniser au démarrage",
  "image_format": "format d'image",
  "image_quality": "qualité d'image",
  "pdf_export": "export PDF",
  "transformer_batch_size": "opérations parallèles",
  "front_cam_mirrored": "caméra frontale en miroir",
  "show_quicksettings_tile": "afficher la tuile Paramètres Rapides",
  "ocr_enabled": "OCR Activé",
  "ocr_copy_text": "Détecter et copier"
}
```

Cela aide à garder la documentation synchronisée avec l'interface réelle de l'application.
