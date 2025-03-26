import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepCounterService, StepData } from '../motion/Services/step-counter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-counter.component.html',
  styleUrl: './step-counter.component.scss'
})
export class StepCounterComponent implements OnInit, OnDestroy {
  stepData: StepData = { steps: 0, acceleration: 0 };
  private stepSubscription?: Subscription;

  constructor(private stepCounterService: StepCounterService) {}

  ngOnInit(): void {
    this.stepCounterService.startStepDetection();
    this.stepSubscription = this.stepCounterService.stepData$.subscribe((data: StepData) => {
      this.stepData = data;
    });
  }

  ngOnDestroy(): void {
    this.stepCounterService.stopStepDetection();
    this.stepSubscription?.unsubscribe();
  }

  resetSteps() {
    this.stepCounterService.resetStepCounter();
  }
}