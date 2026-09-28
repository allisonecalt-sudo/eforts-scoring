const prettier = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        event: 'readonly',
        requestAnimationFrame: 'readonly',
        HTMLElement: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        MouseEvent: 'readonly',
        TouchEvent: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        // Supabase CDN global
        supabase: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(toggleDrill|goBack|resetForm|printResults|downloadForAI)$',
        },
      ],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-constant-condition': 'warn',
      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
  {
    // app.js and parent.js both read the shared instrument data/codec
    // globals that items.js / eforts-code.js declare as top-level `const`
    // (classic scripts share one script-realm scope — see items.js /
    // eforts-code.js header comments and tests/helpers/eforts-app.js).
    files: ['app.js', 'parent.js', 'import.js'],
    languageOptions: {
      globals: {
        items: 'readonly',
        SECTIONS: 'readonly',
        SCALE_LABELS: 'readonly',
        COMPANION: 'readonly',
        EFORTSCode: 'readonly',
      },
    },
  },
  {
    // Test suite (Node/CommonJS via Playwright Test) — separate globals
    // from the browser-only app.js block above.
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'writable',
        exports: 'writable',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        window: 'readonly',
        document: 'readonly',
        // app.js globals, referenced inside page.evaluate() callbacks that
        // run in the browser page's own script scope (see
        // tests/helpers/eforts-app.js top-of-file comment for why these
        // resolve there even though they're not attached to `window`).
        items: 'readonly',
        cutoffs: 'readonly',
        avg: 'readonly',
        buildSummary: 'readonly',
        calculate: 'readonly',
        updateAge: 'readonly',
        getBirthDateValue: 'readonly',
        getFillDateValue: 'readonly',
        buildExportText: 'readonly',
        SECTIONS: 'readonly',
        SCALE_LABELS: 'readonly',
        COMPANION: 'readonly',
        EFORTSCode: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  prettier,
];
