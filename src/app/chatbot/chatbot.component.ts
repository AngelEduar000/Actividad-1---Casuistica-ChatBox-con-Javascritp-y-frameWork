import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'], // corregí "styleUrl" a "styleUrls"
})
export class ChatbotComponent implements AfterViewInit {
  userMessage: string = '';
  messages: Message[] = [
    { text: 'Hey there 👋 <br> How can i help you today?', sender: 'bot' },
  ];
  sendMessage = document.querySelector('#send-message');
  isThinking: boolean = false;

  constructor() {}

  ngAfterViewInit() {
    // Aquí podrías hacer lógica que dependa de que el DOM ya esté cargado, si es necesario
  }

  @ViewChild('chatBody', { static: false }) chatBody!: ElementRef;

  handleEnter(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    const trimmed = this.userMessage.trim();
    if (trimmed) {
      // Agregar mensaje del usuario
      this.messages.push({ text: trimmed, sender: 'user' });

      // Limpiar textarea
      this.userMessage = '';

      // Mostrar animación "pensando"
      this.isThinking = true;

      // Luego de 2 segundos, mostrar respuesta del bot y quitar animación
      setTimeout(() => {
        this.isThinking = false;

        // Aquí iría la lógica real de respuesta del bot
        this.messages.push({
          text: "I'm thinking... and here's your answer! 😄",
          sender: 'bot',
        });

        // Scroll automático al fondo si lo deseas
        setTimeout(() => {
          this.scrollToBottom();
        });
      }, 2000);
    }
  }

  scrollToBottom() {
    if (this.chatBody) {
      const el = this.chatBody.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }
}
