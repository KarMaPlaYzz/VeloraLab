// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #000000);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #000000);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #000000);
            --title--color-font: var(--n8n-title-font-color, #000000);
            --title--color-background: var(--n8n-title-background-color, #ffffff);
            --chat-footer--color-background: var(--n8n-chat-footer-background-color, #ffffff);
            --chat-footer--color-font: var(--n8n-chat-footer-font-color, #000000);
            --close-button--color-font: var(--n8n-close-button-font-color, #000000);
            font-family: 'Basier Circle', -apple-system, BlinkMacSystemFont, ui-sans-serif, system-ui;;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 2147483048; /*chat-toggle is one digit lower*/
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 25px;
            box-shadow: 0px 8px 12px 0px rgba(23, 10, 7, 0.12);
            overflow: hidden;
            font-family: inherit;
            visibility: hidden;
            opacity: 0;
            -webkit-opacity: 0;
            -webkit-transition: -webkit-opacity 0.2s;
            -webkit-transition: opacity 0.2s;
            transition: visibility 0.2s, opacity 0.2s ease-in-out;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
            visibility: visible;
            -webkit-opacity: 1;
            opacity: 1;
            -webkit-transition: -webkit-opacity 0.2s;
            -webkit-transition: opacity 0.2s;
            transition: visibility 0.2s, opacity 0.2s ease-in-out;
        }

        @media screen and (max-width: 400px) {
            .n8n-chat-widget .chat-container {
                width: 100%;
                height: 100%;
                bottom: 0px;
                right: 0px;
                left: 0px;
                top: 0px;
                border-radius: 0px;
            }
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--title--color-background);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            position: relative;
        }

        .n8n-chat-widget .brand-header-image {
            display: flex;
            align-items: baseline;
        }

        .n8n-chat-widget .brand-header-image .online {
            background: #53c353;
            border-style: solid;
            border-color: var(--title--color-background);
            border-radius: 9999px;
            position: relative;
            width: 10px;
            height: 10px;
            right: 10px;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--close-button--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .back-button {
            background: none;
            border: none;
            color: var(--close-button--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .back-button svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .back-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 45px;
            height: 45px;
            border-radius: 9999px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 1.25rem;
            font-weight: 800;
            color: var(--title--color-font);
        }

        .n8n-chat-widget .brand-header p {
            font-size: 0.75rem;
            font-weight: 700;
            color: var(--title--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding-bottom: 100px;
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .new-conversation-socials {
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            align-items: stretch;
            padding: .5rem 0rem 0rem 0rem;
            margin: 0;
            list-style: none;
        }
        
        .n8n-chat-widget .new-conversation-socials .social {
            flex: 1;
            padding: 0.15rem 0rem 0.15rem 0rem;
        }

        .n8n-chat-widget .new-conversation-socials .social a {
            display: flex;
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 1rem;
            align-items: center;
            flex-wrap: wrap;
            justify-content: space-between;
            border-radius: 8px;
            padding: 5px 14px 5px 14px;
            background-color: rgba(0, 0, 0, 0);
            transition: background-color 0.2s ease-in-out;
        }

        .n8n-chat-widget .new-conversation-socials .social a:hover {
            background-color: rgba(0, 0, 0, 0.1);
            transition: background-color 0.2s ease-in-out;
        }

        .n8n-chat-widget .new-conversation-socials .social .app-icon {
            width: 34px;
            height: 34px;
            fill: currentColor;
        }

        .n8n-chat-widget .new-conversation-socials .social .chevron-icon {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 20px;
            font-weight: 800;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        @media screen and (max-width: 400px) {
            .n8n-chat-widget .new-chat-btn {
                width: 85%;
            }
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            /*border-radius: 12px;*/
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border: none;
            border-radius: 1.5rem 1.5rem 0.5rem 1.5rem;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 0.5rem 1.5rem 1.5rem 1.5rem;
            color: var(--chat--color-font);
            align-self: flex-start;
        }

        .n8n-chat-widget .chat-input {
            padding: 0.55rem;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: 9999px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 9999px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
            transition: transform 0.2s ease-in-out;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0px 4px 4px 0px rgba(23, 10, 8, 0.08);
            z-index: 2147483047;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            transition: opacity 0.25s ease-out;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            opacity: .5;
            transition: opacity 0.25s ease-out;
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 4px;
            text-align: center;
            /*background: var(--chat-footer--color-background);*/
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat-footer--color-font);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        .circle
        {
          display: block;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background-color: #8d8d8d;
          margin: 3px;
          
            &.scaling {
              animation: typing 1000ms ease-in-out infinite;
              animation-delay: 3600ms;
              }
        
            &.bouncing{
              animation: bounce 1000ms ease-in-out infinite;
              animation-delay: 3600ms;
              }
        }
        
        .circle:nth-child(1){
          animation-delay: 0ms;
          }
          
        .circle:nth-child(2){
          animation-delay: 333ms;
          }
          
        .circle:nth-child(3){
          animation-delay: 666ms;
          }
          
          
        @keyframes typing{
              0%
                {transform: scale(1)}
              33%
                {transform: scale(1)}
              50%
                {transform: scale(1.4)}
              100%
                {transform: scale(1)}
            }
          
        @keyframes bounce{
              0%
                {transform: translateY(0)}
              33%
                {transform: translateY(0)}
              50%
                {transform: translateY(-10px)}
              100%
                {transform: translateY(0)}
            }
    `;

    // Load Basier Circle font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/gh/KarMaPlaYzz/VeloraLab@main/font/stylesheet.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            subText: 'CHATBOT',
            sendBtnText: 'Verstuur',
            welcomeText: 'Hoi, hoe kan ik je helpen?',
            responseTimeText: 'Onze AI-agent staat 24/7 voor u klaar om u te helpen met al uw vragen.',
            startBtnText: 'Start conversatie',
            placeholderText: 'Stuur ons een bericht...',
            contactText: 'CONTACT',
            poweredBy: {
                text: 'Powered by Velora',
                link: 'https://veloralab.nl/'
            }
        },
        conditions: {
            displayOnline: 'yes',
        },
        socials: {
            whatsapp: '',
            email: '',
            phone: ''
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            chatBackgroundColor: '#ffffff',
            chatFontColor: '#333333',
            titleFontColor: '#333333',
            titleBackgroundColor: '#333333',
            chatFooterFontColor: '#333333',
            chatFooterBackgroundColor: '#333333',
            closeButtonFontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            conditions: { ...defaultConfig.conditions, ...window.ChatWidgetConfig.conditions },
            socials: { ...defaultConfig.socials, ...window.ChatWidgetConfig.socials },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.chatBackgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.chatFontColor);
    widgetContainer.style.setProperty('--n8n-title-font-color', config.style.titleFontColor);
    widgetContainer.style.setProperty('--n8n-title-background-color', config.style.titleBackgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-footer-background-color', config.style.chatFooterFontColor);
    widgetContainer.style.setProperty('--n8n-chat-footer-font-color', config.style.chatFooterBackgroundColor);
    widgetContainer.style.setProperty('--n8n-close-button-font-color', config.style.closeButtonFontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header" style="padding:24px;">
            <!--<img src="${config.branding.logo}" alt="${config.branding.name}">
            <div>
                <span>${config.branding.name}</span>
                <p style="margin:0px">${config.branding.subText}</p>
            </div>-->
            <button class="close-button">
                <!--×--> 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z"/>
                </svg>
            </button>
        </div>
        <div class="new-conversation">
            <section style="display: flex; flex-direction: column; align-items: center;">
                <h2 class="welcome-text">${config.branding.welcomeText}</h2>
                <button class="new-chat-btn">
                    <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path fill="currentColor" d="M64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L360 512C354.8 512 349.8 513.7 345.6 516.8L230.4 603.2C226.2 606.3 221.2 608 216 608C202.7 608 192 597.3 192 584L192 512L160 512C107 512 64 469 64 416z"/>
                    </svg>
                    ${config.branding.startBtnText}
                </button>
                <p class="response-text">${config.branding.responseTimeText}</p>
            </section>
            <section style="padding-top: 35px; ">
                <p style="font-weight: 650; font-size: 14px;">${config.branding.contactText}</p>
                <ul class="new-conversation-socials">
                    
                </ul>
            </section>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <button class="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M73.4 297.4C60.9 309.9 60.9 330.2 73.4 342.7L233.4 502.7C245.9 515.2 266.2 515.2 278.7 502.7C291.2 490.2 291.2 469.9 278.7 457.4L173.3 352L544 352C561.7 352 576 337.7 576 320C576 302.3 561.7 288 544 288L173.3 288L278.7 182.6C291.2 170.1 291.2 149.8 278.7 137.3C266.2 124.8 245.9 124.8 233.4 137.3L73.4 297.3z"/>
                    </svg>
                </button>
                <div class="brand-header-image">
                    <img src="${config.branding.logo}" alt="${config.branding.name}"></img>
                    <div class="brand-header-symbol"></div>
                </div>
                <div>
                    <span>${config.branding.name}</span>
                    <p style="margin:0px">${config.branding.subText}</p>
                </div>
                <button class="close-button">
                    <!--×-->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M297.4 470.6C309.9 483.1 330.2 483.1 342.7 470.6L534.7 278.6C547.2 266.1 547.2 245.8 534.7 233.3C522.2 220.8 501.9 220.8 489.4 233.3L320 402.7L150.6 233.4C138.1 220.9 117.8 220.9 105.3 233.4C92.8 245.9 92.8 266.2 105.3 278.7L297.3 470.7z"/>
                    </svg>
                </button>
            </div>
            <div class="chat-messages">
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
            <div class="chat-input">
                <textarea placeholder="${config.branding.placeholderText}" rows="1"></textarea>
                <button type="submit"></button>
            </div>
            <!-- Chat footer -->
        </div>
    `;
    //${config.branding.sendBtnText}
    
    
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M576 304C576 436.5 461.4 544 320 544C282.9 544 247.7 536.6 215.9 523.3L97.5 574.1C88.1 578.1 77.3 575.8 70.4 568.3C63.5 560.8 62 549.8 66.8 540.8L115.6 448.6C83.2 408.3 64 358.3 64 304C64 171.5 178.6 64 320 64C461.4 64 576 171.5 576 304z"/>
        </svg>`;


    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    
    const onlineBubble = chatContainer.querySelector('.brand-header-symbol');
    if (config.conditions.displayOnline == 'yes')
        onlineBubble.classList.add('online')
        
    const socialsArea = chatContainer.querySelector('.new-conversation-socials');
    if (config.socials.whatsapp != '')
        socialsArea.innerHTML += `
            <li class="social">
                <a href="${config.socials.whatsapp}" rel="noreferrer" tabindex="0" target="_blank" title="Whatsapp">
                    <span style="display:flex; align-items:center;">
                        <svg class="app-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z"/>
                        </svg>
                        <span style="padding-left: 20px; text-align: center;">Whatsapp</span>
                    </span>
                    <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
                    </svg>
                </a>
            </li>
        `;

    if (config.socials.email != '')
        socialsArea.innerHTML += `
            <li class="social">
                <a href="mailto:${config.socials.email}" rel="noreferrer" tabindex="0" target="_blank" title="Email">
                    <span style="display:flex; align-items:center;">
                        <svg class="app-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M125.4 128C91.5 128 64 155.5 64 189.4C64 190.3 64 191.1 64.1 192L64 192L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 192L575.9 192C575.9 191.1 576 190.3 576 189.4C576 155.5 548.5 128 514.6 128L125.4 128zM528 256.3L528 448C528 456.8 520.8 464 512 464L128 464C119.2 464 112 456.8 112 448L112 256.3L266.8 373.7C298.2 397.6 341.7 397.6 373.2 373.7L528 256.3zM112 189.4C112 182 118 176 125.4 176L514.6 176C522 176 528 182 528 189.4C528 193.6 526 197.6 522.7 200.1L344.2 335.5C329.9 346.3 310.1 346.3 295.8 335.5L117.3 200.1C114 197.6 112 193.6 112 189.4z"/>
                        </svg>
                        <span style="padding-left: 20px; text-align: center;">Email</span>
                    </span>
                    <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
                    </svg>
                </a>
            </li>
        `;

    if (config.socials.phone != '')
        socialsArea.innerHTML += `
            <li class="social">
                <a href="tel:${config.socials.phone}" rel="noreferrer" tabindex="0" target="_blank" title="Contact">
                    <span style="display:flex; align-items:center;">
                        <svg class="app-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path d="M144 288C144 190.8 222.8 112 320 112C417.2 112 496 190.8 496 288L496 332.8C481.9 324.6 465.5 320 448 320L432 320C405.5 320 384 341.5 384 368L384 496C384 522.5 405.5 544 432 544L448 544C501 544 544 501 544 448L544 288C544 164.3 443.7 64 320 64C196.3 64 96 164.3 96 288L96 448C96 501 139 544 192 544L208 544C234.5 544 256 522.5 256 496L256 368C256 341.5 234.5 320 208 320L192 320C174.5 320 158.1 324.7 144 332.8L144 288zM144 416C144 389.5 165.5 368 192 368L208 368L208 496L192 496C165.5 496 144 474.5 144 448L144 416zM496 416L496 448C496 474.5 474.5 496 448 496L432 496L432 368L448 368C474.5 368 496 389.5 496 416z"/>
                        </svg>
                        <span style="padding-left: 20px; text-align: center;">Contact</span>
                    </span>
                    <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
                    </svg>
                </a>
            </li>
        `;

    //const typingMessageDiv = document.createElement('div');
    const botTyping = `
        <span class="circle scaling"></span>
        <span class="circle scaling"></span>
        <span class="circle scaling"></span>
    `;
    
    //typingMessageDiv.className = 'chat-message bot';
    //typingMessageDiv.innerHTML = botTyping;
    //messagesContainer.appendChild(typingMessageDiv);
    //typingMessageDiv.querySelector('.typing').style.display = 'none';
    
    sendButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 650 650">
            <path d="M568.4 37.7C578.2 34.2 589 36.7 596.4 44C603.8 51.3 606.2 62.2 602.7 72L424.7 568.9C419.7 582.8 406.6 592 391.9 592C377.7 592 364.9 583.4 359.6 570.3L295.4 412.3C290.9 401.3 292.9 388.7 300.6 379.7L395.1 267.3C400.2 261.2 399.8 252.3 394.2 246.7C388.6 241.1 379.6 240.7 373.6 245.8L261.2 340.1C252.1 347.7 239.6 349.7 228.6 345.3L70.1 280.8C57 275.5 48.4 262.7 48.4 248.5C48.4 233.8 57.6 220.7 71.5 215.7L568.4 37.7z"/>
        </svg>`;
    
    function generateUUID() {
        return crypto.randomUUID();
    }

    var alreadyHasAChat = false

    async function startNewConversation() {
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');

        console.log(alreadyHasAChat)
        
        if (alreadyHasAChat === false)
        {
            currentSessionId = generateUUID();
            alreadyHasAChat = true
            console.log(alreadyHasAChat)
            
            initialMessage="Hallo!"
            const initialHelloMessageData = {
                action: "sendMessage",
                sessionId: currentSessionId,
                route: config.webhook.route,
                chatInput: initialMessage,
                metadata: {
                    userId: ""
                }
            };

            // add bot typing
            //typingMessageDiv.querySelector('.typing').style.display = 'block';
            console.log("Bot thinking...")
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            //botMessageDiv.textContent = botTyping;
            botMessageDiv.innerHTML = botTyping;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(initialHelloMessageData)
                });
                
                const responseData = await response.json();
    
                // hide bot typing
                //typingMessageDiv.querySelector('.typing').style.display = 'none';
                console.log("Bot done...")
    
                //botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
                botMessageDiv.innerHTML = Array.isArray(responseData) ? responseData[0].output : responseData.output;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // add bot typing
        console.log("Bot thinking...")
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        //botMessageDiv.textContent = botTyping;
        botMessageDiv.innerHTML = botTyping;
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            const data = await response.json();

            // hide bot typing
            //typingMessageDiv.querySelector('.typing').style.display = 'none';
            console.log("Bot done...")
            
            //botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            botMessageDiv.innerHTML = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });

    // Add back button handlers
    const backButton = chatContainer.querySelectorAll('.back-button');
    backButton.forEach(button => {
        button.addEventListener('click', () => {
            //chatContainer.classList.remove('open');
            chatContainer.querySelector('.brand-header').style.display = 'block';
            chatContainer.querySelector('.new-conversation').style.display = 'block';
            chatInterface.classList.remove('active');
        });
    });
})();
