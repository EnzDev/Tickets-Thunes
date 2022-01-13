import { Directive, TemplateRef, EmbeddedViewRef, ViewContainerRef, Input, ɵstringify as stringify } from '@angular/core';

@Directive({
  selector: '[appIfNotNull]'
})
export class IfNotNullDirective {
  private _context: NgIfContext = new NgIfContext();
  private _thenTemplateRef: TemplateRef<NgIfContext> | null = null;
  private _elseTemplateRef: TemplateRef<NgIfContext> | null = null;
  private _thenViewRef: EmbeddedViewRef<NgIfContext> | null = null;
  private _elseViewRef: EmbeddedViewRef<NgIfContext> | null = null;

  constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgIfContext>) {
    this._thenTemplateRef = templateRef;
  }

  /**
   * The Boolean expression to evaluate as the condition for showing a template.
   */
  // Change to match your directive name.
  @Input()
  set appIfNotNull(condition: any) {
    // Change to match to match your directive name.
    this._context.$implicit = this._context.appIfNotNull = condition;
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to true.
   */
  // Change to match your directive name.
  @Input()
  set appIfNotNullThen(templateRef: TemplateRef<NgIfContext> | null) {
    assertTemplate('ngIfThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null;  // clear previous view if any.
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to false.
   */
  // Change to match your directive name.
  @Input()
  set appIfNotNullElse(templateRef: TemplateRef<NgIfContext> | null) {
    assertTemplate('ngIfElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null;  // clear previous view if any.
    this._updateView();
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef =
            this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
        }
      }
    } else {
      if (!this._elseViewRef) {
        this._viewContainer.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef =
            this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
        }
      }
    }
  }

  /** @internal */
  public static ngIfUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `ngIf` input within the template.
   *
   * The presence of this method is a signal to the Ivy template type check compiler that when the
   * `NgIf` structural directive renders its template, the type of the expression bound to `ngIf`
   * should be narrowed in some way. For `NgIf`, it is narrowed to be non-null, which allows the
   * strictNullChecks feature of TypeScript to work with `NgIf`.
   */
  static ngTemplateGuard_ngIf<E>(dir: IfNotNullDirective, expr: E): expr is NonNullable<E> { return true; }
}

/**
 * @publicApi
 */
export class NgIfContext {
  public $implicit: any = null;
  // Change to match your directive name.
  public appIfNotNull: any = null;
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}