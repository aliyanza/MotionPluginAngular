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
  
  // More sophisticated step detection parameters
  private threshold = 2.5; // Increased threshold to reduce false positives
  private lastStepTime = 0;
  private stepCooldown = 500; // Increased cooldown time
  
  // Additional parameters for more accurate step detection
  private peakDetectionWindow: number[] = [];
  private windowSize = 5; // Number of recent accelerations to consider
  private dynamicThresholdMultiplier = 1.5; // Adjust sensitivity

  async startStepDetection() {
    this.accelListener = await Motion.addListener('accel', (event) => {
      const { x, y, z } = event.acceleration || { x: 0, y: 0, z: 0 };
      const currentAcceleration = Math.sqrt(x*x + y*y + z*z);
      
      // Add current acceleration to the detection window
      this.peakDetectionWindow.push(currentAcceleration);
      
      // Maintain a fixed-size window
      if (this.peakDetectionWindow.length > this.windowSize) {
        this.peakDetectionWindow.shift();
      }
      
      // Calculate dynamic threshold based on recent accelerations
      const averageAcceleration = this.peakDetectionWindow.reduce((a, b) => a + b, 0) / this.peakDetectionWindow.length;
      const dynamicThreshold = averageAcceleration * this.dynamicThresholdMultiplier;
      
      const currentTime = Date.now();
      
      // More robust step detection
      if (
        currentAcceleration > Math.max(this.threshold, dynamicThreshold) && 
        (currentTime - this.lastStepTime > this.stepCooldown)
      ) {
        const currentSteps = this.stepDataSubject.value.steps + 1;
        
        this.stepDataSubject.next({
          steps: currentSteps,
          acceleration: Number(currentAcceleration.toFixed(2)),
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
    this.peakDetectionWindow = []; // Reset detection window
  }
}