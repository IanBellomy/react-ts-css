import {
  DefinitionProvider as vscode_DefinitionProvider,
  LocationLink,
  Position,
  TextDocument,
  Uri,
  Range,
} from "vscode";
import Settings from "../../settings";
import Store from "../../store/Store";
import { parseCss } from "../../parser/v2/css";
import path = require("path");

export class DataAttributeDefinitionProvider implements vscode_DefinitionProvider {
  async provideDefinition(
    document: TextDocument,
    position: Position,
  ): Promise<LocationLink[]> {
    if (!Settings.definition || !Settings.dataAttributeHover) {
      return [];
    }

    try {
      const parserResult = Store.parser?.parsed_result;
      if (!parserResult?.parsedResult?.data_attributes) {
        return [];
      }

      // Find data attribute at current position
      const dataAttribute = parserResult.parsedResult.data_attributes.find(
        (attr) => {
          const startPos = new Position(attr.range.start.line - 1, attr.range.start.column);
          const endPos = new Position(attr.range.end.line - 1, attr.range.end.column);
          return position.isAfterOrEqual(startPos) && position.isBeforeOrEqual(endPos);
        }
      );

      if (!dataAttribute) {
        return [];
      }

      // Find CSS modules that might contain selectors for this data attribute
      const cssModules = Array.from(Store.cssModules.entries());
      const locationLinks: LocationLink[] = [];

      for (const [uri, content] of cssModules) {
        try {
          const cssParserResult = await parseCss(uri);
          if (cssParserResult?.selectors) {
            for (const [selectorName, selector] of cssParserResult.selectors) {
              // Look for selectors that match the data attribute
              if (selector.selector.includes(`[${dataAttribute.name}`)) {
                const targetRange = new Range(
                  selector.range.start.line,
                  selector.range.start.character,
                  selector.range.end.line,
                  selector.range.end.character,
                );

                const targetSelectionRange = new Range(
                  selector.selectionRange.start.line,
                  selector.selectionRange.start.character,
                  selector.selectionRange.end.line,
                  selector.selectionRange.end.character,
                );

                const originSelectionRange = new Range(
                  new Position(dataAttribute.range.start.line - 1, dataAttribute.range.start.column),
                  new Position(dataAttribute.range.end.line - 1, dataAttribute.range.end.column),
                );

                locationLinks.push({
                  originSelectionRange,
                  targetUri: Uri.file(uri),
                  targetRange,
                  targetSelectionRange,
                });
              }
            }
          }
        } catch (error) {
          // Continue if parsing fails for a specific file
          continue;
        }
      }

      return locationLinks;
    } catch (e: any) {
      Store.outputChannel.error(
        `DataAttributeDefinitionProvider: Failed in document '${document.fileName}' at '${position.line}:${position.character}'
         ${e.message}`,
      );
      return [];
    }
  }
}