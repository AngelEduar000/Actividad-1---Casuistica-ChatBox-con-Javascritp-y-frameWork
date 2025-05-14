import { Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', component: ChatbotComponent },       // Ruta principal
  { path: 'chatbot', component: ChatbotComponent } // Ruta específica opcional
];
