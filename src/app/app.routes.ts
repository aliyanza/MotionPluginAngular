import { Routes } from '@angular/router';
import { StepCounterComponent } from './components/step-counter/step-counter.component';
import { MotionComponent } from './components/motion/motion.component';

export const routes: Routes = [
  { path: '', component: StepCounterComponent },
  { path: 'motion', component: MotionComponent }
];