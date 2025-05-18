import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../services/chatbot.service'; // Importa el servicio del chatbot
import { finalize } from 'rxjs/operators';

// Interfaz que define la estructura de un mensaje en el chat
interface Message {
  text: string;       // Contenido del mensaje
  sender: 'user' | 'bot'; // Quién envía el mensaje (usuario o bot)
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule], // Módulos necesarios
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements AfterViewInit {
  userMessage: string = ''; // Almacena el mensaje que el usuario está escribiendo
  messages: Message[] = [
    { text: 'Hey there 👋 <br> How can i help you today?', sender: 'bot' }, // Mensaje inicial del bot
  ];
  isThinking: boolean = false; // Indica si el bot está procesando una respuesta

  // Referencia al contenedor del chat para hacer scroll automático
  @ViewChild('chatBody', { static: false }) chatBody!: ElementRef;

  // Inyecta el servicio del chatbot
  constructor(private chatbotService: ChatbotService) {}

  ngAfterViewInit() {
    // Se podría inicializar algo después de que la vista esté lista
  }

  // Maneja el envío de mensajes (por Enter o botón)
  handleEnter(event?: Event): void {
    if (event) {
      event.preventDefault(); // Previene el comportamiento por defecto si es un evento
    }

    const trimmed = this.userMessage.trim(); // Elimina espacios en blanco
    if (trimmed) {
      // Agrega el mensaje del usuario al historial
      this.messages.push({ text: trimmed, sender: 'user' });
      this.userMessage = ''; // Limpia el input

      this.isThinking = true; // Indica que el bot está pensando

      // Envía el mensaje al servicio del chatbot
      this.chatbotService
        .sendMessageToBot(trimmed)
        .pipe(
          // Operador que se ejecuta cuando la suscripción finaliza (éxito o error)
          finalize(() => {
            this.isThinking = false; // Deja de mostrar el indicador de "pensando"
            this.scrollToBottom();  // Asegura que el chat scrollee al final
          })
        )
        .subscribe({
          next: (response) => {
            // Maneja la respuesta exitosa del backend
            console.log('Respuesta del backend:', response);
            // Agrega la respuesta del bot al historial
            this.messages.push({ text: response.response, sender: 'bot' });
            this.scrollToBottom(); // Asegura scroll al final después de agregar mensaje
          },
          error: (err) => {
            // Maneja errores en la comunicación con el backend
            console.error('Error al obtener respuesta:', err);
            this.isThinking = false;
          },
        });
    }
  }

  // Función para hacer scroll automático al final del chat
  scrollToBottom() {
    if (this.chatBody) {
      const el = this.chatBody.nativeElement;
      el.scrollTop = el.scrollHeight; // Mueve el scroll a la parte inferior
    }
  }
}