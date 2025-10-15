Place your local font files in this directory.

Supported formats:
- WOFF (.woff)
- WOFF2 (.woff2)
- TTF (.ttf)
- OTF (.otf)

To use local fonts in your website:
1. Add your font files to this directory
2. Update the styles.css file to include @font-face declarations
3. Replace the font-family declarations with your local font names

Example @font-face declaration:
@font-face {
    font-family: 'MyLocalFont';
    src: url('fonts/myfont.woff2') format('woff2'),
         url('fonts/myfont.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

Then update the body font-family:
body {
    font-family: 'MyLocalFont', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}