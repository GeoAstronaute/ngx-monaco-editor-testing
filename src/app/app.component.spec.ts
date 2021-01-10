import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { filter, take } from 'rxjs/operators';
import { MonacoEditorLoaderService, MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { AppComponent } from './app.component';

function asyncTimeout(time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), time);
  });
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let expectedCode: any = `{
    "test": 1,
    "scopes": { "test": 2 }
}`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        MonacoEditorModule
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();

    const monacoService = TestBed.inject(MonacoEditorLoaderService);
    await monacoService.isMonacoLoaded$.pipe(
      filter(loaded => !!loaded), take(1)
    ).toPromise();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('Should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Check if code in editor is populated', async () => {
    fixture.detectChanges();
    await asyncTimeout(0);
    expect(fixture.componentInstance.monacoEditorComponent.editor.getValue())
      .toEqual(expectedCode);
  });

  it('Should be able to update code', async () => {
    const newCode = 'Hello world!';
    fixture.componentInstance.code = 'Hello world!';
    fixture.detectChanges();
    await asyncTimeout(0);
    expect(fixture.componentInstance.monacoEditorComponent.editor.getValue())
      .toEqual(newCode);
  });
});
