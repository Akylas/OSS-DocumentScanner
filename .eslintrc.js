module.exports = {
    env: {
        es6: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2019,
        createDefaultProgram: true,
        project: 'tsconfig.json',
        sourceType: 'module'
    },
    globals: { gVars: true, SENTRY_DSN: true, SENTRY_PREFIX: true, PRODUCTION: true, OWM_KEY: true },
    plugins: ['svelte3', '@typescript-eslint'],
    overrides: [
        { files: '*.svelte', processor: 'svelte3/svelte3' },
        {
            files: '*.ts',
            rules: {
                'eslint-plugin-svelte3/parse-error': 'off',
                'no-undef': 'off',
            }
        }
    ],
    rules: {
        'eslint-plugin-svelte3/invalid-binding': 'off',
        '@typescript-eslint/adjacent-overload-signatures': 'off',
        '@typescript-eslint/array-type': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/consistent-type-assertions': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'off',
            {
                accessibility: 'explicit'
            }
        ],
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                FunctionDeclaration: {
                    parameters: 'first'
                },
                FunctionExpression: {
                    parameters: 'first'
                },
                SwitchCase: 1
            }
        ],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-new': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unnecessary-qualifier': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-use-before-declare': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/prefer-for-of': 'off',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/quotes': [
            'error',
            'single',
            {
                avoidEscape: true
            }
        ],
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/space-within-parens': ['off', 'never'],
        '@typescript-eslint/triple-slash-reference': 'off',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'off',
        'arrow-body-style': 'error',
        'arrow-parens': ['off', 'as-needed'],
        camelcase: 'off',
        'capitalized-comments': 'off',
        complexity: 'off',
        'constructor-super': 'error',
        curly: ['error', 'multi-line'],
        'dot-notation': 'off',
        'eol-last': 'error',
        eqeqeq: ['error', 'smart'],
        'guard-for-in': 'off',
        'id-blacklist': 'off',
        'id-match': 'error',
        'sort-imports': [
            'error',
            {
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
            }
        ],
        'linebreak-style': 'off',
        'max-classes-per-file': 'off',
        'max-len': [
            'off',
            {
                ignorePattern: '^import |^export {(.*?)}',
                code: 200
            }
        ],
        'new-parens': 'off',
        'newline-per-chained-call': 'off',
        'no-bitwise': 'off',
        'no-caller': 'error',
        'no-cond-assign': 'off',
        'no-console': [
            'off',
            {
                allow: [
                    'log',
                    'warn',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'debug',
                    'dirxml',
                    'error',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context'
                ]
            }
        ],
        'no-constant-condition': 'error',
        'no-control-regex': 'off',
        'no-debugger': 'error',
        'no-duplicate-imports': 'error',
        'no-empty': 'off',
        'no-eval': 'off',
        'no-extra-semi': 'off',
        'no-fallthrough': 'error',
        'no-invalid-regexp': 'error',
        'no-invalid-this': 'off',
        'no-irregular-whitespace': 'off',
        'no-multiple-empty-lines': 'off',
        'no-new-wrappers': 'error',
        'no-redeclare': 'off',
        'no-regex-spaces': 'error',
        'no-return-await': 'error',
        'no-shadow': [
            'off',
            {
                hoist: 'all'
            }
        ],
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-undef': 'error',
        'no-underscore-dangle': 'off',
        'no-unsafe-finally': 'error',
        'no-unused-expressions': [
            'error',
            {
                allowTaggedTemplates: true,
                allowShortCircuit: true
            }
        ],
        'no-unused-labels': 'error',
        'no-var': 'error',
        'object-shorthand': 'error',
        'one-var': ['off', 'never'],
        'prefer-arrow/prefer-arrow-functions': 'off',
        'prefer-const': 'error',
        'quote-props': 'off',
        radix: 'error',
        'space-before-function-paren': 'off',
        'spaced-comment': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'off'
    }
};
