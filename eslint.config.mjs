import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import importHelpers from "eslint-plugin-import-helpers";
import react from "eslint-plugin-react";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
    ),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        import: fixupPluginRules(_import),
        "import-helpers": importHelpers,
        react,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            pragma: "React",
            version: "17.0",
        },
    },

    rules: {
        "@typescript-eslint/no-explicit-any": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "import/no-self-import": "error",
        "import/no-cycle": "error",
        "import/no-useless-path-segments": "error",
        "import/no-relative-parent-imports": "error",
        "import/first": "error",
        "import/newline-after-import": "error",

        "react/boolean-prop-naming": ["error", {
            rule: "^(is|has|will|can)[A-Z]([A-Za-z0-9]?)+",
        }],

        "react/button-has-type": "error",
        "react/display-name": "off",

        "react/function-component-definition": ["error", {
            namedComponents: "arrow-function",
            unnamedComponents: "arrow-function",
        }],

        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-curly-brace-presence": ["error", "never"],

        "react/jsx-sort-props": ["error", {
            callbacksLast: true,
            shorthandFirst: false,
            shorthandLast: true,
            ignoreCase: false,
            noSortAlphabetically: true,
            reservedFirst: ["key", "ref"],
        }],

        "arrow-body-style": ["error", "as-needed"],

        "sort-imports": ["error", {
            ignoreCase: true,
            ignoreDeclarationSort: true,
        }],

        "no-duplicate-imports": "error",
        "no-throw-literal": "error",
        "newline-before-return": "error",
        "no-return-await": "error",
    },
}, {
    files: ["**/@types/**/*"],

    rules: {
        "@typescript-eslint/consistent-type-definitions": "off",
    },
}]);