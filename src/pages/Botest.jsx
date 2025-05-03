import React from 'react';
import {
  Page,
  PageSection,
  Brand,
  Bullseye,
  Card,
  CardBody
} from '@patternfly/react-core';

import { Chatbot } from '@patternfly/virtual-assistant';
import { ChatbotDisplayMode } from '@patternfly/virtual-assistant';
import { ChatbotContent } from '@patternfly/virtual-assistant';
import { ChatbotWelcomePrompt } from '@patternfly/virtual-assistant';
import { ChatbotFooter } from '@patternfly/virtual-assistant';
import { ChatbotFootnote } from '@patternfly/virtual-assistant';
import { MessageBar } from '@patternfly/virtual-assistant';
import { MessageBox } from '@patternfly/virtual-assistant';
import { Message } from '@patternfly/virtual-assistant';

import PFHorizontalLogoColor from '../assets/images/logo-ht.png';
import PFHorizontalLogoReverse from '../assets/images/logo-ht.png';
import userAvatar from '../assets/images/logo-ht.png';
import patternflyAvatar from '../assets/images/logo-ht.png';

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
        alert('Do something!');
      }
    },
    link: {
      label: 'Learn more',
      url: 'https://www.redhat.com/'
    }
  }
};

const markdown = 'Hola, Soy un asistente virtual que puede ayudarte a obtener ayuda sobre la información relacionada a los portales';

const initialMessages = [{
  id: '1',
  role: 'user',
  content: '¿Qué puedes hacer?',
  name: 'User',
  avatar: userAvatar
}, {
  id: '2',
  role: 'bot',
  content: markdown,
  name: 'Bot',
  avatar: patternflyAvatar,
  actions: {
    positive: { onClick: () => console.log('Good response') },
    negative: { onClick: () => console.log('Bad response') },
    copy: { onClick: () => console.log('Copy') },
    share: { onClick: () => console.log('Share') },
    listen: { onClick: () => console.log('Listen') }
  }
}];

const welcomePrompts = [{
  title: 'Instancias disponibles',
  message: '¿Cuántas instancias hay en KDACADEMY?'
}, {
  title: 'Proyectos',
  message: '¿Qué carpetas tienen más de 5 proyectos?'
}];

const Botest = () => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const scrollToBottomRef = React.useRef(null);
  const displayMode = ChatbotDisplayMode.embedded;

  React.useEffect(() => {
    if (messages.length > 0) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const generateId = () => Date.now() + Math.random().toString();

  const handleSend = async (message) => {
    if (!message.trim()) return;

    setIsSendButtonDisabled(true);

    const userMessage = {
      id: generateId(),
      role: 'user',
      content: message,
      name: 'Usuario',
      avatar: userAvatar
    };

    const loadingBotMessage = {
      id: generateId(),
      role: 'bot',
      content: 'Pensando...',
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true
    };

    const newMessages = [...messages, userMessage, loadingBotMessage];
    setMessages(newMessages);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loadedMessages = [...newMessages];
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: `Respuesta simulada para: "${message}"`,
        name: 'Bot',
        avatar: patternflyAvatar,
        isLoading: false
      });

      setMessages(loadedMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendButtonDisabled(false);
    }
  };

  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="Lightspeed Logo" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="Lightspeed Logo" />
    </Bullseye>
  );

  return (
    <Page>
      <PageSection style={{ height: '80vh', padding: '0' }}> {/* Añadido estilo */}
        <Card style={{ height: '100%' }}>
          <CardBody style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            padding: '0' 
          }}>
            <Chatbot displayMode={displayMode} style={{ flex: 1 }}>
              <ChatbotContent style={{ flex: 1 }}>
                <MessageBox style={{ height: '100%' }}>
                  <ChatbotWelcomePrompt 
                    title="Hola Usuario del Chatbot" 
                    description='¿En qué te puedo ayudar el día de hoy?' 
                    prompts={welcomePrompts} 
                  />
                  {messages.map((message) => (
                    <Message key={message.id} {...message} />
                  ))}
                  <div ref={scrollToBottomRef} />
                </MessageBox>
              </ChatbotContent>
              
              <ChatbotFooter style={{ 
                position: 'sticky',
                bottom: 0,
                background: 'white',
                padding: '1rem',
                borderTop: '1px solid #d2d2d2'
              }}>
                <MessageBar
                  onSendMessage={handleSend}
                  isSendButtonDisabled={isSendButtonDisabled}
                  placeholder="Escribí tu mensaje..."
                  hasMicrophoneButton={false}
                  style={{ width: '100%' }}
                />
                <ChatbotFootnote {...footnoteProps} />
              </ChatbotFooter>
            </Chatbot>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

export default Botest;