# NativeScript Label widget

[![npm downloads](https://img.shields.io/npm/dm/nativescript-htmllabel.svg)](https://www.npmjs.com/package/nativescript-htmllabel)
[![npm downloads](https://img.shields.io/npm/dt/nativescript-htmllabel.svg)](https://www.npmjs.com/package/nativescript-htmllabel)
[![npm](https://img.shields.io/npm/v/nativescript-htmllabel.svg)](https://www.npmjs.com/package/nativescript-htmllabel)

A NativeScript Label widget. It is a direct replacement for the {N} Label widget.

## Installation

Run the following command from the root of your project:

`tns plugin add @nativescript-community/ui-label`

This command automatically installs the necessary files, as well as stores nativescript-htmllabel as a dependency in your project's package.json file.

## Configuration

It works exactly the same way as the {N} plugin. However it adds a few improvements

## iOS Performances

On iOS generating html string can be slow using the system way.
You can enable `DTCoreText` to make it faster.

-   add pod `DTCoreText` in your app Podfile at `App_Resources/ios`

```
pod 'DTCoreText'
```

-   enable it in your `app.(js|ts)` (as soon as possible)

```javascript
require('@nativescript-community/ui-label').enableIOSDTCoreText();
```

### Angular

```typescript
import { registerElement } from '@nativescript/angular';

registerElement('HTMLLabel', () => require('@nativescript-community/ui-label').Label);
```

```html
<!-- Normal Label Usage -->
<HTMLLabel html="<b>Hello, I am BOLD!></b>" fontFamily="OpenSans" fontSize="16" margin="2 5 5 5" textWrap="true"></HTMLLabel>

<!-- Clickable Link Usage -->
<HTMLLabel
    [html]="someBindedUrl"
    linkColor="#336699"
    linkUnderline="true"
    (linkTap)="onLinkTap($event)"
    fontFamily="OpenSans"
    fontSize="16"
    margin="2 5 5 5"
    textWrap="true"
></HTMLLabel>
```

```typescript
import { Utils } from '@nativescript/core';

export someComponentClass() {
    someBindedUrl = '<a href=\"https://youtube.com\">Open Youtube.com</a>'

    // Event binded to the linkTap function on the HTMLLabel
    onLinkTap(args) {
        const link = args.link;
        // expected to be https://youtube.com from the binded `<a>` tag href value
        // be sure to encodeURIComponent of any query string parameters if needed.
        Utils.openUrl(link);
    }
}


```

### Vue

```typescript
import Vue from 'nativescript-vue';

Vue.registerElement('HTMLLabel', () => require('@nativescript-community/ui-label').Label);
```

```html
<!-- Normal Label Usage -->
<HTMLLabel
    fontSize="50"
    fontFamily="Cabin Sketch,res/cabinsketch"
    width="100%"
    paddingTop="5"
    color="#336699"
    textWrap="true"
    :html="someBindedValue"
    verticalAlignment="top"
/>

<!-- Clickable Link Usage -->
<HTMLLabel
    html="<a href='https://youtube.com'>Open Youtube.com</a>"
    linkColor="pink"
    linkUnderline="false"
    @linkTap="onLinkTap($event)"
    fontFamily="OpenSans"
    fontSize="16"
    margin="2 5 5 5"
    textWrap="true"
></HTMLLabel>
```

```typescript
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            someBindedValue: "<p>This is really powerful. <b>Amazing to be quite honest</b></p>",
        };
    },
    methods: {
        // event binded to the linkTap on the HTMLLabel
        onLinkTap(args) {
            Utils.openUrl(args.link);
        },
    },
    beforeDestroy() {},
});
</script>
```

### Properties

-   **html**  
    Html text that will be used to render text. HTML supported tags are a bit different on iOS and Android. To make sure it works as expected, for now only used Android [supported ones](https://stackoverflow.com/questions/9754076/which-html-tags-are-supported-by-android-textview).

    If using a `url` with parameters, be sure to encode the query string so Android can open the link accordingly.

-   **verticalTextAlignment**  
    You can also set it through css with `vertical-text-alignment`

-   **textShadow**  
    You can also set it through css with `text-shadow`. The format is `offsetx offsety blurradius color`

-   **linkColor**
    Color for any `<a>` tags inside the `HTMLLabel`.

-   **linkUnderline**
    Boolean to enable underline for any `<a>` tags inside the `HTMLLabel`.
-   **linkTap**
    Event to handle taps of any `<a>` tags inside the `HTMLLabel`. Access the `link` property of the event data from the `linkTap` event. See Samples above for example.

## Improvements

-   Override the {N} font loading system to make it much faster
-   faster creation of `FormattedString`
-   faster label creation and drawing, especially on android
