import React, { useState, useEffect, useRef } from 'react'; // Asegúrate de importar los hooks necesarios
import {
  Page,
  PageSection,
  PageSectionVariants,
  Brand,
  Bullseye,
  Card,
  CardBody,
} from '@patternfly/react-core';
// Importaciones de PatternFly Virtual Assistant (SIN MessageBar)
import {
  Chatbot,
  ChatbotDisplayMode,
  ChatbotContent,
  ChatbotWelcomePrompt,
  ChatbotFooter, // Aún usamos ChatbotFooter como contenedor
  ChatbotFootnote,
  MessageBox,
  Message
} from '@patternfly/virtual-assistant';

// Asumiendo que estas rutas son correctas relativas a este archivo
import PFHorizontalLogoColor from '../assets/images/logo-ht.png';
import PFHorizontalLogoReverse from '../assets/images/logo-ht.png';
import userAvatar from '../assets/images/logo-ht.png';
import patternflyAvatar from '../assets/images/logo-ht.png';

//importaciones de las configs globales dela ia
import { OPENAI_KEY,OPENAI_URL } from "../config";

// --- Constantes y Datos ---

const footnoteProps = {
  label: 'Lightspeed uses AI. Check for mistakes.',
  popover: {
    title: 'Verify accuracy',
    description: `While Lightspeed strives for accuracy, there's always a possibility of errors. It's a good practice to verify critical information from reliable sources, especially if it's crucial for decision-making or actions.`,
    bannerImage: {
      src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
      alt: 'Example image for footnote popover'
    },
    cta: {
      label: 'Got it',
      onClick: () => {
        // Puedes dejar el alert o quitarlo si no es necesario
        // alert('Do something!');
        console.log('Footnote CTA clicked');
      }
    },
    link: {
      label: 'Learn more',
      url: 'https://www.redhat.com/' // Cambia a una URL relevante si es necesario
    }
  }
};

const initialMarkdown = 'Hola, Soy un asistente virtual que puede ayudarte a obtener ayuda sobre la información relacionada a los portales';

// Mensajes iniciales
const initialMessages = [{
  id: '1',
  role: 'user',
  content: '¿Qué puedes hacer?',
  name: 'User',
  avatar: userAvatar
}, {
  id: '2',
  role: 'bot',
  content: initialMarkdown, // Usar la constante
  name: 'Bot',
  avatar: patternflyAvatar,
  // Quité los actions aquí porque normalmente se manejan de otra forma o se añaden dinámicamente
  // Si los necesitas, puedes volver a añadirlos.
}];

// Prompts de bienvenida
const welcomePrompts = [{
  title: 'Instancias disponibles',
  message: '¿Cuántas instancias hay en KDACADEMY?'
}, {
  title: 'Proyectos',
  message: '¿Qué carpetas tienen más de 5 proyectos?'
}];

// --- Configs AI ---
const OPENAI_API_KEY = OPENAI_KEY;
const OPEN_API_URL = OPENAI_URL;


// --- Componente Principal ---

