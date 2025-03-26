import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import { PluginListenerHandle } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

export interface StepData {
  steps: number;
  acceleration: number;
  lastStepTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StepCounterService {
  private stepDataSubject = new BehaviorSubject<StepData>({
    steps: 0,
    acceleration: 0
  });

  stepData$ = this.stepDataSubject.asObservable();
  private accelListener?: PluginListenerHandle;
  private threshold = 1.5;
  private lastStepTime = 0;
  private stepCooldown = 300;

  async startStepDetection() {
    this.accelListener = await Motion.addListener('accel', (event) => {
      const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
      const currentAcceleration = Math.sqrt(x*x + y*y + z*z);
      
      const accelerationMagnitude = Math.abs(currentAcceleration);
      
      const currentTime = Date.now();
      if (
        accelerationMagnitude > this.threshold && 
        (currentTime - this.lastStepTime > this.stepCooldown)
      ) {
        const currentSteps = this.stepDataSubject.value.steps + 1;
        
        this.stepDataSubject.next({
          steps: currentSteps,
          acceleration: Number(accelerationMagnitude.toFixed(2)),
          lastStepTime: currentTime
        });
        
        this.lastStepTime = currentTime;
      }
    });
  }

  async stopStepDetection() {
    if (this.accelListener) {
      await this.accelListener.remove();
    }
  }

  resetStepCounter() {
    this.stepDataSubject.next({
      steps: 0,
      acceleration: 0
    });
    this.lastStepTime = 0;
  }
}