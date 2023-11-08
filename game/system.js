// Intro animation
const html = document.querySelector('html');

setTimeout(function () {
  html.classList.remove('dark');
}, 100);

// Music ambience

const muteButton = document.getElementById('muteButton');
const audio = document.getElementById('backgroundMusic')
let isPlaying = false

muteButton.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause()
    muteButton.innerHTML = '<path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>'
  } else {
    audio.play()
    muteButton.innerHTML =`
    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
`  
}
  isPlaying = !isPlaying;
});

// game code by WebDevSimplified with a little bit of modifying by me
// Original source code: https://github.com/WebDevSimplified/JavaScript-Text-Adventure/blob/master/game.js

const textElement = document.getElementById('story')
const optionButtonsElement = document.getElementById('options')

// --- type writer function --- //
async function typeWriter(text, textContainer) {
  for (let i = 0; i < text.length; i++) {
    textContainer.innerHTML += text.charAt(i);
    //adjust typing speed for certain characters
    if (text.charAt(i) == '.' && i < text.length-1) {
      await new Promise(resolve => setTimeout(resolve, 1500))
    } else if (text.charAt(i) == ',' && i < text.length-1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    } else if (text.charAt(i) == '!' && i < text.length-1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    } else if (text.charAt(i) == '?' && i < text.length-1) {
      await new Promise(resolve => setTimeout(resolve, 1000)); 
    } else {
      await new Promise(resolve => setTimeout(resolve, 30)); 
    }
  }
}

async function startTypewriter(text, textContainer) {
  await typeWriter(text, textContainer);
  // You can add more text or await statements here for pauses.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Pause for 1 second
  // await typeWriter("More text to animate.", 'typewriter-text');
}

let state = {
  //hasMoney
  //barryAcknowledgement
  //sarahAcknowledgement
  //barryHope
  //sarahHope
}
const defaultTitle = document.querySelector(`head > title`).innerHTML;

// a function that restarts the whole game
function startGame() {
  if (audio.hasAttribute('src')){
    audio.removeAttribute('src');
    audio.load();
    if (isPlaying) audio.play();
  }
  const gameTitle = document.querySelector(`head > title`);
  gameTitle.innerHTML = defaultTitle
  const body = document.body;
  body.removeAttribute("style");
  state = {}
  showTextNode(1)
}

async function showTextNode(textNodeIndex) {
  textElement.innerHTML = ""
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  }
  // textElement.innerText = textNode.text;
  await startTypewriter(textNode.text, textElement); // function for the type writer animation
  
  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button');
      function buttonListener () {
        button.removeEventListener('click', buttonListener);
        selectOption(option)
      }
      button.innerText = option.text
      button.classList.add('btn')
      button.addEventListener('click', buttonListener);
      optionButtonsElement.appendChild(button)
    }
  })
}

function showOption(option) {
  return option.requiredState == null || option.requiredState(state)
}

async function selectOption(option) {
  
  // If the option has audio
  const audioUrl = option.audioUrl;
  if(audioUrl && isPlaying) {
    const playAudio = new Audio(audioUrl);
    playAudio.play();
  }

  const nextTextNodeId = option.nextText;

  // If the option wants to restart the game
  if (nextTextNodeId <= 0) {
    
    // Audio transition
    const playAudio = new Audio('game-assets/game-sfx/game-end.mp3');
    if (isPlaying) playAudio.play();

    // Dark screen animation transition
    await new Promise(resolve => {
      html.classList.add('dark');
      setTimeout(resolve, 3000)
    }); 
    startGame()
    await new Promise(resolve =>{
      html.classList.remove('dark');
      setTimeout(resolve, 3000); 
    })
    return
  }
  
  const backgroundTransition = option.backgroundTransition;

  // If the option wants to take a transition
  if (backgroundTransition) {
    await new Promise(resolve => {
      html.classList.add('dark');
      setTimeout(resolve, 3000)
    }); 
    if (backgroundTransition.audioUrl) {
      audio.src = backgroundTransition.audioUrl;
      audio.load();
      if (isPlaying) audio.play();
    }
    if (backgroundTransition.imageUrl) {
      const body = document.body;
      body.style.backgroundImage = `url(${backgroundTransition.imageUrl})`;
    }
    if (backgroundTransition.title) {
      const gameTitle = document.querySelector(`head > title`);
      gameTitle.innerHTML = backgroundTransition.title;
    }
    html.classList.remove('dark');
  }

  state = Object.assign(state, option.setState)
  showTextNode(nextTextNodeId)
}

/* Text Node template*/

