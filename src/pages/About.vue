
<template>
  <h1>About SignedMail</h1>

  <div>
    This application is designed to be: 
    - Simple
    - Reproducible
    - Portable
    - Offline

    I wanted this tool because it's creepy how some companies are monitoring my messages and I'm seeing ads based on what I say or see from others. 

    While the message itself may be private, the interaction is not anonymous.

    Understanding encryption with a story

    Personas:

    Alice, your friend who lives on the moon.
    Mark, owner of the only social network in the world that promises End-To-End encryption to prevent people from spying on you.
    You, who found out about Mark having a 6th toe but Mark is apparently banning anyone who mentions it. 
    
    So, you want to tell Alice about Mark's 6th toe. 

    1) You and Alice to adopt SignedMail (or a similar app that has PGP).
    2) Alice created the public and private key.
    3) Alice gives you her the public key in chat.
    4) You encrypt message with Alice's public key.
    5) You open up the chat with Alice and send the encrypted message to her.
    6) Alice decrypts it and laughs. 
    7) Later, you heard that the social network's AI had been reviewing your chat and did not pick up what you send to Alice.

    Without encryption
    1) You open up the chat with Alice.
    2) You start typing about Mark.
    4) While you type, you suddenly get logged out.
    5) You can not log back in any more and get a message "You have been banned for violating the terms of service".
    6) You can't create a new account as the ban is recorded against your computer.
    7) Later, you find out that your message was never sent as it was quickly picked up by the social network's AI as soon there was "mark" and "toe" typed.

    Understanding verification with a story

    Personas:

    Alice, a toilet paper supplier.
    Bill, a rogue employee of a highly trusted email provider.
    You, who needs to order more toilet paper. 
    
    So, you meet with Alice. You both establish a relationship for toilet paper supply.

    1) You and Alice to adopt SignedMail (or a similar app that has PGP).
    2) Alice created the public and private key.
    3) Alice gives you her public key, phone and email address.
    4) At home, you email Alice for more toilet paper.
    5) Alice emails back the bank details with an encryption signature. 
    6) You verify the signature with Alice's public key.
    7) It doesn't match.
    8) You call up Alice about why the signature does not match. She said you never sent an email to her.
    9) Later, it turns out that Bill was on email accounts, including Alice's. And had been intercepting requests and confirmations. 
    10) You did not lose any money by verifying the bank details.

    Without encryption
    1) Alice gives you her phone and email address.
    2) At home, you email Alice for more toilet paper.
    3) Alice emails back the bank details but said it may take some time for delivery.
    4) You send the money.
    5) You email to confirm the money has been sent.
    6) Alice confirms it has been received and it will be processed.
    7) A month later, you call up Alice, demanding to know why it has taken so long.
    8) Alice is confused and said she never sent an email.
    9) Later, it turns out that Bill was on email accounts, including Alice's. And had been intercepting requests and confirmations. 
    10) You lost the money.

    Beginner sources to understanding PGP:
    - PGP explained: https://www.uperesia.com/pgp-explained

    Original PGP sources:
    - https://en.wikipedia.org/wiki/Pretty_Good_Privacy
    - https://www.openpgp.org/

    The codes 
    You are most welcome to run this application yourself. Please follow the instructions in the README.md

    For help understanding Quasar/Vue/application development, please see: https://quasar.dev/video-tutorials

    It's encouraged to try to implement this project with PGP as the more people that welcome it, the less likely it is for those message-hungry companies to outlaw/punish users who value encryption over disclosure.

    This application is powered with thanks to:
    - PGP
    - Vue
    - Quasar
    - OpenPGP.js (openpgp)
    - Cordova Plugin Fingerprint All-In-One (cordova-plugin-fingerprint-aio)

  </div>

</template>

<script>
export default {

}
</script>

<style>

</style>