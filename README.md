# Raspberry Pi Steganography

## About This Project

Recently iv been spending a lot of time looking into cryptography and steganography and its got me thinking of some new projects. I love the idea of turning a raspberry pi into an enigma type machine where only two identically configured pi's would be able to extract the hidden messages. I originally planned on making this work exactly like an enigma machine(possibly coming soon), but decided with modern tech, a modern form of hiding messages (steganography) would be more appropriate. The concept is pretty simple, two identically setup pi's would listen for new storage devices. once one is inserted it would then look at the files on the device and either hide or reveal the hidden messages. Realistically the practicality of this project is pretty low, however it gives me some good hands on experience of the stuff i have been researching.

## Requirements

- Raspberry Pi
- Node
- Node-gyp
- AutoMount
- PM2*
- USB Storage Device

*Optional

## Set up Guide
Sadly in this initial version of the app, There is still a fair bit of user setup required. I have plans to improve this in the future but for now the project has been benched.

I have set this up on a grand total of 1 Raspberry pi, so if anyone finds this repo and has issues setting it up please raise an issue and i will try help out where possible.

1. Install the latest node and npm on your raspberry pi.
	* There are several great tutorials online for this.
2. Install [usbmount](https://wiki.debian.org/usbmount) to automagically mount USB devices in headless mode
	* If you are using a Pi 4 you will need to modify `/lib/systemd/system/systemd-udevd.service`, Changing `PrivateMounts=yes` to `PrivateMounts=no`
	* Run `sudo sed -i '/\bMOUNTOPTIONS\b/s/\("\?\)$/,user,umask=000\1/' /etc/usbmount/usbmount.conf` to ensure usbmount will allow our node app to access our mounted flash drives.
3. Install [Node-gyp](https://github.com/nodejs/node-gyp).
4. Checkout the app on your pi and navigate to the project directory in the terminal.
5. Run `npm install` & `node app.js` and the app should now be listening for new USB Devices.

### Optional Steps
The app uses a config file in the root of the project to allow custom encryption credentials to ensure if your data is extracted from the image, it remains protected. This config.json file contains 2 variables that you can change to your pleasing. Its important to note, that only a pi with the same config will be able to extract and decrypt your message. Changing this file will require a restart of the app.
**If the IV variable does not have a length of 14, it will use the default IV of 14 0's.**

Id also highly recommend installing PM2 to node to daemonize the app and allow it to run in the backround and run on start up. Iv included a few useful resources below which will explain this process better than i could.

[Node js PM2 tutorial](https://medium.com/@rahulmuthu80/how-to-setup-pm2-and-run-node-js-applications-fit-devops-adbc20bb45ad)
[PM2 Docs](https://pm2.io/docs/plus/overview/)

## How to Use

### Embed a Message
To embed a message simple have a png file and a text file named `message.txt` with your desired message in the root of your USB Flash Drive. The application will then scan for those files and if both are found, encrypt and embed the message. The app will then delete both these files leaving a new png file of the same name prefixed with "steg_".

### Extract a message
When extracting a message the app will simply look for any png files which start with "steg_" and attempt to extract any messages to a .txt file.