/*
const textNodesExample = [
  {
    // this is the text node id to identify which node you are on
    id: 1,

    //this is the text that will display in the story container, this is for the story you want to put
    text: `You see a blue goo`,

    // this is the options that you want to put, you can put as many as you can
    options: [ 
      
      // a simple option
      {
        text: 'Leave it', // the option text
        nextText: 2, //this is where the next story will take you
      },

      // an option that gives you a state, this option will give you an item or a state that will be needed to summon an option that requires a certain state or a certain item. The state or item value is a boolean
      {
        text: `Step on it`,
        nextText: 2,
        setState: {stickyShoes: true},
      },

      // an option with an audio url, this will trigger a sound effect when you click on the option
      {
        text: 'Take the goo',
        nextText: 2,
        audioUrl: `game-assets/footsteps.mp3`,
      },

      // an option with a transition, this option will trigger a transition to another background ambience. Background image, background music, or the title of the HTML can be change with this property.
      // this option can be triggered without having every property
      {
        text: 'Ignore it and go to a village',
        nextText: 2,
        backgroundTransition: {
          imageUrl: `game-assets/background-images/village.jpg`,
          audioUrl: `game-assets/background-ambience/crowd-village.mp3`,
          title: `Village`,
        },
      },

      // an option with a required state, this option will appear if your state has the required state
      {
        text: 'Put it inside a bag',
        nextText: 2,
        requiredState: (currentState) => currentState.bag,
      },

      // an option that restarts the game, this option will restart the whole game from the start with a special sound effect transition
      {
        text: 'Restart',
        nextText: -1
      }
    ]
  },
]
*/

