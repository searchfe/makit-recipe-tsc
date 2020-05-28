import { RecipeDeclaration } from "makit";
import { PrerequisitesDeclaration } from "makit/dist/prerequisites";

export interface ForRule {
    forRule: () => RuleOptions
}

export type RuleOptions = [
    string,
    PrerequisitesDeclaration,
    RecipeDeclaration
];

export interface Plugin {
    getDepencies?: (context: PluginContext) => string[]
    beforeMakeDepencies?: (filePaths: string[], baseDir: string, outDir: string) => string[]
    onPreCompile?:  (context: PluginContext) => string
    afterCompile?:  (context: PluginContext) => string
    onDest?: (context: PluginContext) => boolean
    // onDest?: ()
}

export interface PluginContext {
    content: string
    filePath: string
    baseDir: string
}