const Bot = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState(''); // control de textIn
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const scrollToBottomRef = useRef(null);
  const displayMode = ChatbotDisplayMode.embedded; // O el modo que necesites

  // Scroll automático al final cuando llegan mensajes nuevos
  useEffect(() => {
    if (messages.length > 0 && scrollToBottomRef.current) {
        scrollToBottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end' // Asegura que se vea el final del contenedor
        });
    }
}, [messages]);


  // Generador simple de IDs únicos
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Función para enviar mensajes y obtener respuesta de la IA
  const handleSend = async (messageToSend) => {
    const trimmedMessage = messageToSend.trim();
    if (!trimmedMessage) return; // No enviar mensajes vacíos

    setIsSendButtonDisabled(true); // Deshabilitar input/botón
    setInputText(''); // Limpiar input inmediatamente

    // Añadir mensaje del usuario
    const userMessage = {
      id: generateId(),
      role: 'user',
      content: trimmedMessage,
      name: 'Usuario', // O el nombre de usuario real
      avatar: userAvatar
    };

    // Añadir mensaje temporal de "Pensando..."
    const loadingBotMessage = {
      id: generateId(),
      role: 'bot',
      content: 'Pensando...', // Puedes usar un componente de Spinner aquí si prefieres
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true // Propiedad para indicar carga
    };

    // Actualizar estado con mensaje de usuario y de carga
    setMessages(prevMessages => [...prevMessages, userMessage, loadingBotMessage]);

    // --- Llamada a la API de OpenAI ---
    try {
      const response = await fetch(OPEN_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`, // <-- Uso de la API Key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // O el modelo que estés usando
          messages: [
            // Tu prompt de sistema (ajusta según necesites)
            { role: 'system', content: 'Eres un asistente de TI experto en responder preguntas relacionadas al resumen de recursos de un sistema que centraliza los dashboards de las distintas herramientas de monitoreo que se trabajan solo en este sistema y solo respondes preguntas relacionadas al archivo json que se encuentra en la ruta /proyect_patterfly-master/src/data/compute_resumen.json' },
            // El mensaje actual del usuario
            { role: 'user', content: trimmedMessage }
          ]
          // Puedes añadir otros parámetros como temperature, max_tokens, etc.
        })
      });

      if (!response.ok) {
          // Manejar errores de la API (ej. 401 Unauthorized, 429 Rate Limit)
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Error ${response.status}`);
      }

      const data = await response.json();
      const botResponse = data.choices?.[0]?.message?.content || "No pude obtener una respuesta.";

      // Crear el mensaje final del bot
      const botMessage = {
        id: generateId(),
        role: 'bot',
        content: botResponse,
        name: 'Bot',
        avatar: patternflyAvatar,
        isLoading: false // Ya no está cargando
      };

      // Actualizar estado: reemplazar "Pensando..." con la respuesta real
      setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop(); // Elimina el último mensaje ("Pensando...")
          updatedMessages.push(botMessage); // Añade la respuesta real
          return updatedMessages;
      });

    } catch (error) {
      console.error('Error al obtener respuesta del bot:', error);
      // Crear un mensaje de error para mostrar al usuario
       const errorMessage = {
            id: generateId(),
            role: 'bot',
            content: `Lo siento, ocurrió un error: ${error.message}`,
            name: 'Bot',
            avatar: patternflyAvatar,
            isLoading: false,
            isError: true // Puedes usar esto para estilizarlo diferente
        };
       // Actualizar estado: reemplazar "Pensando..." con el mensaje de error
       setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages.pop(); // Elimina el último mensaje ("Pensando...")
        updatedMessages.push(errorMessage); // Añade el mensaje de error
        return updatedMessages;
      });
    } finally {
      setIsSendButtonDisabled(false); // Rehabilitar input/botón
    }
    // --- Fin de la llamada a la API ---
  };

  // Función para manejar el envío con la tecla Enter
  const handleKeyDown = (event) => {
    // Verificar si se presionó Enter (sin Shift) y si el botón no está deshabilitado y hay texto
    if (event.key === 'Enter' && !event.shiftKey && !isSendButtonDisabled && inputText.trim()) {
      event.preventDefault(); // Evita el comportamiento por defecto (ej. salto de línea)
      handleSend(inputText);
    }
  };

  // Logo (puedes mantenerlo si lo usas en algún lugar, si no, puedes quitarlo)
  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="Lightspeed Logo" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="Lightspeed Logo" />
    </Bullseye>
  );


  // --- Renderizado del Componente ---
  return (
    <Page /* isManagedSidebar={false} si no tienes sidebar */ >
      <PageSection variant={PageSectionVariants.light}>
        <Card style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}> {/* Ajusta la altura como necesites */}
          <CardBody style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Usamos el componente Chatbot como contenedor principal */}
            <Chatbot displayMode={displayMode} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Contenido de los mensajes */}
              <ChatbotContent style={{ flexGrow: 1, overflowY: 'auto' }}> {/* Hacer scrollable esta parte */}
                <MessageBox>
                  {/* Mensaje de Bienvenida y Prompts */}
                  <ChatbotWelcomePrompt
                    title="Hola Usuario del Chatbot"
                    description='¿En qué te puedo ayudar el día de hoy?'
                    prompts={welcomePrompts}
                    onPromptClick={(prompt) => handleSend(prompt.message)} // <--- Añadido para manejar clic en prompts
                  />
                  {/* Mapeo de mensajes */}
                  {messages.map((message) => (
                    <Message key={message.id} {...message} />
                  ))}
                  {/* Elemento invisible para hacer scroll */}
                  <div ref={scrollToBottomRef} style={{ height: '1px' }} />
                </MessageBox>
              </ChatbotContent>

              {/* Footer con el input y la nota al pie */}
              <ChatbotFooter style={{ flexShrink: 0 }}> {/* Evitar que el footer se encoja */}
                {/* --- Inicio: Reemplazo de MessageBar con HTML estándar --- */}
                <div style={{
                  display: 'flex',
                  padding: '10px 15px', // Ajusta el padding
                  borderTop: '1px solid #e0e0e0', // Borde sutil
                  backgroundColor: '#f9f9f9' // Fondo ligero
                }}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown} // Manejar Enter
                    placeholder="Escribe tu mensaje aquí..."
                    disabled={isSendButtonDisabled} // Deshabilitar mientras se envía
                    style={{
                      flexGrow: 1,
                      marginRight: '10px',
                      padding: '10px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      outline: 'none', // Quitar borde al enfocar (opcional)
                    }}
                    aria-label="Entrada de mensaje del chat" // Accesibilidad
                  />
                  <button
                    onClick={() => handleSend(inputText)}
                    disabled={isSendButtonDisabled || !inputText.trim()} // Deshabilitado si se envía o si está vacío
                    style={{
                      padding: '10px 18px',
                      cursor: (isSendButtonDisabled || !inputText.trim()) ? 'not-allowed' : 'pointer',
                      border: 'none',
                      // Cambia colores según tu tema
                      backgroundColor: (isSendButtonDisabled || !inputText.trim()) ? '#cccccc' : '#0066cc',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      transition: 'background-color 0.2s ease', // Transición suave
                    }}
                    aria-label="Enviar mensaje" // Accesibilidad
                  >
                    Enviar
                  </button>
                </div>
                {/* --- Fin: Reemplazo de MessageBar --- */}

                {/* Nota al pie (si la necesitas) */}
                <ChatbotFootnote {...footnoteProps} />
              </ChatbotFooter>
            </Chatbot>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

export default Bot;