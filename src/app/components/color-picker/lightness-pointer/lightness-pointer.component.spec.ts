import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightnessPointerComponent } from './lightness-pointer.component';

describe('LightnessPointerComponent', () => {
  let component: LightnessPointerComponent;
  let fixture: ComponentFixture<LightnessPointerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightnessPointerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightnessPointerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
