import { Component, ViewChild } from '@angular/core';
import { MonacoEditorComponent, MonacoEditorConstructionOptions, MonacoEditorLoaderService } from '@materia-ui/ngx-monaco-editor';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MonacoEditorComponent, { static: false })
  monacoEditorComponent: MonacoEditorComponent;
  editorOptions: MonacoEditorConstructionOptions = {
    theme: "vs",
    language: "json",
    minimap: {
      enabled: false
    },
    lineNumbers: "off",
    automaticLayout: true
  };
  modelUri: monaco.Uri;
  code = `{
    "test": 1,
    "scopes": { "test": 2 }
}`;

  constructor(private monacoLoaderService: MonacoEditorLoaderService) {
    this.monacoLoaderService.isMonacoLoaded$
      .pipe(
        filter(isLoaded => isLoaded),
        take(1)
      )
      .subscribe(() => {
        console.log("loaded");
        this.modelUri = monaco.Uri.parse("a://b/foo.json"); // a made up unique URI for our model
        // this.model = monaco.editor.createModel(jsonCode, "json", modelUri);
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
          enableSchemaRequest: true,
          validate: true,
          schemas: [
            {
              uri: "http://myserver/city-schema.json",
              fileMatch: ["foo*.json"], // associate with our model
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  scopes: {
                    description: "something useful here",
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        include: {
                          type: "array",
                          items: [
                            {
                              type: "string"
                            }
                          ]
                        },
                        exclude: {
                          type: "array",
                          items: [
                            {
                              type: "string"
                            }
                          ]
                        },
                        asset_types: {
                          type: "array",
                          items: [
                            {
                              type: "string"
                            }
                          ]
                        }
                      },
                      required: ["include"]
                    }
                  }
                },
                required: ["scopes"]
              }
            }
          ]
        });
      });
  }
}