const textNodes = [
  {
    id: 1,
    text: `You are at a high school reunion party, and you have seen lots of your friends that you haven't seen for a long time.`,
    options: [
      {
        text: '...',
        nextText: 2,
      },
    ]
  },
  {
    id: 2,
    text: ` You really had a hard time trying to remember people's faces, but nonetheless, you enjoyed the party anyway`,
    options: [
      {
        text: '...',
        nextText: 3,
        audioUrl: 'game-assets/game-sfx/thump.mp3'
      },
    ]
  },
  {
    id: 3,
    text: `You bumped into someone`,
    options: [
      {
        text: `"Excuse me?"`,
        nextText: 4
      },
    ]
  },
  {
    id: 4,
    text: `Someone: "Hey man, long time no see"`,
    options: [
      {
        text: `"Uhh... Who are you?"`,
        nextText: 5
      },
      {
        text: `"Ayy... Buddy"`,
        nextText: 5
      },
    ]
  },
  {
    id: 5,
    text: `Someone: "It's me, Barry, have you forgotten? Wow, you are really bad at recognizing people's faces huh?`,
    options: [
      {
        text: `"Sorry, I seriously have a bad time trying to recognize anyone around here. It's just- you know? It's been a very long time,"`,
        nextText: 6
      }
    ]
  },
  {
    id: 6,
    text: `Barry: "Say, do you have the money you borrowed from me? You know the money you borrowed was pretty big."`,
    options: [
      {
        text: `"What?! Are you serious right now? That was like fifteen years ago, and you still couldn't let go?"`,
        nextText: 7
      },
      {
        text: `"What money? What are you talking about?"`,
        nextText: 7
      },
      {
        text: `"..."`,
        nextText: 7
      },
    ]
  },
  {
    id: 7,
    text: `You remembered Barry is so persistent with his money, it looks like he wouldn't let you go. Should you give him the money?`,
    options: [
     {
      text: `"Fine, here's your money,"`,
      nextText: 8,
      setState: {hasMoney: false},
      audioUrl: `game-assets/game-sfx/coins.mp3`,
     },
     {
      text: `"No Barry,"`,
      nextText: 9,
      setState: {hasMoney: true},
     } 
    ]
  },
  {
    id: 8,
    text: `Barry: "Thanks dude, by the way, if you see Jerry just let me know, it's been a long time since I saw him. And say to him that I still remember his own debt too".
    Barry leaves.`,
    options: [
      {
        text: '...',
        nextText: 10,
        setState: {barryAcknowledgement: true},
      }
    ]
  },
  {
    id: 9,
    text: `Barry: "Whatever man, I'm always watching you!"
    Barry leaves.`,
    options: [
      {
        text: '...',
        nextText: 11,
      }
    ]
  },
  {
    id: 10,
    text: `Jerry? Who is that? God, I need to check my high school book year, there are so many friends that I forgot`,
    options: [
      {
        text: '...',
        nextText: 11
      }
    ]
  },
  {
    id: 11,
    text: `Barry couldn't even take a rest about money huh?`,
    options: [
      {
        text: '...',
        nextText: 12,
      }
    ]
  },
  // Outside or inside? Choose
  {
    id: 12,
    text: `... Man this party is killing me, maybe i should go outside`,
    options: [
      {
        text: '*Stay inside*',
        nextText: 13,
      },
      {
        text: '*Go outside*',
        nextText: 25,
        audioUrl: `game-assets/game-sfx/low-bass-trumpet.mp3`,
        backgroundTransition: {
          imageUrl: `game-assets/background-images/street.jpg`,
          audioUrl: `game-assets/background-ambience/rain-and-thunder.mp3`,
          title: `Outside`,
        }
      }
    ]
  },
  // Inside branch
  {
    id: 12,
    text: `Actually, I'm just gonna stay here, who knows i might find something`,
    options: [
      {
        text: '...',
        nextText: 13,
      }
    ]
  },
  {
    id: 13,
    text: `You stayed at the party. You talked with some friends about their lives and yours too, you found lots of foods and drinks to consume, and who doesn't love free beverages? You also try to party with everyone. It's pretty much what you would expect in a party.`,
    options: [
      {
        text: '...',
        nextText: 14,
      }
    ]
  },
  {
    id: 14,
    text: `But there's one conversation that sounds odd to you`,
    options: [
      {
        text: `*listen to the conversation*`,
        nextText: 15,
      },
      {
        text: `*Don't listen to the conversation*`,
        nextText: 23,
      }
    ]
  },
  {
    id: 15,
    text: `Sarah (friend): "Have you heard of him? Gosh, that poor guy never takes a rest, couldn't he? His wife just couldn't let him sleep he just kept telling him to go to work"`,
    options: [
      {
        text: '"Who are you talking about sarah?"',
        nextText: 17,
      },
      {
        text: '"Haha yeah"',
        nextText: 16,
      },
      {
        text: '"Is it Jerry?"',
        requiredState: (currentState) => currentState.barryAcknowledgement,
        nextText: 18,
      },
    ]
  },
  {
    id: 16,
    text: `Sarah: "Excuse me but I haven't even tell you his name"`,
    options: [
      {
        text: '"Ohh uhh..."',
        nextText: 17,
      }
    ]
  },
  {
    id: 17,
    text: `Sarah : "It's Jerry, duh? He was your bully when you and Jerry were classmates, I've heard that he's not doing well in his household now, so he couldn't come to the party, poor guy."`,
    options: [
      {
        text: '"What happened to him?"',
        nextText: 19,
      },
      {
        text: `"Wait so he's a bully? He's probably a jerk to his wife"`,
        nextText: 20,
      }
    ]
  },
  {
    id: 18,
    text: `Sarah : "Yes of course it's Jerry, duh? He was your bully when you and Jerry were classmates, I've heard that he's not doing well in his household now, so he couldn't come to the party, poor guy."`,
    options: [
      {
        text: '"What happened to him?"',
        nextText: 19,
      },
      {
        text: `"Wait so he's a bully? He's probably a jerk to his wife"`,
        nextText: 20,
      }
    ]
  },
  {
    id: 19,
    text: `Sarah: "I'm not really sure what happened to him, but he sure doesn't get a good reputation around us, hey if you found him just say to him that we forgive him okay?"`,
    options: [
      {
        text: `...`,
        setState: {sarahAcknowledgement: true},
        nextText: 21,
      }
    ]
  },
  {
    id: 20,
    text: `Sarah: "Yeah if he's a bully he's probably a jerk to anyone right?"`,
    options: [
      {
        text: '...',
        nextText: 21,
      }
    ]
  },
  {
    id: 21,
    text: `Jerry? Who even is this guy?`,
    options: [
      {
        text: '...',
        nextText: 22,
      }
    ]
  },
  {
    id: 22,
    text: `Sarah: "Hey it's getting late right now, we should probably leave this place, the place is starting to get empty"`,
    options: [
      {
        text: '"Yeah Sarah, we should probably go home"',
        nextText: 24,
      }
    ]
  },
  {
    id: 23,
    text: `It's probably not important to me`,
    options: [
      {
        text: '...',
        nextText: 24,
      }
    ]
  },
  {
    id: 24,
    text: `Besides I'm getting tired, I just wanna go home now.`,
    options: [
      {
        text: '*Go outside*',
        nextText: 25,
        backgroundTransition: {
          imageUrl: `game-assets/background-images/street.jpg`,
          audioUrl: `game-assets/background-ambience/rain-and-thunder.mp3`,
          title: `Outside`,
        }
      }
    ]
  },

  //Outside branch
  {
    id: 25,
    text: `You are outside. You didn't realize that it's quite a rainy and stormy night today, how are you gonna get home right now on this stormy rainy night?`,
    options: [
      {
        text: 'Use uber to go home',
        requiredState: (currentState) => currentState.hasMoney,
        nextText: 100,
        audioUrl: `game-assets/game-sfx/low-bass-trumpet.mp3`,
        backgroundTransition: {
          imageUrl: `game-assets/background-images/apartment.jpg`,
          audioUrl: `game-assets/background-ambience/clock-ticking.mp3`,
          title: `Home`,
        },
      },
      {
        text: 'Walk to your home in this stormy rainy night',
        nextText: 101,
        audioUrl: `game-assets/game-sfx/low-bass-trumpet.mp3`,
        backgroundTransition: {
          imageUrl: `game-assets/background-images/apartment.jpg`,
          audioUrl: `game-assets/background-ambience/clock-ticking.mp3`,
          title: `Home`,
        },
      },
      {
        text: `Stay and found someone who will take you`,
        nextText: 26,
      },
    ],
  },
  {
    id: 26,
    text: `You stayed and found someone who looks familiar to you, He is just standing outside the high school reunion party, He's definitely familiar but you couldn't entirely sure who it is.`,
    options: [
      {
        text: 'Take a closer look',
        nextText: 27,
        audioUrl: `game-assets/game-sfx/footsteps.mp3`,
      }
    ]
  },
  {
    id: 27,
    text: `You take a closer look, and say hi to the man. He seems a bit shocked though`,
    options: [
      {
        text: '...',
        nextText: 28,
      }
    ]
  },
  {
    id: 28,
    text: `Someone: "Hey, I know that face. What's up man, it's me, have you forgotten?"`,
    options: [
      {
        text: '"Uhh.. Who?"',
        nextText: 29,
      }
    ]
  },
  {
    id: 29,
    text: `Someone: "It's me Jerry, jeez how long has it been?"`,
    options: [
      {
        text: `Ayy Jerry.. who?`,
        nextText: 30,
      },
      {
        text: `Ohh Jerry, I've heard you from Barry`,
        nextText: 32,
        requiredState: (currentState) => currentState.barryAcknowledgement,
      },
      {
        text: `Ohh Jerry, I've heard you from Sarah`,
        nextText: 31,
        requiredState: (currentState) => currentState.sarahAcknowledgement,
      },
    ]
  },
  {
    id: 30,
    text: `Jerry: "Ahaha you really don't remember, do you?"`,
    options: [
      {
        text: '...',
        nextText: 34,
      }
    ]
  },
  {
    id: 31,
    text: `Jerry: "Did she? wow after all these years she still remembers me?"`,
    options: [
      {
        text: '"Yeah, she says she forgives you"',
        nextText: 33,
        setState: {barryHope: true},
      }
    ]
  },
  {
    id: 32,
    text: `Jerry: "Did he? wow after all these years he still remembers me?"`,
    options: [
      {
        text: '"Yeah, he says you need to pay your debt"',
        nextText: 33,
        setState: {sarahHope: true},
      }
    ]
  },
  {
    id: 33,
    text: `Jerry: "..."`,
    options: [
      {
        text: '"Jerry?.."',
        nextText: 34,
      },
    ]
  },
  {
    id: 34,
    text: `Jerry: "By the way you seem lost, do you need to take a ride or some kind? I could take you anywhere right now. I have my car right over here,"`,
    options: [
      {
        text: '"Really? I would love to"',
        nextText: 35,
      }
    ]
  },
  {
    id: 35,
    text: `Seeing nothing wrong with this you gladly accept his offering. Besides it's raining and stormy right now, how are you supposed to go home right?`,
    options: [
      {
        text: `*Get inside Jerry's car*`,
        nextText: 36,
        audioUrl: `game-assets/game-sfx/low-bass-trumpet.mp3`,
        backgroundTransition: {
          imageUrl: `game-assets/background-images/driving-in-the-dark.jpg`,
          audioUrl: `game-assets/background-ambience/car-driving-ambience.mp3`,
          title: `The Ride`,
        },
      }
    ]
  },

  // Driving branch
  {
    id: 36,
    text: `This is the demo of the game for now, the story will expanded later on. If you have an idea what else I could add, you can contact me. For now thank you for playing my game`,
    options: [
      {
        text: 'Restart game',
        nextText: -1,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: -2,
    text: `text`,
    options: [
      {
        text: '...',
        nextText: -2,
      }
    ]
  },
  {
    id: 100,
    text: `Ending 1
    You safely got back home, however, you feel like you are missing something great that happened, something that you should've resolved by yourself. But nonetheless, you got home safely`,
    options: [
      {
        text: 'Restart the game',
        nextText: -2,
      }
    ]
  },
  {
    id: 101,
    text: `Ending 2
    You got back home in a wet suit, however, you feel like you are missing something great that happened, something that you should've resolved. But nonetheless, you got home safely`,
    options: [
      {
        text: 'Restart the game',
        nextText: -2,
      }
    ]
  },
]

startGame()
