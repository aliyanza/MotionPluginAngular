import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCounterComponent } from './step-counter.component';

describe('StepCounterComponent', () => {
  let component: StepCounterComponent;
  let fixture: ComponentFixture<StepCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
