import path = require("path");
import {
  HoverProvider as vscode_HoverProvider,
  Hover,
  MarkdownString,
  Position,
  TextDocument,
} from "vscode";
import Settings from "../../settings";
import Store from "../../store/Store";
import { ProviderKind } from "../types";
import { TSProvider } from "./TSProvider";
import { parseCss } from "../../parser/v2/css";

export class DataAttributeHoverProvider implements vscode_HoverProvider {
  async provideHover(
    document: TextDocument,
    position: Position,
  ): Promise<Hover | undefined> {
    if (!Settings.peekProperties || !Settings.dataAttributeHover) {
      return;
    }

    try {
      const parserResult = Store.parser?.parsed_result;
      if (!parserResult?.parsedResult?.data_attributes) {
        return;
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
        return;
      }

      // Find CSS modules that might contain selectors for this data attribute
      const cssModules = Array.from(Store.cssModules.entries());
      const matchingSelectors: Array<{ selector: string; content: string; file: string }> = [];

      for (const [uri, content] of cssModules) {
        try {
          const cssParserResult = await parseCss(uri);
          if (cssParserResult?.selectors) {
            for (const [selectorName, selector] of cssParserResult.selectors) {
              // Look for selectors that match the data attribute
              if (selector.selector.includes(`[${dataAttribute.name}`)) {
                matchingSelectors.push({
                  selector: selectorName,
                  content: selector.content,
                  file: path.relative(Store.workSpaceRoot ?? "", uri),
                });
              }
            }
          }
        } catch (error) {
          // Continue if parsing fails for a specific file
          continue;
        }
      }

      if (matchingSelectors.length === 0) {
        return;
      }

      // Create hover content
      const hoverContent: (string | MarkdownString)[] = [];

      // Add data attribute info
      hoverContent.push(
        new MarkdownString(`**Data Attribute:** \`${dataAttribute.name}\``)
      );

      if (dataAttribute.value) {
        hoverContent.push(
          new MarkdownString(`**Value:** \`${dataAttribute.value}\``)
        );
      }

      hoverContent.push(new MarkdownString("---"));

      // Add matching CSS selectors
      for (const { selector, content, file } of matchingSelectors) {
        const language = path.extname(file).replace(".", "");
        hoverContent.push(
          new MarkdownString(`*${file}*`),
          `\`\`\`${language}\n${content}\n\`\`\``
        );
      }

      return new Hover(hoverContent);
    } catch (e: any) {
      Store.outputChannel.error(
        `DataAttributeHoverProvider: Failed in document '${document.fileName}' at '${position.line}:${position.character}'
         ${e.message}`,
      );
      return;
    }
  }
}