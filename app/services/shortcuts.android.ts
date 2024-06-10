// Android documentation says that no more than 5 shortcuts
// are supported. However, that may be too many, as not all
// launcher will show all 5. Instead, the number is limited
// to 3 here, so that the most recent shortcut has a good

import { Utils, path } from '@nativescript/core';
import { OCRDocument } from '~/models/OCRDocument';
import { documentsService } from '~/services/documents';
import { loadImage, recycleImages } from '~/utils/images';
import { getTransformedImage } from './pdf/PDFExportCanvas.common';
import { DEFAULT_EXPORT_DIRECTORY } from '~/utils/constants';

// chance of being shown.
const MAX_SHORTCUTS = 3;

// https://developer.android.com/reference/android/graphics/drawable/AdaptiveIconDrawable.html
const ADAPTIVE_BITMAP_SCALE = 1;
const ADAPTIVE_BITMAP_SIZE = 108 * ADAPTIVE_BITMAP_SCALE;
const ADAPTIVE_BITMAP_VISIBLE_SIZE = 72 * ADAPTIVE_BITMAP_SCALE;
const ADAPTIVE_BITMAP_IMAGE_SIZE = ADAPTIVE_BITMAP_VISIBLE_SIZE + 5 * ADAPTIVE_BITMAP_SCALE;
// const PADDING_COLOR_OVERLAY = '#00000088';
let ShortcutManagerCompat: typeof androidx.core.content.pm.ShortcutManagerCompat;
let ShortcutInfoCompat: typeof androidx.core.content.pm.ShortcutInfoCompat;
if (CARD_APP) {
    ShortcutManagerCompat = androidx.core.content.pm.ShortcutManagerCompat;
    ShortcutInfoCompat = androidx.core.content.pm.ShortcutInfoCompat;
}
export default class ShortcutsService {
    imagesToRecycle = [];
    /**
     * Add a card to the app shortcuts, and maintain a list of the most
     * recently used cards. If there is already a shortcut for the card,
     * the card is marked as the most recently used card. If adding this
     * card exceeds the max number of shortcuts, then the least recently
     * used card shortcut is discarded.
     */
    async updateShortcuts(document: OCRDocument) {
        // TODO: try to run this in the thread
        const context = Utils.android.getApplicationContext();
        // if (document.archiveStatus == 1) {
        //     // Don't add archived card to menu
        //     return;
        // }
        const shortcutId = document.id;

        const nlist = ShortcutManagerCompat.getDynamicShortcuts(context);
        const list: androidx.core.content.pm.ShortcutInfoCompat[] = [];
        for (let index = 0; index < nlist.size(); index++) {
            list.push(nlist.get(index));
        }

        // Sort the shortcuts by rank, so working with the relative order will be easier.
        // This sorts so that the lowest rank is first.
        list.sort((a, b) => a.getRank() - b.getRank());
        // java.util.Collections.sort(nlist, java.util.Comparator.comparingInt(ShortcutInfoCompat.class['getRank']));

        const foundIndex = list.findIndex((d) => d.getId() === shortcutId);

        if (foundIndex !== -1) {
            // If the item is already found, then the list needs to be
            // reordered, so that the selected item now has the lowest
            // rank, thus letting it survive longer.
            list.splice(foundIndex, 1);
        }
        list.unshift((await this.createShortcutBuilder(context, document)).build());

        const finalList = new java.util.LinkedList<androidx.core.content.pm.ShortcutInfoCompat>();
        let rank = 0;

        // The ranks are now updated; the order in the list is the rank.
        finalList.addLast(list[0]);
        for (let index = 1; index < list.length; index++) {
            const prevShortcut = list[index];
            const prevDocument = await documentsService.documentRepository.get(prevShortcut.getId());

            // skip outdated that no longer exist
            if (prevShortcut) {
                const updatedShortcut = (await this.createShortcutBuilder(context, prevDocument)).setRank(rank).build();
                finalList.addLast(updatedShortcut);
                rank++;

                // trim the list
                if (rank >= MAX_SHORTCUTS) {
                    break;
                }
            }
        }

        const result = ShortcutManagerCompat.setDynamicShortcuts(context, finalList);

        recycleImages(this.imagesToRecycle);
        this.imagesToRecycle = [];
    }

    /**
     * Remove the given card id from the app shortcuts, if such a
     * shortcut exists.
     */
    removeShortcut(context, documentId) {
        ShortcutManagerCompat.removeDynamicShortcuts(context, java.util.Collections.singletonList(documentId));
    }

    async createShortcutBuilder(context, document: OCRDocument) {
        const intent = new android.content.Intent().setClassName(context, 'com.akylas.cardwallet.MainActivity');
        intent.setAction(android.content.Intent.ACTION_MAIN);
        // Prevent instances of the view activity from piling up; if one exists let this
        // one replace it.
        intent.setFlags(intent.getFlags() | android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP);
        const bundle = new android.os.Bundle();
        bundle.putString('id', document.id);
        bundle.putBoolean('view', true);
        intent.putExtras(bundle);

        // Bitmap iconBitmap = Utils.retrieveCardImage(context, loyaltyCard.id, ImageLocationType.icon);
        // if (iconBitmap == null) {
        //     iconBitmap = Utils.generateIcon(context, loyaltyCard, true).getLetterTile();
        // } else {
        //     iconBitmap = createAdaptiveBitmap(iconBitmap, Utils.getHeaderColor(context, loyaltyCard));
        // }

        // IconCompat icon = IconCompat.createWithAdaptiveBitmap(iconBitmap);
        const page = document.pages[0];
        let width = page.width;
        let height = page.height;
        const ratio = width / height;
        if (ratio > 1) {
            width = ADAPTIVE_BITMAP_SIZE * ratio;
            height = ADAPTIVE_BITMAP_SIZE;
        } else {
            width = ADAPTIVE_BITMAP_SIZE;
            height = ADAPTIVE_BITMAP_SIZE / ratio;
        }
        const image = await getTransformedImage(page, { width: ADAPTIVE_BITMAP_SIZE, height: ADAPTIVE_BITMAP_SIZE }, { width, height });
        this.imagesToRecycle.push(image);
        const icon = androidx.core.graphics.drawable.IconCompat.createWithAdaptiveBitmap(image.android);
        return new ShortcutInfoCompat.Builder(context, document.id).setShortLabel(document.name).setLongLabel(document.name).setIntent(intent).setIcon(icon);
    }
}
export const shortcutService = new ShortcutsService();
