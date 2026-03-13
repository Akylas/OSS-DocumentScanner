---
id: sync-and-backup
title: Synchronisation et Sauvegarde
sidebar_position: 5
slug: /sync-and-backup
---

# Synchronisation et Sauvegarde

Gardez vos documents en sécurité et accessibles sur tous vos appareils grâce aux fonctionnalités de synchronisation et de sauvegarde d'OSS Document Scanner.

![Paramètres de Synchronisation](/img/sync-1.png)

## Options de Synchronisation

### Synchronisation WebDAV

Connectez-vous à n'importe quel serveur compatible WebDAV :

#### Services Supportés

- Nextcloud
- ownCloud
- NAS Synology
- NAS QNAP
- Tout serveur WebDAV

#### Configuration WebDAV

1. Allez dans **Paramètres** > **Synchronisation**
2. Sélectionnez **WebDAV**
3. Entrez les détails de votre serveur :
   - **URL du Serveur** : Votre point d'accès WebDAV
   - **Nom d'utilisateur** : Votre nom d'utilisateur de compte
   - **Mot de passe** : Votre mot de passe de compte
4. Appuyez sur **Tester la Connexion**
5. Sélectionnez le dossier de synchronisation
6. Activez la synchronisation

#### Configuration WebDAV

| Paramètre | Description |
|-----------|-------------|
| URL du Serveur | URL WebDAV complète (ex: `https://cloud.example.com/remote.php/webdav/`) |
| Nom d'utilisateur | Nom d'utilisateur du compte |
| Mot de passe | Mot de passe du compte ou token d'application |
| Dossier de Sync | Dossier distant pour les documents |

### Sauvegarde Locale

Créez des sauvegardes sur le stockage de l'appareil :

1. Allez dans **Paramètres** > **Sauvegarde**
2. Sélectionnez **Créer une Sauvegarde**
3. Choisissez l'emplacement de sauvegarde
4. La sauvegarde est créée comme archive ZIP

### Restauration depuis une Sauvegarde

1. Allez dans **Paramètres** > **Sauvegarde**
2. Sélectionnez **Restaurer la Sauvegarde**
3. Choisissez le fichier de sauvegarde
4. Confirmez la restauration (les documents existants peuvent être écrasés)

## Comportement de la Synchronisation

### Synchronisation Automatique

Lorsqu'elle est activée, les documents se synchronisent automatiquement :

- À la création du document
- À la modification du document
- Au lancement de l'application (configurable)
- Périodiquement en arrière-plan (si autorisé)

### Synchronisation Manuelle

Déclenchez la synchronisation manuellement :

1. Tirez vers le bas sur la liste des documents pour actualiser
2. Ou allez dans **Paramètres** > **Synchronisation** > **Synchroniser Maintenant**

### Direction de la Synchronisation

Configurez le comportement de la synchronisation :

| Mode | Description |
|------|-------------|
| Bidirectionnel | Les modifications se synchronisent dans les deux sens |
| Envoi uniquement | Envoi uniquement des modifications vers le serveur |
| Réception uniquement | Réception uniquement des modifications du serveur |

## Gestion des Conflits

Lorsque le même document est modifié sur plusieurs appareils :

### Résolution Automatique

L'application tente de résoudre les conflits automatiquement :

1. Comparer les horodatages de modification
2. La modification la plus récente l'emporte
3. L'ancienne version peut être archivée

### Résolution Manuelle

Pour les conflits complexes :

1. Une notification apparaît concernant le conflit
2. Visualisez les deux versions
3. Choisissez laquelle garder :
   - **Garder Local** : Utiliser la version de votre appareil
   - **Garder Distant** : Utiliser la version du serveur
   - **Garder les Deux** : Créer une copie de chaque

### Prévention des Conflits

- Synchronisez fréquemment
- Évitez de modifier le même document sur plusieurs appareils simultanément
- Utilisez des dossiers différents pour différents appareils

## Configuration du Stockage Cloud

### Nextcloud

1. Connectez-vous à votre instance Nextcloud
2. Allez dans **Paramètres** > **Sécurité** > **Appareils et sessions**
3. Créez un mot de passe d'application pour OSS Document Scanner
4. Dans l'application, entrez :
   - URL : `https://votre-nextcloud.com/remote.php/webdav/`
   - Utilisez le mot de passe d'application au lieu du mot de passe principal

### NAS Synology

1. Activez le paquet Serveur WebDAV sur votre NAS
2. Configurez HTTPS (recommandé)
3. Dans l'application, entrez :
   - URL : `https://ip-de-votre-nas:5006/` (ou port personnalisé)
   - Utilisez vos identifiants de compte Synology

### WebDAV Générique

1. Assurez-vous que WebDAV est activé sur votre serveur
2. Notez l'URL du point d'accès WebDAV
3. Créez des identifiants si nécessaire
4. Testez la connexion dans les paramètres de l'application

## Bonnes Pratiques de Sauvegarde

### Sauvegardes Régulières

- Planifiez des sauvegardes locales régulières
- Stockez les sauvegardes dans plusieurs emplacements
- Testez le processus de restauration périodiquement

### Ce Qui Est Inclus

Les sauvegardes contiennent :

- Tous les documents numérisés (images)
- Métadonnées des documents
- Structure des dossiers
- Paramètres de l'application (optionnel)
- Données OCR (optionnel)

### Ce Qui N'est PAS Inclus

- Fichiers cache
- Fichiers temporaires
- Identifiants de synchronisation (pour la sécurité)

## Sécurité des Données

### Chiffrement

- Les identifiants sont stockés de manière sécurisée en utilisant le trousseau de la plateforme
- Les données en transit utilisent HTTPS (lorsque configuré)
- Le stockage local utilise le chiffrement de l'appareil

### Confidentialité

- Aucune donnée envoyée à des tiers
- Synchronisation uniquement vers les serveurs que vous configurez
- Tout le traitement se fait sur l'appareil

## Dépannage

### Échec de Connexion

- Vérifiez que l'URL du serveur est correcte
- Vérifiez le nom d'utilisateur et le mot de passe
- Assurez-vous que le serveur est accessible
- Essayez de désactiver le VPN si actif
- Vérifiez les paramètres du pare-feu

### La Synchronisation ne Démarre Pas

- Vérifiez la connexion Internet
- Vérifiez que la synchronisation est activée
- Vérifiez les restrictions des applications en arrière-plan
- Examinez les paramètres d'optimisation de la batterie

### Les Conflits Persistent

- Synchronisez plus fréquemment
- Vérifiez que les horloges des appareils sont correctes
- Évitez les modifications simultanées
- Utilisez le mode envoi uniquement sur les appareils secondaires

### Problèmes de Restauration de Sauvegarde

- Assurez-vous que le fichier de sauvegarde n'est pas corrompu
- Vérifiez l'espace de stockage disponible
- Essayez de restaurer sur une installation fraîche
- Vérifiez que la sauvegarde a été créée avec succès
