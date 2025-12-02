import { globalIgnores } from 'eslint/config';
import defaultConfig from './tools/eslint.config.mjs';

export default [globalIgnores(['**/opencv', '**/tesseract', '**/zxingcpp', '**/plugin-nativeprocessor']), ...defaultConfig];
